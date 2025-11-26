import { useAsyncState } from '../../react/hooks/index.js';
import { useSDKContext } from '../../react/sdk-context.js';
import { MutationResponse } from '../../shared/types/index.js';
import { EventFindByCriteriaInput } from '../types/event-find-by-criteria-input.type.js';
import { PaginatedEventResult } from '../types/event-paginated-response.type.js';
import { EventReplayRequestDto } from '../types/event-replay-input.type.js';

/**
 * Hook for event operations
 */
export function useEvents() {
  const sdk = useSDKContext();

  const findByCriteria = useAsyncState<
    PaginatedEventResult,
    [EventFindByCriteriaInput]
  >((input: EventFindByCriteriaInput) => sdk.events.findByCriteria(input));

  const replay = useAsyncState<MutationResponse, [EventReplayRequestDto]>(
    (input: EventReplayRequestDto) => sdk.events.replay(input),
  );

  return {
    findByCriteria: {
      ...findByCriteria,
      fetch: findByCriteria.execute,
    },
    replay: {
      ...replay,
      fetch: replay.execute,
    },
  };
}
