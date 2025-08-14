import AsyncStorage from '@react-native-async-storage/async-storage';

// User data storage
const USER_KEY = '@user_data';
const SETTINGS_KEY = '@user_settings';
const MESSAGES_KEY = '@chat_messages';

export const StorageService = {
  // User data
  async saveUser(user: any) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  },

  async getUser() {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async removeUser() {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      return true;
    } catch (error) {
      console.error('Error removing user:', error);
      return false;
    }
  },

  // Settings
  async saveSettings(settings: any) {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  },

  async getSettings() {
    try {
      const settings = await AsyncStorage.getItem(SETTINGS_KEY);
      return settings ? JSON.parse(settings) : {
        theme: 'system',
        language: 'en',
        notifications: true,
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        theme: 'system',
        language: 'en',
        notifications: true,
      };
    }
  },

  // Messages
  async saveMessages(messages: any[]) {
    try {
      await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
      return true;
    } catch (error) {
      console.error('Error saving messages:', error);
      return false;
    }
  },

  async getMessages() {
    try {
      const messages = await AsyncStorage.getItem(MESSAGES_KEY);
      return messages ? JSON.parse(messages) : [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  },

  async clearMessages() {
    try {
      await AsyncStorage.removeItem(MESSAGES_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing messages:', error);
      return false;
    }
  },

  // Clear all data (for logout)
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([USER_KEY, SETTINGS_KEY, MESSAGES_KEY]);
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
    }
  },
};
