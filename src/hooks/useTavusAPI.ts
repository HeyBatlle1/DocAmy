import { useState, useCallback } from 'react';

interface TavusConfig {
  apiKey: string;
  replicaId: string;
  personaId: string;
  conversationId?: string;
}

interface TavusResponse {
  videoUrl: string;
  conversationId: string;
  status: 'processing' | 'completed' | 'error';
  streamUrl?: string;
  isLive?: boolean;
}

const API_BASE_URL = 'http://localhost:8001';

export const useTavusAPI = (config: TavusConfig) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string): Promise<TavusResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tavus/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replica_id: config.replicaId,
          persona_id: config.personaId,
          conversation_id: config.conversationId,
          properties: {
            max_duration: 30,
            enable_streaming: true,
            video_chat_enabled: true
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Tavus API error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      
      // If we have a conversation ID, send the message
      if (data.conversation_id) {
        const messageResponse = await fetch(`${API_BASE_URL}/api/tavus/conversations/${data.conversation_id}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: message
          }),
        });

        if (!messageResponse.ok) {
          const errorData = await messageResponse.json();
          throw new Error(`Message send error: ${errorData.message || messageResponse.statusText}`);
        }

        const messageData = await messageResponse.json();
        
        return {
          videoUrl: messageData.video_url || data.video_url,
          conversationId: data.conversation_id,
          status: messageData.status || 'processing',
          streamUrl: messageData.stream_url || data.stream_url,
          isLive: messageData.is_live || data.is_live
        };
      }

      return {
        videoUrl: data.video_url,
        conversationId: data.conversation_id,
        status: data.status || 'processing',
        streamUrl: data.stream_url,
        isLive: data.is_live
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Tavus API Error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const createConversation = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/tavus/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replica_id: config.replicaId,
          persona_id: config.personaId,
          properties: {
            max_duration: 30,
            language: 'en',
            enable_streaming: true,
            video_chat_enabled: true
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Conversation creation error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return data.conversation_id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Conversation creation error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const getConversationStatus = useCallback(async (conversationId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tavus/conversations/${conversationId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Status check error: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Status check error:', err);
      return null;
    }
  }, [config]);

  return {
    sendMessage,
    createConversation,
    getConversationStatus,
    isLoading,
    error,
  };
};