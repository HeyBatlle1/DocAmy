import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;
const TAVUS_API_BASE = 'https://tavusapi.com/v2';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5176',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
app.use(express.json());

// Middleware to check API key
const validateTavusApiKey = (req, res, next) => {
  if (!process.env.TAVUS_API_KEY) {
    return res.status(500).json({
      error: 'Tavus API key not configured on server',
      code: 'API_KEY_MISSING'
    });
  }
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Create conversation endpoint
app.post('/api/tavus/conversations', validateTavusApiKey, async (req, res) => {
  try {
    const { replica_id, persona_id, conversation_name, properties } = req.body;

    if (!replica_id || !persona_id) {
      return res.status(400).json({
        error: 'replica_id and persona_id are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    const response = await fetch(`${TAVUS_API_BASE}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TAVUS_API_KEY,
      },
      body: JSON.stringify({
        replica_id,
        persona_id,
        conversation_name: conversation_name || `Conversation ${Date.now()}`,
        properties: {
          max_duration: 30,
          language: 'en',
          enable_streaming: true,
          video_chat_enabled: true,
          callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5176'}/api/tavus/webhook`,
          ...properties
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Tavus API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Conversation creation error:', error);
    res.status(500).json({
      error: error.message || 'Failed to create conversation',
      code: 'CONVERSATION_CREATION_FAILED'
    });
  }
});

// Send message to conversation endpoint
app.post('/api/tavus/conversations/:conversationId/messages', validateTavusApiKey, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Message text is required',
        code: 'MISSING_MESSAGE_TEXT'
      });
    }

    const response = await fetch(`${TAVUS_API_BASE}/conversations/${conversationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.TAVUS_API_KEY,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Tavus API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Message send error:', error);
    res.status(500).json({
      error: error.message || 'Failed to send message',
      code: 'MESSAGE_SEND_FAILED'
    });
  }
});

// Get conversation status endpoint
app.get('/api/tavus/conversations/:conversationId', validateTavusApiKey, async (req, res) => {
  try {
    const { conversationId } = req.params;

    const response = await fetch(`${TAVUS_API_BASE}/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.TAVUS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Tavus API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: error.message || 'Failed to get conversation status',
      code: 'STATUS_CHECK_FAILED'
    });
  }
});

// Delete conversation endpoint
app.delete('/api/tavus/conversations/:conversationId', validateTavusApiKey, async (req, res) => {
  try {
    const { conversationId } = req.params;

    const response = await fetch(`${TAVUS_API_BASE}/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': process.env.TAVUS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Tavus API error: ${errorData.message || response.statusText}`);
    }

    res.status(204).send();
  } catch (error) {
    console.error('Conversation deletion error:', error);
    res.status(500).json({
      error: error.message || 'Failed to delete conversation',
      code: 'CONVERSATION_DELETION_FAILED'
    });
  }
});

// List replicas endpoint
app.get('/api/tavus/replicas', validateTavusApiKey, async (req, res) => {
  try {
    const response = await fetch(`${TAVUS_API_BASE}/replicas`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.TAVUS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Tavus API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Replicas fetch error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch replicas',
      code: 'REPLICAS_FETCH_FAILED'
    });
  }
});

// List personas endpoint
app.get('/api/tavus/personas', validateTavusApiKey, async (req, res) => {
  try {
    const response = await fetch(`${TAVUS_API_BASE}/personas`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.TAVUS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Tavus API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Personas fetch error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch personas',
      code: 'PERSONAS_FETCH_FAILED'
    });
  }
});

// Webhook endpoint for Tavus events
app.post('/api/tavus/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    // Verify webhook signature if webhook secret is configured
    if (process.env.WEBHOOK_SECRET) {
      const signature = req.headers['x-tavus-signature'];
      // Add your webhook signature verification logic here
    }

    const event = JSON.parse(req.body);
    console.log('Tavus webhook event:', event);

    // Handle different event types
    switch (event.event_type) {
      case 'conversation.video_generated':
        console.log('Video generated for conversation:', event.conversation_id);
        break;
      case 'conversation.completed':
        console.log('Conversation completed:', event.conversation_id);
        break;
      case 'conversation.error':
        console.log('Conversation error:', event.conversation_id, event.data.error_message);
        break;
      default:
        console.log('Unknown event type:', event.event_type);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(400).json({ error: 'Invalid webhook payload' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Tavus Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (!process.env.TAVUS_API_KEY) {
    console.warn('⚠️  Warning: TAVUS_API_KEY not configured!');
  } else {
    console.log('✅ Tavus API key configured');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});