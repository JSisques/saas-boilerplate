import { GraphQLClient } from '../../shared/client/graphql-client';
import { HEALTH_CHECK_QUERY } from '../graphql/queries/health.queries';
import type { HealthResponse } from '../types/health-response.type';

export class HealthClient {
  constructor(private client: GraphQLClient) {}

  async check(): Promise<HealthResponse> {
    const result = await this.client.request<{ healthCheck: HealthResponse }>({
      query: HEALTH_CHECK_QUERY,
    });

    return result.healthCheck;
  }
}
