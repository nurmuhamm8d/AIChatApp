import { StorageService } from './storage';
import { Alert } from 'react-native';
import { i18n } from '../i18n';

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  createdAt: string;
  lastLoginAt?: string;
}

type AuthListener = (user: User | null) => void;

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authListeners: AuthListener[] = [];
  private isInitialized = false;

  private constructor() {
    this.initialize().catch(error => {
      console.error('Failed to initialize auth service:', error);
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      const user = await StorageService.getUser();
      if (user) {
        this.currentUser = user;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to initialize auth service:', error);
      throw error;
    } finally {
      this.isInitialized = true;
    }
  }

  private notifyListeners(): void {
    // Use requestAnimationFrame to ensure we're not in the middle of a React render
    requestAnimationFrame(() => {
      this.authListeners.forEach((listener) => {
        try {
          listener(this.currentUser);
        } catch (error) {
          console.error('Error in auth listener:', error);
        }
      });
    });
  }

  /**
   * Register a new user
   */
  public async register(name: string, email: string, password: string): Promise<User> {
    // Input validation
    if (!name?.trim() || !email?.trim() || !password) {
      throw new Error(i18n.t('allFieldsRequired'));
    }

    if (password.length < 6) {
      throw new Error(i18n.t('passwordTooShort'));
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(i18n.t('invalidEmail'));
    }

    try {
      // Check if user already exists
      const existingUser = await StorageService.getUser();
      if (existingUser?.email === email.toLowerCase()) {
        throw new Error(i18n.t('emailAlreadyInUse'));
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        token: `token_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      // Save user
      await StorageService.saveUser(newUser);
      this.currentUser = newUser;
      this.notifyListeners();

      return newUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * Login with email and password
   */
  public async login(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new Error(i18n.t('emailPasswordRequired'));
    }

    try {
      // In a real app, verify credentials with your backend
      const user = await StorageService.getUser();
      
      if (!user || user.email !== email.toLowerCase()) {
        throw new Error(i18n.t('invalidCredentials'));
      }

      // Update last login time
      const updatedUser = {
        ...user,
        lastLoginAt: new Date().toISOString(),
      };

      await StorageService.saveUser(updatedUser);
      this.currentUser = updatedUser;
      this.notifyListeners();

      return updatedUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  public async logout(): Promise<void> {
    try {
      await StorageService.removeUser();
      this.currentUser = null;
      this.notifyListeners();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Get the current authenticated user
   */
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!this.currentUser?.token;
  }

  /**
   * Add an authentication state change listener
   * @returns Unsubscribe function
   */
  public onAuthStateChanged(listener: AuthListener): () => void {
    this.authListeners.push(listener);
    
    // Immediately notify with current auth state
    listener(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      this.authListeners = this.authListeners.filter(l => l !== listener);
    };
  }
}

export const authService = AuthService.getInstance();
