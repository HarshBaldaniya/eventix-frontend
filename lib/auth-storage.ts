const PREFIX = 'evx_';
const KEY_ACCESS = `${PREFIX}access_token`;
const KEY_REFRESH = `${PREFIX}refresh_token`;
const KEY_FP = `${PREFIX}fp`;
const KEY_USER = `${PREFIX}user`;

function isClient(): boolean {
  return typeof window !== 'undefined';
}

async function sha256(text: string): Promise<string> {
  if (!isClient()) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyAndGetAccess(): Promise<string | null> {
  if (!isClient()) return null;
  const raw = sessionStorage.getItem(KEY_ACCESS);
  if (!raw) return null;
  const storedFp = sessionStorage.getItem(KEY_FP);
  if (!storedFp) {
    clearAll();
    return null;
  }
  const currentFp = await sha256(raw);
  if (currentFp !== storedFp) {
    clearAll();
    return null;
  }
  return raw;
}

export function clearAll(): void {
  if (!isClient()) return;
  sessionStorage.removeItem(KEY_ACCESS);
  sessionStorage.removeItem(KEY_REFRESH);
  sessionStorage.removeItem(KEY_FP);
  sessionStorage.removeItem(KEY_USER);
}

export async function getAccessToken(): Promise<string | null> {
  return verifyAndGetAccess();
}

export type DecodedAccessPayload = { sub: string; email?: string; role?: string; type?: string };

export async function getDecodedAccessPayload(): Promise<DecodedAccessPayload | null> {
  const token = await verifyAndGetAccess();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(atob(payload)) as DecodedAccessPayload;
  } catch {
    return null;
  }
}

export async function getRoleFromToken(): Promise<'user' | 'admin' | null> {
  const payload = await getDecodedAccessPayload();
  if (!payload?.role) return 'user';
  return payload.role === 'admin' ? 'admin' : 'user';
}

export async function getRefreshToken(): Promise<string | null> {
  if (!isClient()) return null;
  const access = await verifyAndGetAccess();
  if (!access) return null;
  return sessionStorage.getItem(KEY_REFRESH);
}

export async function setTokens(access: string, refresh: string): Promise<void> {
  if (!isClient()) return;
  const fp = await sha256(access);
  sessionStorage.setItem(KEY_ACCESS, access);
  sessionStorage.setItem(KEY_REFRESH, refresh);
  sessionStorage.setItem(KEY_FP, fp);
}

export async function setUser(user: unknown): Promise<void> {
  if (!isClient()) return;
  try {
    sessionStorage.setItem(KEY_USER, JSON.stringify(user));
  } catch {
    sessionStorage.removeItem(KEY_USER);
  }
}

export async function getUser<T>(): Promise<T | null> {
  if (!isClient()) return null;
  const access = await verifyAndGetAccess();
  if (!access) return null;
  const raw = sessionStorage.getItem(KEY_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    sessionStorage.removeItem(KEY_USER);
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  clearAll();
}
