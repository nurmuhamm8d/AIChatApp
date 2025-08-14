import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../types';

const CHAT_HISTORY_KEY = '@chat_history';
const MAX_HISTORY_ITEMS = 100;

export const ChatHistoryService = {
  // Save messages to storage
  async saveMessages(messages: Message[]): Promise<void> {
    try {
      // Only keep the most recent messages to prevent storage bloat
      const recentMessages = messages.slice(-MAX_HISTORY_ITEMS);
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(recentMessages));
    } catch (error) {
      console.error('Failed to save chat history', error);
      throw error;
    }
  },

  // Load messages from storage
  async loadMessages(): Promise<Message[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Failed to load chat history', error);
      return [];
    }
  },

  // Clear all chat history
  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear chat history', error);
      throw error;
    }
  },

  // Add a single message to history
  async addMessage(message: Message): Promise<Message[]> {
    const messages = await this.loadMessages();
    const updated = [...messages, message].slice(-MAX_HISTORY_ITEMS);
    await this.saveMessages(updated);
    return updated;
  },

  // Get the last N messages (useful for context)
  async getLastMessages(limit: number = 10): Promise<Message[]> {
    const messages = await this.loadMessages();
    return messages.slice(-limit);
  },
};

export default ChatHistoryService;
