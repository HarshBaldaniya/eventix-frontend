const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export type ApiError = {
  code: string;
  message: string;
  details: Record<string, unknown> | null;
};

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: true; data: T[]; pagination?: Pagination }
  | { success: false; error: ApiError };

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

import * as authStorage from './auth-storage';

async function getAccessToken(): Promise<string | null> {
  return authStorage.getAccessToken();
}

async function getRefreshToken(): Promise<string | null> {
  return authStorage.getRefreshToken();
}

export async function setTokens(access: string, refresh: string): Promise<void> {
  await authStorage.setTokens(access, refresh);
}

export async function clearTokens(): Promise<void> {
  await authStorage.clearTokens();
}

export async function refreshTokens(): Promise<boolean> {
  const refresh = await getRefreshToken();
  if (!refresh) return false;
  const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    await clearTokens();
    return false;
  }
  const { access_token, refresh_token } = json.data;
  await setTokens(access_token, refresh_token);
  return true;
}

export async function api<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { skipAuth, skipRefresh, ...init } = options;
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (!skipAuth) {
    const token = await getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  let res = await fetch(url, { ...init, headers });
  if (res.status === 401 && !skipRefresh && !skipAuth) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      const newToken = await getAccessToken();
      if (newToken) headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { ...init, headers });
    }
  }
  const json = await res.json();
  if (!res.ok) {
    return json as ApiResponse<T>;
  }
  return json as ApiResponse<T>;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
