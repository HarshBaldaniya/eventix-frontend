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
import * as authStorage from '@/lib/auth-storage';

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

  const mergeRoleFromToken = useCallback(async (u: User | null): Promise<User | null> => {
    if (!u) return null;
    const role = (await authStorage.getRoleFromToken()) ?? 'user';
    return { ...u, role };
  }, []);

  const refreshAuth = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const token = await authStorage.getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const refresh = await authStorage.getRefreshToken();
      const res = await api<{ user: User }>('/api/v1/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refresh }),
        skipAuth: true,
        skipRefresh: true,
      });
      if ('success' in res && res.success && res.data && !Array.isArray(res.data)) {
        const data = res as { success: true; data: { user: User } };
        if (data.data.user) {
          await authStorage.setUser(data.data.user);
          const withRole = await mergeRoleFromToken(data.data.user);
          setUser(withRole ?? data.data.user);
        }
      }
    } catch {
      await clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [mergeRoleFromToken]);

  useEffect(() => {
    const init = async () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      const token = await authStorage.getAccessToken();
      const refresh = await authStorage.getRefreshToken();
      if (!token || !refresh) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const ok = await refreshTokens();
      if (ok) {
        const storedUser = await authStorage.getUser<User>();
        const withRole = await mergeRoleFromToken(storedUser ?? null);
        setUser(withRole ?? null);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    init();
  }, [mergeRoleFromToken]);

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
        await authStorage.setUser(data.data.user);
        const withRole = await mergeRoleFromToken(data.data.user);
        setUser(withRole ?? data.data.user);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    },
    [mergeRoleFromToken]
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
        await authStorage.setUser(data.data.user);
        const withRole = await mergeRoleFromToken(data.data.user);
        setUser(withRole ?? data.data.user);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    },
    [mergeRoleFromToken]
  );

  const logout = useCallback(async () => {
    const refresh = await authStorage.getRefreshToken();
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
