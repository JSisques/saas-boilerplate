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

const AUTH_REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($input: AuthRefreshTokenRequestDto!) {
    refreshToken(input: $input) {
      accessToken
    }
  }
`;

export class GraphQLClient {
  private apiUrl: string;
  private accessToken?: string;
  private refreshToken?: string;
  private storage: Storage;
  private storagePrefix: string;
  private defaultHeaders: Record<string, string>;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<string> | null = null;

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

  /**
   * Refresh the access token using the refresh token
   * @private
   */
  private async refreshAccessToken(): Promise<string> {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const headers: Record<string, string> = {
          ...this.defaultHeaders,
        };

        const response = await fetch(`${this.apiUrl}/graphql`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query: AUTH_REFRESH_TOKEN_MUTATION,
            variables: {
              input: {
                refreshToken: this.refreshToken,
              },
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = (await response.json()) as GraphQLResponse<{
          refreshToken: { accessToken: string };
        }>;

        if (result.errors && result.errors.length > 0) {
          const error = result.errors[0];
          if (error) {
            throw new Error(error.message || 'GraphQL error');
          }
          throw new Error('GraphQL error');
        }

        if (!result.data?.refreshToken?.accessToken) {
          throw new Error('No access token returned from refresh');
        }

        const newAccessToken = result.data.refreshToken.accessToken;
        await this.setAccessToken(newAccessToken);

        return newAccessToken;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
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

    // Check for 401 Unauthorized error
    if (response.status === 401 && this.refreshToken) {
      try {
        // Attempt to refresh the token
        await this.refreshAccessToken();

        // Retry the original request with the new access token
        const retryHeaders: Record<string, string> = {
          ...this.defaultHeaders,
          ...options.headers,
        };

        if (this.accessToken) {
          retryHeaders['Authorization'] = `Bearer ${this.accessToken}`;
        }

        const retryResponse = await fetch(`${this.apiUrl}/graphql`, {
          method: 'POST',
          headers: retryHeaders,
          body: JSON.stringify({
            query: options.query,
            variables: options.variables || {},
          }),
        });

        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }

        const retryResult = (await retryResponse.json()) as GraphQLResponse<T>;

        if (retryResult.errors && retryResult.errors.length > 0) {
          const error = retryResult.errors[0];
          if (error) {
            throw new Error(error.message || 'GraphQL error');
          }
          throw new Error('GraphQL error');
        }

        if (!retryResult.data) {
          throw new Error('No data returned from GraphQL query');
        }

        return retryResult.data;
      } catch (refreshError) {
        // If refresh fails, clear tokens and throw
        await this.clearTokens();
        throw refreshError;
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = (await response.json()) as GraphQLResponse<T>;

    if (result.errors && result.errors.length > 0) {
      const error = result.errors[0];

      // Check if it's an unauthorized error from GraphQL
      const isUnauthorized =
        error?.extensions?.code === 'UNAUTHENTICATED' ||
        error?.message?.toLowerCase().includes('unauthorized') ||
        error?.message?.toLowerCase().includes('invalid token');

      if (isUnauthorized && this.refreshToken) {
        try {
          // Attempt to refresh the token
          await this.refreshAccessToken();

          // Retry the original request with the new access token
          return this.request<T>(options);
        } catch (refreshError) {
          // If refresh fails, clear tokens and throw
          await this.clearTokens();
          throw refreshError;
        }
      }

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
