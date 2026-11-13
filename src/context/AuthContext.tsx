import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isUsingSupabase: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Check existing active Supabase session
      supabase.auth
        .getSession()
        .then(({ data: { session }, error }) => {
          if (error) {
            console.error('Error fetching Supabase session:', error.message);
          }
          setUser(session?.user ?? null);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Unexpected error loading auth session:', err);
          setIsLoading(false);
        });

      // 2. Subscribe to auth changes (sign in, sign out, token refresh)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // When Supabase is not configured, no local mock login credentials are accepted.
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return {
        error:
          'Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your local .env file before signing in.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      setIsLoading(false);

      if (error) {
        return { error: error.message };
      }

      setUser(data.user);
      return {};
    } catch (err: unknown) {
      setIsLoading(false);
      return {
        error: err instanceof Error ? err.message : 'An unexpected error occurred during authentication.',
      };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error during Supabase signOut:', err);
      }
    }
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
