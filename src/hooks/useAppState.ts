import { useState, useEffect, useCallback } from 'react';
import { storage, AppState, UserPreferences, TavusSettings, ConversationData } from '../utils/storage';

export const useAppState = () => {
  const [appState, setAppState] = useState<AppState>(() => storage.init());
  const [isLoading, setIsLoading] = useState(false);

  // Sync with storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setAppState(storage.getState());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update user preferences
  const updateUserPreferences = useCallback((preferences: Partial<UserPreferences>) => {
    storage.updateUserPreferences(preferences);
    setAppState(storage.getState());
  }, []);

  // Update Tavus settings
  const updateTavusSettings = useCallback((settings: Partial<TavusSettings>) => {
    storage.updateTavusSettings(settings);
    setAppState(storage.getState());
  }, []);

  // Conversation management
  const addConversation = useCallback((conversation: ConversationData) => {
    storage.addConversation(conversation);
    setAppState(storage.getState());
  }, []);

  const updateConversation = useCallback((id: string, updates: Partial<ConversationData>) => {
    storage.updateConversation(id, updates);
    setAppState(storage.getState());
  }, []);

  const deleteConversation = useCallback((id: string) => {
    storage.deleteConversation(id);
    setAppState(storage.getState());
  }, []);

  // Message management
  const addMessage = useCallback((message: {
    id: string;
    conversationId: string;
    content: string;
    type: 'user' | 'agent';
    timestamp: string;
    videoUrl?: string;
  }) => {
    storage.addMessage(message);
    setAppState(storage.getState());
  }, []);

  const getConversationMessages = useCallback((conversationId: string) => {
    return storage.getConversationMessages(conversationId);
  }, []);

  // Data management
  const exportData = useCallback(() => {
    return storage.exportData();
  }, []);

  const importData = useCallback(async (jsonData: string) => {
    setIsLoading(true);
    try {
      const success = storage.importData(jsonData);
      if (success) {
        setAppState(storage.getState());
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAllData = useCallback(() => {
    storage.clearAll();
    setAppState(storage.init());
  }, []);

  const getStorageInfo = useCallback(() => {
    return storage.getStorageInfo();
  }, []);

  return {
    // State
    appState,
    isLoading,
    
    // User preferences
    userPreferences: appState.userPreferences,
    updateUserPreferences,
    
    // Tavus settings
    tavusSettings: appState.tavusSettings,
    updateTavusSettings,
    
    // Conversations
    conversations: appState.conversations,
    addConversation,
    updateConversation,
    deleteConversation,
    
    // Messages
    recentMessages: appState.recentMessages,
    addMessage,
    getConversationMessages,
    
    // Data management
    exportData,
    importData,
    clearAllData,
    getStorageInfo
  };
};