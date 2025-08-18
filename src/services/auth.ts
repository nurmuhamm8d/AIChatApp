import { StorageService, StoredUser } from './storage';

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  createdAt: string;
  lastLoginAt?: string;
}

type AuthListener = (user: User | null) => void;

function toPublic(u: StoredUser): User {
  const { password: _p, ...rest } = u;
  return rest;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private listeners: AuthListener[] = [];
  private initPromise: Promise<void> | null = null;

  static getInstance() {
    if (!this.instance) this.instance = new AuthService();
    return this.instance;
  }

  private constructor() {
    this.initPromise = this.hydrateFromSession();
  }

  private async hydrateFromSession() {
    const su = await StorageService.getSessionUser();
    this.currentUser = su ? toPublic(su) : null;
    this.notify();
  }

  private notify() {
    requestAnimationFrame(() => this.listeners.forEach(l => l(this.currentUser)));
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.initPromise) await this.initPromise;
    return this.currentUser;
  }

  onAuthStateChanged(cb: AuthListener) {
    this.listeners.push(cb);
    cb(this.currentUser);
    return () => { this.listeners = this.listeners.filter(x => x !== cb); };
  }

  async register(name: string, email: string, password: string): Promise<User> {
    email = email.toLowerCase().trim();
    if (!name.trim() || !email || !password) throw new Error('All fields required');

    const exists = await StorageService.findUserByEmail(email);
    if (exists) throw new Error('Email already in use');

    const now = new Date().toISOString();
    const stored: StoredUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email,
      password, 
      token: `token_${Math.random().toString(36).slice(2)}`,
      createdAt: now,
      lastLoginAt: now,
    };

    await StorageService.addUser(stored);
    await StorageService.setSessionEmail(email);
    this.currentUser = toPublic(stored);
    this.notify();
    return this.currentUser!;
  }

  async login(email: string, password: string): Promise<User> {
    email = email.toLowerCase().trim();
    const u = await StorageService.findUserByEmail(email);
    if (!u || u.password !== password) throw new Error('Invalid credentials');

    u.lastLoginAt = new Date().toISOString();
    await StorageService.updateUser(u);
    await StorageService.setSessionEmail(u.email);
    this.currentUser = toPublic(u);
    this.notify();
    return this.currentUser!;
  }

  async logout(): Promise<void> {
    await StorageService.clearSession();
    this.currentUser = null;
    this.notify();
  }

  async updateProfile(patch: { name?: string }): Promise<User> {
    const cur = await StorageService.getSessionUser();
    if (!cur) throw new Error('Not authenticated');
    if (patch.name !== undefined) cur.name = patch.name.trim();
    await StorageService.updateUser(cur);
    this.currentUser = toPublic(cur);
    this.notify();
    return this.currentUser!;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const cur = await StorageService.getSessionUser();
    if (!cur) throw new Error('Not authenticated');
    if (cur.password !== currentPassword) throw new Error('Current password is incorrect');
    if (newPassword.length < 6) throw new Error('Password too short');
    cur.password = newPassword;
    await StorageService.updateUser(cur);
  }
}

export const authService = AuthService.getInstance();
