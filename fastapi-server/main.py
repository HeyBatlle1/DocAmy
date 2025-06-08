from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import httpx
import os
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import asyncio
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import redis.asyncio as redis

from models import (
    ConversationRequest, 
    MessageRequest, 
    ConversationResponse,
    MessageResponse,
    WebhookEvent,
    HealthResponse,
    ErrorResponse
)
from config import settings
from database import get_db, init_db
from auth import verify_api_key, get_current_user
from services.tavus_service import TavusService
from services.conversation_service import ConversationService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Redis for rate limiting
redis_client = redis.from_url(settings.REDIS_URL)
limiter = Limiter(key_func=get_remote_address, storage_uri=settings.REDIS_URL)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("🚀 Starting DocAmy FastAPI Server...")
    await init_db()
    logger.info("✅ Database initialized")
    
    # Test Tavus API connection
    tavus_service = TavusService()
    if await tavus_service.test_connection():
        logger.info("✅ Tavus API connection verified")
    else:
        logger.warning("⚠️ Tavus API connection failed")
    
    yield
    
    # Shutdown
    logger.info("🔄 Shutting down DocAmy FastAPI Server...")
    await redis_client.close()

# Create FastAPI app
app = FastAPI(
    title="DocAmy API",
    description="AI-Powered Video Conversations API with Tavus Integration",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Security scheme
security = HTTPBearer()

# Services
tavus_service = TavusService()
conversation_service = ConversationService()

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint"""
    return {
        "message": "DocAmy FastAPI Server",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
@limiter.limit("30/minute")
async def health_check(request: Request):
    """Health check endpoint"""
    try:
        # Check database connection
        db_status = await conversation_service.health_check()
        
        # Check Tavus API
        tavus_status = await tavus_service.test_connection()
        
        # Check Redis
        redis_status = await redis_client.ping()
        
        return HealthResponse(
            status="healthy" if all([db_status, tavus_status, redis_status]) else "degraded",
            timestamp=datetime.utcnow(),
            services={
                "database": "healthy" if db_status else "unhealthy",
                "tavus_api": "healthy" if tavus_status else "unhealthy",
                "redis": "healthy" if redis_status else "unhealthy"
            },
            version="2.0.0"
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return HealthResponse(
            status="unhealthy",
            timestamp=datetime.utcnow(),
            services={
                "database": "unknown",
                "tavus_api": "unknown", 
                "redis": "unknown"
            },
            version="2.0.0",
            error=str(e)
        )

@app.post("/api/v2/conversations", response_model=ConversationResponse)
@limiter.limit("10/minute")
async def create_conversation(
    request: Request,
    conversation_req: ConversationRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Create a new conversation with Tavus"""
    try:
        # Create conversation with Tavus
        tavus_response = await tavus_service.create_conversation(
            replica_id=conversation_req.replica_id,
            persona_id=conversation_req.persona_id,
            properties=conversation_req.properties
        )
        
        # Store in database
        conversation = await conversation_service.create_conversation(
            db=db,
            user_id=current_user["id"],
            tavus_conversation_id=tavus_response["conversation_id"],
            name=conversation_req.name,
            replica_id=conversation_req.replica_id,
            persona_id=conversation_req.persona_id
        )
        
        # Background task to monitor conversation status
        background_tasks.add_task(
            monitor_conversation_status,
            tavus_response["conversation_id"]
        )
        
        return ConversationResponse(
            id=conversation.id,
            tavus_conversation_id=tavus_response["conversation_id"],
            name=conversation.name,
            status=conversation.status,
            created_at=conversation.created_at,
            video_url=tavus_response.get("video_url"),
            stream_url=tavus_response.get("stream_url")
        )
        
    except Exception as e:
        logger.error(f"Error creating conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v2/conversations/{conversation_id}/messages", response_model=MessageResponse)
@limiter.limit("20/minute")
async def send_message(
    request: Request,
    conversation_id: str,
    message_req: MessageRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Send a message to a conversation"""
    try:
        # Get conversation from database
        conversation = await conversation_service.get_conversation(
            db=db,
            conversation_id=conversation_id,
            user_id=current_user["id"]
        )
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Send message to Tavus
        tavus_response = await tavus_service.send_message(
            conversation_id=conversation.tavus_conversation_id,
            text=message_req.text
        )
        
        # Store message in database
        message = await conversation_service.add_message(
            db=db,
            conversation_id=conversation.id,
            content=message_req.text,
            message_type="user"
        )
        
        # Store AI response
        if tavus_response.get("response_text"):
            await conversation_service.add_message(
                db=db,
                conversation_id=conversation.id,
                content=tavus_response["response_text"],
                message_type="assistant",
                video_url=tavus_response.get("video_url")
            )
        
        return MessageResponse(
            id=message.id,
            conversation_id=conversation_id,
            content=message_req.text,
            type="user",
            timestamp=message.created_at,
            video_url=tavus_response.get("video_url"),
            stream_url=tavus_response.get("stream_url"),
            status=tavus_response.get("status", "processing")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v2/conversations/{conversation_id}", response_model=ConversationResponse)
@limiter.limit("60/minute")
async def get_conversation(
    request: Request,
    conversation_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Get conversation details"""
    try:
        conversation = await conversation_service.get_conversation(
            db=db,
            conversation_id=conversation_id,
            user_id=current_user["id"]
        )
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Get latest status from Tavus
        tavus_status = await tavus_service.get_conversation_status(
            conversation.tavus_conversation_id
        )
        
        return ConversationResponse(
            id=conversation.id,
            tavus_conversation_id=conversation.tavus_conversation_id,
            name=conversation.name,
            status=tavus_status.get("status", conversation.status),
            created_at=conversation.created_at,
            updated_at=conversation.updated_at,
            video_url=tavus_status.get("video_url"),
            stream_url=tavus_status.get("stream_url")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v2/conversations", response_model=List[ConversationResponse])
@limiter.limit("30/minute")
async def list_conversations(
    request: Request,
    skip: int = 0,
    limit: int = 20,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """List user conversations"""
    try:
        conversations = await conversation_service.list_conversations(
            db=db,
            user_id=current_user["id"],
            skip=skip,
            limit=limit
        )
        
        return [
            ConversationResponse(
                id=conv.id,
                tavus_conversation_id=conv.tavus_conversation_id,
                name=conv.name,
                status=conv.status,
                created_at=conv.created_at,
                updated_at=conv.updated_at
            )
            for conv in conversations
        ]
        
    except Exception as e:
        logger.error(f"Error listing conversations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/v2/conversations/{conversation_id}")
@limiter.limit("10/minute")
async def delete_conversation(
    request: Request,
    conversation_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Delete a conversation"""
    try:
        conversation = await conversation_service.get_conversation(
            db=db,
            conversation_id=conversation_id,
            user_id=current_user["id"]
        )
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Delete from Tavus
        await tavus_service.delete_conversation(conversation.tavus_conversation_id)
        
        # Delete from database
        await conversation_service.delete_conversation(
            db=db,
            conversation_id=conversation_id,
            user_id=current_user["id"]
        )
        
        return {"message": "Conversation deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v2/webhooks/tavus")
@limiter.limit("100/minute")
async def tavus_webhook(
    request: Request,
    webhook_event: WebhookEvent,
    background_tasks: BackgroundTasks
):
    """Handle Tavus webhook events"""
    try:
        # Verify webhook signature
        signature = request.headers.get("x-tavus-signature")
        if not tavus_service.verify_webhook_signature(
            payload=await request.body(),
            signature=signature
        ):
            raise HTTPException(status_code=401, detail="Invalid webhook signature")
        
        # Process webhook event in background
        background_tasks.add_task(
            process_webhook_event,
            webhook_event
        )
        
        return {"status": "received"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v2/replicas", response_model=List[Dict[str, Any]])
@limiter.limit("30/minute")
async def list_replicas(
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """List available Tavus replicas"""
    try:
        replicas = await tavus_service.list_replicas()
        return replicas
    except Exception as e:
        logger.error(f"Error listing replicas: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v2/personas", response_model=List[Dict[str, Any]])
@limiter.limit("30/minute")
async def list_personas(
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """List available Tavus personas"""
    try:
        personas = await tavus_service.list_personas()
        return personas
    except Exception as e:
        logger.error(f"Error listing personas: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Background tasks
async def monitor_conversation_status(tavus_conversation_id: str):
    """Monitor conversation status and update database"""
    max_attempts = 30
    attempt = 0
    
    while attempt < max_attempts:
        try:
            status = await tavus_service.get_conversation_status(tavus_conversation_id)
            
            if status.get("status") in ["completed", "error"]:
                # Update database with final status
                async with get_db() as db:
                    await conversation_service.update_conversation_status(
                        db=db,
                        tavus_conversation_id=tavus_conversation_id,
                        status=status["status"],
                        video_url=status.get("video_url")
                    )
                break
                
            await asyncio.sleep(10)  # Wait 10 seconds before next check
            attempt += 1
            
        except Exception as e:
            logger.error(f"Error monitoring conversation {tavus_conversation_id}: {e}")
            break

async def process_webhook_event(webhook_event: WebhookEvent):
    """Process Tavus webhook events"""
    try:
        async with get_db() as db:
            await conversation_service.handle_webhook_event(
                db=db,
                event=webhook_event
            )
    except Exception as e:
        logger.error(f"Error processing webhook event: {e}")

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=exc.detail,
            status_code=exc.status_code,
            timestamp=datetime.utcnow()
        ).dict()
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal server error",
            status_code=500,
            timestamp=datetime.utcnow()
        ).dict()
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )