'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@/types/api';
import { api, clearTokens, refreshTokens, setTokens } from '@/lib/api';

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await api<{ user: User }>('/api/v1/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: localStorage.getItem('refresh_token'),
        }),
        skipAuth: true,
        skipRefresh: true,
      });
      if ('success' in res && res.success && res.data && !Array.isArray(res.data)) {
        const data = res as { success: true; data: { user: User } };
        if (data.data.user) {
          setUser(data.data.user);
        }
      }
    } catch {
      await clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      const token = localStorage.getItem('access_token');
      const refresh = localStorage.getItem('refresh_token');
      if (!token || !refresh) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const ok = await refreshTokens();
      if (ok) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            setUser(JSON.parse(userStr));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api<{ user: User; access_token: string; refresh_token: string }>(
        '/api/v1/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          skipAuth: true,
          skipRefresh: true,
        }
      );
      if ('error' in res && res.error) {
        return { success: false, error: res.error.message };
      }
      const data = res as { success: true; data: { user: User; access_token: string; refresh_token: string } };
      if (data.success && data.data) {
        await setTokens(data.data.access_token, data.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    },
    []
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await api<{ user: User; access_token: string; refresh_token: string }>(
        '/api/v1/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
          skipAuth: true,
          skipRefresh: true,
        }
      );
      if ('error' in res && res.error) {
        return { success: false, error: res.error.message };
      }
      const data = res as { success: true; data: { user: User; access_token: string; refresh_token: string } };
      if (data.success && data.data) {
        await setTokens(data.data.access_token, data.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    },
    []
  );

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      try {
        await api('/api/v1/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refresh }),
          skipAuth: true,
          skipRefresh: true,
        });
      } catch {
        // ignore
      }
    }
    await clearTokens();
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
