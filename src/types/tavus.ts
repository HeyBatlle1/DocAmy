export interface TavusConfig {
  apiKey: string;
  replicaId: string;
  personaId: string;
  conversationId?: string;
}

export interface TavusMessage {
  id: string;
  content: string;
  timestamp: string;
  type: 'user' | 'assistant';
  videoUrl?: string;
}

export interface TavusConversation {
  id: string;
  replicaId: string;
  personaId: string;
  status: 'active' | 'completed' | 'error' | 'processing';
  messages: TavusMessage[];
  createdAt: string;
  updatedAt: string;
  videoUrl?: string;
}

export interface TavusReplica {
  id: string;
  name: string;
  avatar_url: string;
  voice_id: string;
  status: 'ready' | 'training' | 'error';
}

export interface TavusPersona {
  id: string;
  name: string;
  context: string;
  instructions: string;
  status: 'active' | 'inactive';
}

export interface TavusWebhookEvent {
  event_type: 'conversation.video_generated' | 'conversation.completed' | 'conversation.error';
  conversation_id: string;
  data: {
    video_url?: string;
    error_message?: string;
    status: string;
  };
}

export interface TavusAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface TavusConversationRequest {
  replica_id: string;
  persona_id: string;
  conversation_id?: string;
  properties?: {
    max_duration?: number;
    language?: string;
  };
}

export interface TavusMessageRequest {
  text: string;
  conversation_id?: string;
}