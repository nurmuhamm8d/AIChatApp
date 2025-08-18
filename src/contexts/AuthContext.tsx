import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User } from '../services/auth';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsub = authService.onAuthStateChanged(u => {
      setUser(u);
      setIsLoading(false);
    });
    authService.getCurrentUser().finally(() => setIsLoading(false));
    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try { await authService.login(email, password); }
    finally { setIsLoading(false); }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try { await authService.register(name, email, password); }
    finally { setIsLoading(false); }
  };

  const signOut = async () => {
    setIsLoading(true);
    try { await authService.logout(); }
    finally { setIsLoading(false); }
  };

  return (
    <Ctx.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
};
