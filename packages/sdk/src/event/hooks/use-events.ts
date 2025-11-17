import { useAsyncState } from '../../react/hooks/index.js';
import { useSDKContext } from '../../react/sdk-context.js';
import { EventFindByCriteriaInput } from '../types/event-find-by-criteria-input.type.js';
import { PaginatedEventResult } from '../types/event-paginated-response.type.js';

/**
 * Hook for creating a subscription plan
 */
export function useEvents() {
  const sdk = useSDKContext();

  const findByCriteria = useAsyncState<
    PaginatedEventResult,
    [EventFindByCriteriaInput]
  >((input: EventFindByCriteriaInput) => sdk.events.findByCriteria(input));

  return {
    findByCriteria: {
      ...findByCriteria,
      fetch: findByCriteria.execute,
    },
  };
}
