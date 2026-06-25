/**
 * AuthService — Camp Lawton Staff Portal
 *
 * Replaces the previous localStorage-only implementation with
 * calls to the Netlify Functions backend backed by Supabase Auth.
 *
 * Session storage strategy:
 *   - Access token  → localStorage('lawton_access_token')    [short-lived JWT]
 *   - Refresh token → localStorage('lawton_refresh_token')   [long-lived]
 *   - User profile  → localStorage('lawton_user_cache')      [cached for instant UI]
 *
 * The cache is validated against the server on every page load via auth-me.
 */
import { api } from './apiClient.js';

const TOKEN_KEY = 'lawton_access_token';
const REFRESH_KEY = 'lawton_refresh_token';
const USER_CACHE_KEY = 'lawton_user_cache';
const EXPIRES_KEY = 'lawton_token_expires';

export class AuthService {
  /** Register a new user account */
  static async register(username, plainPassword, role = 'Candidate') {
    const data = await api.register(username, plainPassword, role);
    AuthService._saveSession(data.session, data.user);
    return data.user;
  }

  /** Log in with username + password */
  static async login(username, plainPassword) {
    const data = await api.login(username, plainPassword);
    AuthService._saveSession(data.session, data.user);
    return data.user;
  }

  /** Log out — clears all session data */
  static logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_CACHE_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  }

  /**
   * Returns the currently cached user profile synchronously.
   * Returns null if not logged in or session has expired.
   * For a guaranteed-fresh result, use validateSession() instead.
   */
  static getCurrentUser() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const expiresAt = parseInt(localStorage.getItem(EXPIRES_KEY) || '0');
    if (Date.now() / 1000 > expiresAt) {
      AuthService.logout();
      return null;
    }

    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (!cached) return null;

    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }

  /**
   * Validates the session against the server and refreshes the cached profile.
   * Call this on page load. Returns user or null.
   */
  static async validateSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const data = await api.me();
      // Update cache with fresh profile data
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
      return data.user;
    } catch {
      // Token invalid/expired — clear session
      AuthService.logout();
      return null;
    }
  }

  static isAdmin() {
    const user = AuthService.getCurrentUser();
    return ['Admin', 'Camp Director', 'Program Director'].includes(user?.role);
  }

  static isLoggedIn() {
    return AuthService.getCurrentUser() !== null;
  }

  static requireAdmin() {
    if (!AuthService.isAdmin()) {
      throw new Error('Insufficient permissions');
    }
  }

  /** Internal: persist session tokens and user cache */
  static _saveSession(session, user) {
    localStorage.setItem(TOKEN_KEY, session.access_token);
    localStorage.setItem(REFRESH_KEY, session.refresh_token);
    localStorage.setItem(EXPIRES_KEY, String(session.expires_at));
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  }
}
