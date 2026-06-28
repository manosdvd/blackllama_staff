'use client';

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  status?: string;
  email?: string;
}

interface AuthSession {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

interface AuthResponse {
  user: AuthUser;
  session: AuthSession;
}

const TOKEN_KEY = 'lawton_access_token';
const REFRESH_KEY = 'lawton_refresh_token';
const USER_CACHE_KEY = 'lawton_user_cache';
const EXPIRES_KEY = 'lawton_token_expires';

const getBaseUrl = () => {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (configured) return configured.replace(/\/$/, '');
  return '/api';
};

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const parseResponse = async <T,>(response: Response): Promise<T> => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data as T;
};

export const authApi = {
  async login(username: string, password: string) {
    const response = await fetch(`${getBaseUrl()}/auth-login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ username, password }),
    });
    return parseResponse<AuthResponse>(response);
  },

  async register(username: string, password: string, role = 'Candidate') {
    const response = await fetch(`${getBaseUrl()}/auth-register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ username, password, role }),
    });
    return parseResponse<AuthResponse>(response);
  },

  async me() {
    const response = await fetch(`${getBaseUrl()}/auth-me`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return parseResponse<{ user: AuthUser }>(response);
  },
};

export class AuthService {
  static async login(username: string, password: string) {
    const data = await authApi.login(username, password);
    AuthService.saveSession(data.session, data.user);
    return data.user;
  }

  static async register(username: string, password: string, role = 'Candidate') {
    const data = await authApi.register(username, password, role);
    AuthService.saveSession(data.session, data.user);
    return data.user;
  }

  static logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_CACHE_KEY);
    localStorage.removeItem(EXPIRES_KEY);
    localStorage.removeItem('camp_lawton_active_user');
  }

  static getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const expiresAt = Number(localStorage.getItem(EXPIRES_KEY) || '0');
    if (expiresAt > 0 && Date.now() / 1000 > expiresAt) {
      AuthService.logout();
      return null;
    }

    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (!cached) return null;

    try {
      return JSON.parse(cached) as AuthUser;
    } catch {
      return null;
    }
  }

  static async validateSession() {
    if (!getToken()) return null;

    try {
      const data = await authApi.me();
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
      window.dispatchEvent(new CustomEvent('auth-user-change', { detail: data.user }));
      return data.user;
    } catch {
      AuthService.logout();
      window.dispatchEvent(new CustomEvent('auth-user-change', { detail: null }));
      return null;
    }
  }

  private static saveSession(session: AuthSession, user: AuthUser) {
    localStorage.setItem(TOKEN_KEY, session.access_token);
    if (session.refresh_token) localStorage.setItem(REFRESH_KEY, session.refresh_token);
    if (session.expires_at) localStorage.setItem(EXPIRES_KEY, String(session.expires_at));
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    localStorage.removeItem('camp_lawton_active_user');
    window.dispatchEvent(new CustomEvent('auth-user-change', { detail: user }));
  }
}
