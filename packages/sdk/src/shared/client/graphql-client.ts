import { createStorage } from '../storage/storage-factory.js';
import type { Storage } from '../storage/storage.interface.js';
import type { GraphQLClientConfig } from '../types/index.js';

export type GraphQLRequestOptions = {
  query: string;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
};

export type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
};

const DEFAULT_STORAGE_PREFIX = '@repo/sdk:';

export class GraphQLClient {
  private apiUrl: string;
  private accessToken?: string;
  private refreshToken?: string;
  private storage: Storage;
  private storagePrefix: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: GraphQLClientConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, '');
    this.storage = createStorage(config.storage);
    this.storagePrefix = config.storagePrefix || DEFAULT_STORAGE_PREFIX;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    // Initialize tokens from config or storage
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;

    // Load tokens from storage if not provided
    this.loadTokensFromStorage();
  }

  private async loadTokensFromStorage(): Promise<void> {
    if (!this.accessToken) {
      const storedAccessToken = await this.storage.getItem(
        `${this.storagePrefix}accessToken`,
      );
      if (storedAccessToken) {
        this.accessToken = storedAccessToken;
      }
    }

    if (!this.refreshToken) {
      const storedRefreshToken = await this.storage.getItem(
        `${this.storagePrefix}refreshToken`,
      );
      if (storedRefreshToken) {
        this.refreshToken = storedRefreshToken;
      }
    }
  }

  async setAccessToken(token: string | undefined): Promise<void> {
    this.accessToken = token;
    if (token) {
      await this.storage.setItem(`${this.storagePrefix}accessToken`, token);
    } else {
      await this.storage.removeItem(`${this.storagePrefix}accessToken`);
    }
  }

  async setRefreshToken(token: string | undefined): Promise<void> {
    this.refreshToken = token;
    if (token) {
      await this.storage.setItem(`${this.storagePrefix}refreshToken`, token);
    } else {
      await this.storage.removeItem(`${this.storagePrefix}refreshToken`);
    }
  }

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      this.setAccessToken(accessToken),
      this.setRefreshToken(refreshToken),
    ]);
  }

  getAccessToken(): string | undefined {
    return this.accessToken;
  }

  getRefreshToken(): string | undefined {
    return this.refreshToken;
  }

  async clearTokens(): Promise<void> {
    this.accessToken = undefined;
    this.refreshToken = undefined;
    await Promise.all([
      this.storage.removeItem(`${this.storagePrefix}accessToken`),
      this.storage.removeItem(`${this.storagePrefix}refreshToken`),
    ]);
  }

  async request<T>(options: GraphQLRequestOptions): Promise<T> {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.apiUrl}/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: options.query,
        variables: options.variables || {},
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = (await response.json()) as GraphQLResponse<T>;

    if (result.errors && result.errors.length > 0) {
      const error = result.errors[0];
      if (error) {
        throw new Error(error.message || 'GraphQL error');
      }
      throw new Error('GraphQL error');
    }

    if (!result.data) {
      throw new Error('No data returned from GraphQL query');
    }

    return result.data;
  }
}
