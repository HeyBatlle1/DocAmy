# DocAmy FastAPI Server

A production-ready FastAPI backend for DocAmy AI video conversations with comprehensive Tavus API integration.

## 🚀 Features

- **FastAPI Framework**: Modern, fast, and auto-documented API
- **Tavus Integration**: Complete wrapper for Tavus video AI API
- **PostgreSQL Database**: Robust data persistence with SQLAlchemy
- **Redis Caching**: High-performance caching and rate limiting
- **JWT Authentication**: Secure user authentication and authorization
- **API Key Management**: Generate and manage API keys for external access
- **Rate Limiting**: Protect against abuse with configurable limits
- **Webhook Support**: Handle Tavus events in real-time
- **Docker Support**: Easy deployment with Docker and docker-compose
- **Auto Documentation**: Interactive API docs with Swagger UI

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 13+
- Redis 6+
- Tavus API key

## 🛠️ Installation

### Local Development

1. **Clone and setup**
   ```bash
   cd fastapi-server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb docamy_db
   
   # Run migrations (auto-created on startup)
   python main.py
   ```

4. **Start Redis**
   ```bash
   redis-server
   ```

5. **Run the server**
   ```bash
   uvicorn main:app --reload --port 8001
   ```

### Docker Deployment

1. **Using docker-compose**
   ```bash
   # Copy environment file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start all services
   docker-compose up -d
   ```

2. **Individual containers**
   ```bash
   # Build the image
   docker build -t docamy-api .
   
   # Run with environment variables
   docker run -p 8001:8001 --env-file .env docamy-api
   ```

## 🔧 Configuration

### Environment Variables

```env
# App Settings
DEBUG=false
SECRET_KEY=your-super-secret-key-change-this-in-production
HOST=0.0.0.0
PORT=8001

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/docamy_db

# Redis
REDIS_URL=redis://localhost:6379

# Tavus API
TAVUS_API_KEY=your_tavus_api_key_here
TAVUS_API_BASE=https://tavusapi.com/v2
TAVUS_WEBHOOK_SECRET=your_webhook_secret_here

# Security
ALLOWED_ORIGINS=["http://localhost:5176","https://yourdomain.com"]
ALLOWED_HOSTS=["localhost","yourdomain.com"]
```

## 📚 API Documentation

### Interactive Documentation

- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

### Authentication

The API supports two authentication methods:

1. **JWT Tokens** (for web applications)
2. **API Keys** (for external integrations)

#### Getting an API Key

```bash
# Create a user account first, then generate an API key
curl -X POST "http://localhost:8001/api/v2/auth/api-keys" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My API Key"}'
```

### Core Endpoints

#### Conversations

```bash
# Create conversation
POST /api/v2/conversations
{
  "replica_id": "r89d844f2b467046d54fef9d08619d180588edea6160",
  "persona_id": "p38f53895b11",
  "name": "Customer Support Chat",
  "properties": {
    "max_duration": 30,
    "language": "en",
    "enable_streaming": true
  }
}

# Send message
POST /api/v2/conversations/{conversation_id}/messages
{
  "text": "Hello, I need help with my account"
}

# Get conversation
GET /api/v2/conversations/{conversation_id}

# List conversations
GET /api/v2/conversations?skip=0&limit=20
```

#### Webhooks

```bash
# Tavus webhook endpoint
POST /api/v2/webhooks/tavus
```

#### System

```bash
# Health check
GET /health

# List replicas
GET /api/v2/replicas

# List personas
GET /api/v2/personas
```

## 🏗️ Architecture

### Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    full_name VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    tavus_conversation_id VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    replica_id VARCHAR NOT NULL,
    persona_id VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'active',
    video_url VARCHAR,
    stream_url VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    content TEXT NOT NULL,
    message_type VARCHAR NOT NULL,
    video_url VARCHAR,
    stream_url VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FastAPI App   │    │   Tavus API     │    │   PostgreSQL    │
│                 │◄──►│                 │    │                 │
│  - Routes       │    │  - Video AI     │    │  - Conversations│
│  - Auth         │    │  - Replicas     │    │  - Messages     │
│  - Validation   │    │  - Personas     │    │  - Users        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Redis       │    │   Webhooks      │    │   Background    │
│                 │    │                 │    │     Tasks       │
│  - Rate Limit   │    │  - Real-time    │    │                 │
│  - Caching      │    │    Updates      │    │  - Monitoring   │
│  - Sessions     │    │  - Status       │    │  - Cleanup      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔒 Security Features

- **Rate Limiting**: Configurable per-endpoint limits
- **CORS Protection**: Whitelist allowed origins
- **Input Validation**: Pydantic models for all inputs
- **SQL Injection Protection**: SQLAlchemy ORM
- **Password Hashing**: bcrypt with salt
- **JWT Security**: Signed tokens with expiration
- **API Key Hashing**: SHA-256 hashed storage
- **Webhook Verification**: HMAC signature validation

## 📊 Monitoring & Logging

### Health Checks

```bash
curl http://localhost:8001/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": "healthy",
    "tavus_api": "healthy",
    "redis": "healthy"
  },
  "version": "2.0.0"
}
```

### Logging

Logs are structured and include:
- Request/response details
- Error tracking
- Performance metrics
- Security events

## 🚀 Deployment

### Production Checklist

- [ ] Set strong `SECRET_KEY`
- [ ] Configure production database
- [ ] Set up Redis cluster
- [ ] Configure HTTPS/SSL
- [ ] Set up monitoring (Sentry)
- [ ] Configure backup strategy
- [ ] Set up log aggregation
- [ ] Configure rate limiting
- [ ] Set up health checks

### Scaling

- **Horizontal**: Multiple FastAPI instances behind load balancer
- **Database**: Read replicas for queries
- **Redis**: Cluster mode for high availability
- **Background Tasks**: Celery workers for async processing

## 🧪 Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=app tests/

# Load testing
locust -f tests/load_test.py
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the interactive API docs at `/docs`
- **Issues**: GitHub Issues
- **Email**: support@docamy.com

---

**Built with FastAPI, PostgreSQL, Redis, and ❤️**