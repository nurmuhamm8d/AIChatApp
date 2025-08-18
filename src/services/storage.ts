import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupportedLanguage } from '../i18n';

const USERS_KEY = '@users';
const SESSION_EMAIL_KEY = '@session_email';
const SETTINGS_KEY = '@app_settings';

export type AppSettings = {
  language?: SupportedLanguage;
  theme?: 'light' | 'dark' | 'system';
};

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string; 
  token: string;
  createdAt: string;
  lastLoginAt?: string;
};

async function read<T>(key: string): Promise<T | undefined> {
  const j = await AsyncStorage.getItem(key);
  return j ? (JSON.parse(j) as T) : undefined;
}
async function write<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const StorageService = {
  async getSettings(): Promise<AppSettings | undefined> {
    return read<AppSettings>(SETTINGS_KEY);
  },
  async saveSettings(settings: AppSettings): Promise<void> {
    return write<AppSettings>(SETTINGS_KEY, settings);
  },

  async getUsers(): Promise<StoredUser[]> {
    return (await read<StoredUser[]>(USERS_KEY)) ?? [];
  },
  async addUser(user: StoredUser): Promise<void> {
    const users = await StorageService.getUsers();
    users.push(user);
    await write(USERS_KEY, users);
  },
  async updateUser(user: StoredUser): Promise<void> {
    const users = await StorageService.getUsers();
    const idx = users.findIndex(u => u.email === user.email);
    if (idx >= 0) users[idx] = user;
    await write(USERS_KEY, users);
  },
  async findUserByEmail(email: string): Promise<StoredUser | undefined> {
    const users = await StorageService.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async setSessionEmail(email: string): Promise<void> {
    await AsyncStorage.setItem(SESSION_EMAIL_KEY, email);
  },
  async getSessionUser(): Promise<StoredUser | null> {
    const email = await AsyncStorage.getItem(SESSION_EMAIL_KEY);
    if (!email) return null;
    const u = await StorageService.findUserByEmail(email);
    return u ?? null;
  },
  async clearSession(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_EMAIL_KEY);
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([USERS_KEY, SESSION_EMAIL_KEY, SETTINGS_KEY]);
  },
};

export default StorageService;
