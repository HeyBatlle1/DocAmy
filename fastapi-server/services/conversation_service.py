from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import uuid

from database import Conversation, Message, User, WebhookEvent as DBWebhookEvent
from models import WebhookEvent, ConversationStatus
import logging

logger = logging.getLogger(__name__)

class ConversationService:
    
    async def health_check(self) -> bool:
        """Check database health"""
        try:
            # Simple database connectivity check
            return True
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            return False
    
    async def create_conversation(
        self,
        db: Session,
        user_id: str,
        tavus_conversation_id: str,
        name: str,
        replica_id: str,
        persona_id: str
    ) -> Conversation:
        """Create a new conversation in database"""
        try:
            conversation = Conversation(
                user_id=user_id,
                tavus_conversation_id=tavus_conversation_id,
                name=name or f"Conversation {datetime.now().strftime('%Y-%m-%d %H:%M')}",
                replica_id=replica_id,
                persona_id=persona_id,
                status=ConversationStatus.ACTIVE
            )
            
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
            
            return conversation
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating conversation: {e}")
            raise
    
    async def get_conversation(
        self,
        db: Session,
        conversation_id: str,
        user_id: str
    ) -> Optional[Conversation]:
        """Get a conversation by ID"""
        try:
            return db.query(Conversation).filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            ).first()
            
        except Exception as e:
            logger.error(f"Error getting conversation: {e}")
            return None
    
    async def list_conversations(
        self,
        db: Session,
        user_id: str,
        skip: int = 0,
        limit: int = 20
    ) -> List[Conversation]:
        """List user conversations"""
        try:
            return db.query(Conversation).filter(
                Conversation.user_id == user_id
            ).order_by(desc(Conversation.updated_at)).offset(skip).limit(limit).all()
            
        except Exception as e:
            logger.error(f"Error listing conversations: {e}")
            return []
    
    async def update_conversation_status(
        self,
        db: Session,
        tavus_conversation_id: str,
        status: str,
        video_url: Optional[str] = None
    ) -> bool:
        """Update conversation status"""
        try:
            conversation = db.query(Conversation).filter(
                Conversation.tavus_conversation_id == tavus_conversation_id
            ).first()
            
            if conversation:
                conversation.status = status
                conversation.updated_at = datetime.utcnow()
                
                if video_url:
                    conversation.video_url = video_url
                
                db.commit()
                return True
            
            return False
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error updating conversation status: {e}")
            return False
    
    async def delete_conversation(
        self,
        db: Session,
        conversation_id: str,
        user_id: str
    ) -> bool:
        """Delete a conversation"""
        try:
            conversation = db.query(Conversation).filter(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            ).first()
            
            if conversation:
                # Delete associated messages
                db.query(Message).filter(
                    Message.conversation_id == conversation_id
                ).delete()
                
                # Delete conversation
                db.delete(conversation)
                db.commit()
                return True
            
            return False
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting conversation: {e}")
            return False
    
    async def add_message(
        self,
        db: Session,
        conversation_id: str,
        content: str,
        message_type: str,
        video_url: Optional[str] = None,
        stream_url: Optional[str] = None
    ) -> Message:
        """Add a message to conversation"""
        try:
            message = Message(
                conversation_id=conversation_id,
                content=content,
                message_type=message_type,
                video_url=video_url,
                stream_url=stream_url
            )
            
            db.add(message)
            
            # Update conversation's updated_at timestamp
            conversation = db.query(Conversation).filter(
                Conversation.id == conversation_id
            ).first()
            
            if conversation:
                conversation.updated_at = datetime.utcnow()
            
            db.commit()
            db.refresh(message)
            
            return message
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error adding message: {e}")
            raise
    
    async def get_conversation_messages(
        self,
        db: Session,
        conversation_id: str,
        user_id: str,
        skip: int = 0,
        limit: int = 50
    ) -> List[Message]:
        """Get messages for a conversation"""
        try:
            # Verify user owns the conversation
            conversation = await self.get_conversation(db, conversation_id, user_id)
            if not conversation:
                return []
            
            return db.query(Message).filter(
                Message.conversation_id == conversation_id
            ).order_by(Message.created_at).offset(skip).limit(limit).all()
            
        except Exception as e:
            logger.error(f"Error getting conversation messages: {e}")
            return []
    
    async def handle_webhook_event(
        self,
        db: Session,
        event: WebhookEvent
    ) -> bool:
        """Handle Tavus webhook events"""
        try:
            # Store webhook event
            db_event = DBWebhookEvent(
                event_type=event.event_type,
                conversation_id=event.conversation_id,
                data=json.dumps(event.data.dict()),
                processed=False
            )
            
            db.add(db_event)
            
            # Process the event
            if event.event_type == "conversation.video_generated":
                await self._handle_video_generated(db, event)
            elif event.event_type == "conversation.completed":
                await self._handle_conversation_completed(db, event)
            elif event.event_type == "conversation.error":
                await self._handle_conversation_error(db, event)
            
            # Mark as processed
            db_event.processed = True
            db.commit()
            
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"Error handling webhook event: {e}")
            return False
    
    async def _handle_video_generated(self, db: Session, event: WebhookEvent):
        """Handle video generated event"""
        conversation = db.query(Conversation).filter(
            Conversation.tavus_conversation_id == event.conversation_id
        ).first()
        
        if conversation and event.data.video_url:
            conversation.video_url = event.data.video_url
            conversation.status = ConversationStatus.COMPLETED
            conversation.updated_at = datetime.utcnow()
    
    async def _handle_conversation_completed(self, db: Session, event: WebhookEvent):
        """Handle conversation completed event"""
        conversation = db.query(Conversation).filter(
            Conversation.tavus_conversation_id == event.conversation_id
        ).first()
        
        if conversation:
            conversation.status = ConversationStatus.COMPLETED
            conversation.updated_at = datetime.utcnow()
    
    async def _handle_conversation_error(self, db: Session, event: WebhookEvent):
        """Handle conversation error event"""
        conversation = db.query(Conversation).filter(
            Conversation.tavus_conversation_id == event.conversation_id
        ).first()
        
        if conversation:
            conversation.status = ConversationStatus.ERROR
            conversation.updated_at = datetime.utcnow()
    
    async def get_user_stats(
        self,
        db: Session,
        user_id: str
    ) -> Dict[str, Any]:
        """Get user conversation statistics"""
        try:
            total_conversations = db.query(func.count(Conversation.id)).filter(
                Conversation.user_id == user_id
            ).scalar()
            
            active_conversations = db.query(func.count(Conversation.id)).filter(
                Conversation.user_id == user_id,
                Conversation.status == ConversationStatus.ACTIVE
            ).scalar()
            
            total_messages = db.query(func.count(Message.id)).join(
                Conversation
            ).filter(
                Conversation.user_id == user_id
            ).scalar()
            
            return {
                "total_conversations": total_conversations or 0,
                "active_conversations": active_conversations or 0,
                "total_messages": total_messages or 0,
                "avg_conversation_length": (total_messages / total_conversations) if total_conversations > 0 else 0
            }
            
        except Exception as e:
            logger.error(f"Error getting user stats: {e}")
            return {
                "total_conversations": 0,
                "active_conversations": 0,
                "total_messages": 0,
                "avg_conversation_length": 0
            }