import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | { email: string; id: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isUsingSupabase: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_ADMIN_STORAGE_KEY = 'nallu_tech_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { email: string; id: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Check active Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      });

      // 2. Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Offline / Local mock admin session fallback
      const savedSession = localStorage.getItem(LOCAL_ADMIN_STORAGE_KEY);
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          setUser(parsed);
        } catch {
          localStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setIsLoading(false);
      if (error) {
        return { error: error.message };
      }
      setUser(data.user);
      return {};
    } else {
      // Local fallback mode: accepts configured admin credentials
      const normalizedEmail = email.trim().toLowerCase();
      if (
        (normalizedEmail === 'nallutech07@gmail.com' || normalizedEmail === 'nallutech07') &&
        password === 'Nallutech@1234'
      ) {
        const mockUser = { id: 'admin-local-1', email: 'nallutech07@gmail.com' };
        localStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, JSON.stringify(mockUser));
        setUser(mockUser);
        setIsLoading(false);
        return {};
      } else {
        setIsLoading(false);
        return {
          error: 'Invalid email or password. Please check your credentials and try again.',
        };
      }
    }
  };

  const logout = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isUsingSupabase: isSupabaseConfigured,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

