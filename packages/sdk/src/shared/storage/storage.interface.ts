/**
 * Storage interface for token management
 * Compatible with React Native (AsyncStorage) and Web (localStorage)
 */
export interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
