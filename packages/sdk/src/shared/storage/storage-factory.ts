import { MemoryStorage } from './memory-storage.js';
import type { Storage } from './storage.interface.js';
import { WebStorage } from './web-storage.js';

/**
 * Creates the appropriate storage implementation based on the environment
 * - React Native: expects AsyncStorage to be passed
 * - Web/Next.js: uses localStorage
 * - Server-side/fallback: uses memory storage
 */
export function createStorage(customStorage?: Storage): Storage {
  // If custom storage is provided (e.g., AsyncStorage from React Native), use it
  if (customStorage) {
    return customStorage;
  }

  // Try to use WebStorage (localStorage) if available
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      return new WebStorage();
    } catch {
      console.warn(
        'Failed to initialize WebStorage, falling back to MemoryStorage',
      );
    }
  }

  // Fallback to memory storage (server-side or when storage is not available)
  return new MemoryStorage();
}
