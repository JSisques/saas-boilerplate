import type { Storage } from './storage.interface.js';

/**
 * Encodes a cookie name to be safe for cookie storage
 * Replaces invalid characters with URL-safe alternatives
 */
function encodeCookieName(name: string): string {
  return encodeURIComponent(name).replace(/[()]/g, (c) => {
    return c === '(' ? '%28' : '%29';
  });
}

/**
 * Sets a cookie with the given name, value, and expiration days
 */
function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') {
    return;
  }
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const encodedName = encodeCookieName(name);
  document.cookie = `${encodedName}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Gets a cookie by name
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const encodedName = encodeCookieName(name);
  const nameEQ = `${encodedName}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    if (!c) continue;
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Removes a cookie by name
 */
function removeCookie(name: string): void {
  if (typeof document === 'undefined') {
    return;
  }
  const encodedName = encodeCookieName(name);
  document.cookie = `${encodedName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Web storage implementation using localStorage
 * Also stores tokens in cookies for middleware access
 * Compatible with Next.js and browser environments
 */
export class WebStorage implements Storage {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      // First try localStorage
      const value = localStorage.getItem(key);
      if (value) {
        return value;
      }
      // Fallback to cookie (for tokens stored in cookies)
      return getCookie(key);
    } catch (error) {
      console.warn('Failed to get item from storage:', error);
      // Fallback to cookie
      return getCookie(key);
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      // Store in localStorage
      localStorage.setItem(key, value);

      // Also store in cookies if it's a token (for middleware access)
      if (key.includes('accessToken') || key.includes('refreshToken')) {
        setCookie(key, value, 7); // 7 days expiration
      }
    } catch (error) {
      console.warn('Failed to set item in storage:', error);
      // Try to set in cookie as fallback
      if (key.includes('accessToken') || key.includes('refreshToken')) {
        setCookie(key, value, 7);
      }
    }
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem(key);
      // Also remove from cookies
      removeCookie(key);
    } catch (error) {
      console.warn('Failed to remove item from storage:', error);
      // Try to remove from cookie
      removeCookie(key);
    }
  }
}
