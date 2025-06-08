from pydantic import BaseSettings, Field
from typing import List
import os

class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "DocAmy FastAPI"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = Field(default=False, env="DEBUG")
    
    # Server settings
    HOST: str = Field(default="0.0.0.0", env="HOST")
    PORT: int = Field(default=8001, env="PORT")
    
    # Security
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:5176", "http://localhost:3000"],
        env="ALLOWED_ORIGINS"
    )
    ALLOWED_HOSTS: List[str] = Field(
        default=["localhost", "127.0.0.1"],
        env="ALLOWED_HOSTS"
    )
    
    # Database
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    
    # Redis
    REDIS_URL: str = Field(default="redis://localhost:6379", env="REDIS_URL")
    
    # Tavus API
    TAVUS_API_KEY: str = Field(..., env="TAVUS_API_KEY")
    TAVUS_API_BASE: str = Field(
        default="https://tavusapi.com/v2",
        env="TAVUS_API_BASE"
    )
    TAVUS_WEBHOOK_SECRET: str = Field(..., env="TAVUS_WEBHOOK_SECRET")
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = Field(default=60, env="RATE_LIMIT_PER_MINUTE")
    
    # File upload
    MAX_FILE_SIZE: int = Field(default=10 * 1024 * 1024, env="MAX_FILE_SIZE")  # 10MB
    UPLOAD_DIR: str = Field(default="uploads", env="UPLOAD_DIR")
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    
    # Monitoring
    SENTRY_DSN: str = Field(default="", env="SENTRY_DSN")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()