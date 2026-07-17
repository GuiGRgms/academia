'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS = [
  {
    id: 'demo-001',
    name: 'João Silva',
    email: 'demo@fitmaster.com',
    photoURL: '',
    age: 28,
    weight: 82,
    height: 178,
    goal: 'Ganhar massa muscular',
    createdAt: new Date('2024-01-15').toISOString(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('fitmaster_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const found = DEMO_USERS.find((u) => u.email === email);
    const loggedUser: User = found ?? {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      photoURL: '',
      age: 25,
      weight: 75,
      height: 175,
      goal: 'Ganhar massa muscular',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('fitmaster_user', JSON.stringify(loggedUser));
    setUser(loggedUser);
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const googleUser: User = {
      id: 'google-' + Date.now(),
      name: 'Usuário Google',
      email: 'usuario@gmail.com',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fitmaster',
      age: 28,
      weight: 80,
      height: 178,
      goal: 'Ganhar massa muscular',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('fitmaster_user', JSON.stringify(googleUser));
    setUser(googleUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('fitmaster_user');
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    localStorage.setItem('fitmaster_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginWithGoogle, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
