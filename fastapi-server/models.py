from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class ConversationStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    ERROR = "error"
    PROCESSING = "processing"

class MessageType(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"

class WebhookEventType(str, Enum):
    VIDEO_GENERATED = "conversation.video_generated"
    COMPLETED = "conversation.completed"
    ERROR = "conversation.error"

class ConversationProperties(BaseModel):
    max_duration: Optional[int] = Field(default=30, ge=5, le=300)
    language: Optional[str] = Field(default="en")
    enable_streaming: Optional[bool] = Field(default=True)
    video_chat_enabled: Optional[bool] = Field(default=True)
    callback_url: Optional[str] = None

class ConversationRequest(BaseModel):
    replica_id: str = Field(..., description="Tavus replica ID")
    persona_id: str = Field(..., description="Tavus persona ID")
    name: Optional[str] = Field(default=None, description="Conversation name")
    properties: Optional[ConversationProperties] = Field(default_factory=ConversationProperties)
    
    @validator('replica_id', 'persona_id')
    def validate_ids(cls, v):
        if not v or len(v) < 5:
            raise ValueError('ID must be at least 5 characters long')
        return v

class MessageRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="Message text")
    
    @validator('text')
    def validate_text(cls, v):
        if not v.strip():
            raise ValueError('Message text cannot be empty')
        return v.strip()

class ConversationResponse(BaseModel):
    id: str
    tavus_conversation_id: str
    name: str
    status: ConversationStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    video_url: Optional[str] = None
    stream_url: Optional[str] = None
    message_count: Optional[int] = 0

class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    content: str
    type: MessageType
    timestamp: datetime
    video_url: Optional[str] = None
    stream_url: Optional[str] = None
    status: Optional[str] = None

class WebhookEventData(BaseModel):
    video_url: Optional[str] = None
    error_message: Optional[str] = None
    status: str

class WebhookEvent(BaseModel):
    event_type: WebhookEventType
    conversation_id: str
    data: WebhookEventData
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    services: Dict[str, str]
    version: str
    error: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str
    status_code: int
    timestamp: datetime
    details: Optional[Dict[str, Any]] = None

class UserCreate(BaseModel):
    email: str = Field(..., regex=r'^[^@]+@[^@]+\.[^@]+$')
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    created_at: datetime
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    email: Optional[str] = None

class ReplicaResponse(BaseModel):
    id: str
    name: str
    avatar_url: Optional[str] = None
    voice_id: Optional[str] = None
    status: str

class PersonaResponse(BaseModel):
    id: str
    name: str
    context: Optional[str] = None
    instructions: Optional[str] = None
    status: str

class ConversationStats(BaseModel):
    total_conversations: int
    active_conversations: int
    total_messages: int
    avg_conversation_length: float
    most_active_day: str

class UsageStats(BaseModel):
    api_calls_today: int
    api_calls_this_month: int
    video_minutes_generated: float
    storage_used_mb: float
    rate_limit_remaining: int