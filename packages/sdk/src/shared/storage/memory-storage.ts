import type { Storage } from './storage.interface.js';

/**
 * Memory storage implementation
 * Used as fallback when no storage is available or for server-side rendering
 */
export class MemoryStorage implements Storage {
  private storage: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }
}
