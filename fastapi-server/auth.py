from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import hashlib
import secrets

from config import settings
from database import get_db, User, APIKey

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return {"email": email, "user_id": payload.get("user_id")}
    except JWTError:
        return None

def generate_api_key() -> str:
    """Generate a new API key"""
    return f"docamy_{secrets.token_urlsafe(32)}"

def hash_api_key(api_key: str) -> str:
    """Hash an API key for storage"""
    return hashlib.sha256(api_key.encode()).hexdigest()

async def verify_api_key(api_key: str, db: Session) -> Optional[User]:
    """Verify API key and return associated user"""
    try:
        key_hash = hash_api_key(api_key)
        
        api_key_record = db.query(APIKey).filter(
            APIKey.key_hash == key_hash,
            APIKey.is_active == True
        ).first()
        
        if not api_key_record:
            return None
        
        # Update last used timestamp
        api_key_record.last_used = datetime.utcnow()
        db.commit()
        
        # Get associated user
        user = db.query(User).filter(User.id == api_key_record.user_id).first()
        return user
        
    except Exception:
        return None

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Get current user from JWT token or API key"""
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    
    # Try JWT token first
    token_data = verify_token(token)
    if token_data:
        user = db.query(User).filter(User.email == token_data["email"]).first()
        if user and user.is_active:
            return {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "is_active": user.is_active
            }
    
    # Try API key
    if token.startswith("docamy_"):
        user = await verify_api_key(token, db)
        if user and user.is_active:
            return {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "is_active": user.is_active
            }
    
    raise credentials_exception

async def get_current_active_user(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get current active user"""
    if not current_user["is_active"]:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def create_user(db: Session, email: str, password: str, full_name: Optional[str] = None) -> User:
    """Create a new user"""
    hashed_password = get_password_hash(password)
    
    user = User(
        email=email,
        hashed_password=hashed_password,
        full_name=full_name,
        is_active=True
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate user with email and password"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def create_user_api_key(
    db: Session,
    user_id: str,
    name: str,
    expires_at: Optional[datetime] = None
) -> tuple[str, APIKey]:
    """Create a new API key for user"""
    api_key = generate_api_key()
    key_hash = hash_api_key(api_key)
    
    api_key_record = APIKey(
        user_id=user_id,
        key_hash=key_hash,
        name=name,
        expires_at=expires_at,
        is_active=True
    )
    
    db.add(api_key_record)
    db.commit()
    db.refresh(api_key_record)
    
    return api_key, api_key_record