import React, { useState, useCallback, useEffect } from 'react';
import { ChatInterface } from './ChatInterface';
import { useTavusAPI } from '../hooks/useTavusAPI';
import { useAppState } from '../hooks/useAppState';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  videoUrl?: string;
}

export const TavusAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>();
  const [conversationId, setConversationId] = useState<string>();
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  
  const { tavusSettings, addMessage, addConversation, updateConversation } = useAppState();

  const tavusConfig = {
    apiKey: tavusSettings.apiKey,
    replicaId: tavusSettings.replicaId,
    personaId: tavusSettings.personaId,
    conversationId: conversationId
  };

  const { sendMessage, createConversation, isLoading: apiLoading, error } = useTavusAPI(tavusConfig);

  // Initialize conversation on component mount
  useEffect(() => {
    const initializeConversation = async () => {
      if (!conversationId) {
        const newConversationId = await createConversation();
        if (newConversationId) {
          setConversationId(newConversationId);
        }
      }
    };

    initializeConversation();
  }, [createConversation, conversationId]);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Store user message
    if (conversationId) {
      addMessage({
        id: userMessage.id,
        conversationId,
        content: userMessage.content,
        type: 'user',
        timestamp: userMessage.timestamp.toISOString()
      });
    }
    
    setIsLoading(true);

    try {
      const response = await sendMessage(content);
      
      if (response) {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'agent',
          content: `Medical consultation response generated for: "${content}"`,
          timestamp: new Date(),
          videoUrl: response.videoUrl
        };

        setMessages(prev => [...prev, agentMessage]);
        
        // Store agent message
        if (response.conversationId) {
          addMessage({
            id: agentMessage.id,
            conversationId: response.conversationId,
            content: agentMessage.content,
            type: 'agent',
            timestamp: agentMessage.timestamp.toISOString(),
            videoUrl: response.videoUrl
          });
        }
        
        setCurrentVideoUrl(response.videoUrl);

        // Update conversation ID if it changed
        if (response.conversationId && response.conversationId !== conversationId) {
          setConversationId(response.conversationId);
          
          // Add/update conversation in storage
          addConversation({
            id: response.conversationId,
            name: `Medical Consultation ${new Date().toLocaleDateString()}`,
            createdAt: new Date().toISOString(),
            lastMessageAt: new Date().toISOString(),
            messageCount: 1,
            status: 'active',
            videoUrl: response.videoUrl
          });
        }
      } else if (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'agent',
          content: `I apologize, but I encountered an error: ${error}. Please try again or contact medical support.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error('Error sending message to Tavus:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'I apologize, but I encountered a technical error. Please try again or contact medical support.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sendMessage, error, conversationId, addMessage, addConversation]);

  const handleStartVideoChat = useCallback(async () => {
    setIsVideoCallActive(true);
    setIsLoading(true);

    try {
      // Initialize a new conversation for video chat if needed
      if (!conversationId) {
        const newConversationId = await createConversation();
        if (newConversationId) {
          setConversationId(newConversationId);
          
          // Add conversation to storage
          addConversation({
            id: newConversationId,
            name: `Video Medical Consultation ${new Date().toLocaleDateString()}`,
            createdAt: new Date().toISOString(),
            lastMessageAt: new Date().toISOString(),
            messageCount: 0,
            status: 'active'
          });
        }
      }

      // Send initial message to start video conversation
      const response = await sendMessage("Hello! I'd like to start a video medical consultation.");
      
      if (response && response.videoUrl) {
        setCurrentVideoUrl(response.videoUrl);
      }
    } catch (err) {
      console.error('Error starting video consultation:', err);
      setIsVideoCallActive(false);
    } finally {
      setIsLoading(false);
    }
  }, [sendMessage, createConversation, conversationId, addConversation]);

  const handleEndVideoCall = useCallback(() => {
    setIsVideoCallActive(false);
    setCurrentVideoUrl(undefined);
    
    // Update conversation status
    if (conversationId) {
      updateConversation(conversationId, {
        status: 'completed',
        lastMessageAt: new Date().toISOString()
      });
    }
  }, [conversationId, updateConversation]);

  return (
    <div className="h-screen w-full">
      <ChatInterface
        onSendMessage={handleSendMessage}
        messages={messages}
        isLoading={isLoading || apiLoading}
        currentVideoUrl={currentVideoUrl}
        onStartVideoChat={handleStartVideoChat}
        isVideoCallActive={isVideoCallActive}
        onEndVideoCall={handleEndVideoCall}
      />
    </div>
  );
};