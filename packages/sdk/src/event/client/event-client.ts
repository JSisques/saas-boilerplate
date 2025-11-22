import { EventFindByCriteriaInput } from '../types/event-find-by-criteria-input.type';
import { PaginatedEventResult } from '../types/event-paginated-response.type';

import { GraphQLClient } from '../../shared/client/graphql-client';
import { MutationResponse } from '../../shared/types/index';
import { EVENT_REPLAY_MUTATION } from '../graphql/mutations/event.mutations';
import { EVENT_FIND_BY_CRITERIA_QUERY } from '../graphql/queries/event.queries';
import { EventReplayRequestDto } from '../types/event-replay-input.type';

export class EventClient {
  constructor(private client: GraphQLClient) {}

  /**
   * Find events by criteria
   * @param input - The event find by criteria input
   * @returns The paginated event result
   */
  async findByCriteria(
    input?: EventFindByCriteriaInput,
  ): Promise<PaginatedEventResult> {
    const result = await this.client.request<{
      eventsFindByCriteria: PaginatedEventResult;
    }>({
      query: EVENT_FIND_BY_CRITERIA_QUERY,
      variables: { input: input || {} },
    });

    return result.eventsFindByCriteria;
  }

  /**
   * Replay events
   * @param input - The event replay input
   * @returns The mutation response
   */
  async replay(input: EventReplayRequestDto): Promise<MutationResponse> {
    const result = await this.client.request<{
      eventReplay: MutationResponse;
    }>({
      query: EVENT_REPLAY_MUTATION,
      variables: { input },
    });

    return result.eventReplay;
  }
}
