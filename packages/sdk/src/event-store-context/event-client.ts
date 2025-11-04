import type {
  EventFindByCriteriaInput,
  PaginatedEventResult,
} from '@/event-store-context/types/index';
import { GraphQLClient } from '@/shared/client/graphql-client';

export class EventClient {
  constructor(private client: GraphQLClient) {}

  async findByCriteria(
    input?: EventFindByCriteriaInput,
  ): Promise<PaginatedEventResult> {
    const query = `
      query EventsFindByCriteria($input: EventFindByCriteriaRequestDto) {
        eventsFindByCriteria(input: $input) {
          total
          page
          perPage
          totalPages
          items {
            id
            eventType
            aggregateType
            aggregateId
            payload
            timestamp
          }
        }
      }
    `;

    const result = await this.client.request<{
      eventsFindByCriteria: PaginatedEventResult;
    }>({
      query,
      variables: { input: input || {} },
    });

    return result.eventsFindByCriteria;
  }
}
