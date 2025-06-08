export interface StorageConfig {
  version: string;
  lastUpdated: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  videoQuality: 'low' | 'medium' | 'high';
  audioEnabled: boolean;
  videoEnabled: boolean;
  notifications: boolean;
  autoStartVideo: boolean;
}

export interface TavusSettings {
  apiKey: string;
  replicaId: string;
  personaId: string;
  lastUsedConversationId?: string;
  maxDuration: number;
  enableStreaming: boolean;
  videoChatEnabled: boolean;
}

export interface ConversationData {
  id: string;
  name: string;
  createdAt: string;
  lastMessageAt: string;
  messageCount: number;
  status: 'active' | 'completed' | 'error';
  videoUrl?: string;
}

export interface AppState {
  config: StorageConfig;
  userPreferences: UserPreferences;
  tavusSettings: TavusSettings;
  conversations: ConversationData[];
  recentMessages: Array<{
    id: string;
    conversationId: string;
    content: string;
    type: 'user' | 'agent';
    timestamp: string;
    videoUrl?: string;
  }>;
}

class LocalStorageManager {
  private readonly STORAGE_KEY = 'tavus_app_data';
  private readonly VERSION = '1.0.0';
  
  private defaultState: AppState = {
    config: {
      version: this.VERSION,
      lastUpdated: new Date().toISOString()
    },
    userPreferences: {
      theme: 'system',
      language: 'en',
      videoQuality: 'high',
      audioEnabled: true,
      videoEnabled: true,
      notifications: true,
      autoStartVideo: false
    },
    tavusSettings: {
      apiKey: '',
      replicaId: 'r89d844f2b467046d54fef9d08619d180588edea6160',
      personaId: 'p38f53895b11',
      maxDuration: 30,
      enableStreaming: true,
      videoChatEnabled: true
    },
    conversations: [],
    recentMessages: []
  };

  // Initialize storage with default values if not exists
  init(): AppState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        this.saveState(this.defaultState);
        return this.defaultState;
      }

      const parsedState = JSON.parse(stored) as AppState;
      
      // Check version compatibility
      if (parsedState.config.version !== this.VERSION) {
        console.log('Storage version mismatch, migrating...');
        return this.migrateData(parsedState);
      }

      return this.validateAndMergeState(parsedState);
    } catch (error) {
      console.error('Error initializing storage:', error);
      this.saveState(this.defaultState);
      return this.defaultState;
    }
  }

  // Get complete app state
  getState(): AppState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return this.defaultState;
      
      const parsedState = JSON.parse(stored) as AppState;
      return this.validateAndMergeState(parsedState);
    } catch (error) {
      console.error('Error getting state:', error);
      return this.defaultState;
    }
  }

  // Save complete app state
  saveState(state: AppState): void {
    try {
      const updatedState = {
        ...state,
        config: {
          ...state.config,
          lastUpdated: new Date().toISOString()
        }
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedState));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  // Update specific sections
  updateUserPreferences(preferences: Partial<UserPreferences>): void {
    const state = this.getState();
    state.userPreferences = { ...state.userPreferences, ...preferences };
    this.saveState(state);
  }

  updateTavusSettings(settings: Partial<TavusSettings>): void {
    const state = this.getState();
    state.tavusSettings = { ...state.tavusSettings, ...settings };
    this.saveState(state);
  }

  // Conversation management
  addConversation(conversation: ConversationData): void {
    const state = this.getState();
    const existingIndex = state.conversations.findIndex(c => c.id === conversation.id);
    
    if (existingIndex >= 0) {
      state.conversations[existingIndex] = conversation;
    } else {
      state.conversations.unshift(conversation);
      // Keep only last 50 conversations
      if (state.conversations.length > 50) {
        state.conversations = state.conversations.slice(0, 50);
      }
    }
    
    this.saveState(state);
  }

  updateConversation(id: string, updates: Partial<ConversationData>): void {
    const state = this.getState();
    const index = state.conversations.findIndex(c => c.id === id);
    
    if (index >= 0) {
      state.conversations[index] = { ...state.conversations[index], ...updates };
      this.saveState(state);
    }
  }

  deleteConversation(id: string): void {
    const state = this.getState();
    state.conversations = state.conversations.filter(c => c.id !== id);
    state.recentMessages = state.recentMessages.filter(m => m.conversationId !== id);
    this.saveState(state);
  }

  // Message management
  addMessage(message: {
    id: string;
    conversationId: string;
    content: string;
    type: 'user' | 'agent';
    timestamp: string;
    videoUrl?: string;
  }): void {
    const state = this.getState();
    state.recentMessages.unshift(message);
    
    // Keep only last 200 messages
    if (state.recentMessages.length > 200) {
      state.recentMessages = state.recentMessages.slice(0, 200);
    }
    
    // Update conversation last message time
    this.updateConversation(message.conversationId, {
      lastMessageAt: message.timestamp,
      messageCount: state.recentMessages.filter(m => m.conversationId === message.conversationId).length
    });
  }

  getConversationMessages(conversationId: string) {
    const state = this.getState();
    return state.recentMessages.filter(m => m.conversationId === conversationId);
  }

  // Data export/import
  exportData(): string {
    const state = this.getState();
    return JSON.stringify(state, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const importedState = JSON.parse(jsonData) as AppState;
      const validatedState = this.validateAndMergeState(importedState);
      this.saveState(validatedState);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data
  clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Get storage usage info
  getStorageInfo() {
    const state = this.getState();
    const dataSize = new Blob([JSON.stringify(state)]).size;
    
    return {
      version: state.config.version,
      lastUpdated: state.config.lastUpdated,
      conversationCount: state.conversations.length,
      messageCount: state.recentMessages.length,
      dataSizeKB: Math.round(dataSize / 1024),
      hasApiKey: !!state.tavusSettings.apiKey
    };
  }

  // Private helper methods
  private validateAndMergeState(state: Partial<AppState>): AppState {
    return {
      config: { ...this.defaultState.config, ...state.config },
      userPreferences: { ...this.defaultState.userPreferences, ...state.userPreferences },
      tavusSettings: { ...this.defaultState.tavusSettings, ...state.tavusSettings },
      conversations: state.conversations || [],
      recentMessages: state.recentMessages || []
    };
  }

  private migrateData(oldState: AppState): AppState {
    // Handle version migrations here
    const migratedState = this.validateAndMergeState(oldState);
    migratedState.config.version = this.VERSION;
    this.saveState(migratedState);
    return migratedState;
  }
}

// Create singleton instance
export const storage = new LocalStorageManager();

// Convenience hooks for React components
export const useStorage = () => {
  return {
    getState: () => storage.getState(),
    updateUserPreferences: (prefs: Partial<UserPreferences>) => storage.updateUserPreferences(prefs),
    updateTavusSettings: (settings: Partial<TavusSettings>) => storage.updateTavusSettings(settings),
    addConversation: (conv: ConversationData) => storage.addConversation(conv),
    updateConversation: (id: string, updates: Partial<ConversationData>) => storage.updateConversation(id, updates),
    deleteConversation: (id: string) => storage.deleteConversation(id),
    addMessage: (message: any) => storage.addMessage(message),
    getConversationMessages: (id: string) => storage.getConversationMessages(id),
    exportData: () => storage.exportData(),
    importData: (data: string) => storage.importData(data),
    clearAll: () => storage.clearAll(),
    getStorageInfo: () => storage.getStorageInfo()
  };
};