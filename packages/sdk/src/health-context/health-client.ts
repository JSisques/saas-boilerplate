import type { HealthResponse } from '@/health-context/types/index';
import { GraphQLClient } from '@/shared/client/graphql-client';

export class HealthClient {
  constructor(private client: GraphQLClient) {}

  async check(): Promise<HealthResponse> {
    const query = `
      query HealthCheck {
        healthCheck {
          status
        }
      }
    `;

    const result = await this.client.request<{ healthCheck: HealthResponse }>({
      query,
    });

    return result.healthCheck;
  }
}
