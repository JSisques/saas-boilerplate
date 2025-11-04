import type { GraphQLClientConfig } from '@/shared/types/index';

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

export class GraphQLClient {
  private apiUrl: string;
  private accessToken?: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: GraphQLClientConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, '');
    this.accessToken = config.accessToken;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  setAccessToken(token: string | undefined): void {
    this.accessToken = token;
  }

  getAccessToken(): string | undefined {
    return this.accessToken;
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
