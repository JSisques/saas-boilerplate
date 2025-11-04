import type {
  EventFindByCriteriaInput,
  PaginatedEventResult,
} from '../../event-store-context/types/index.js';
import type { SDK } from '../../index.js';
import { useAsyncState } from './use-async-state.js';

/**
 * Hook for event operations
 */
export function useEvents(sdk: SDK) {
  const findByCriteria = useAsyncState<
    PaginatedEventResult,
    [EventFindByCriteriaInput?]
  >((input?: EventFindByCriteriaInput) => sdk.events.findByCriteria(input));

  return {
    findByCriteria: {
      ...findByCriteria,
      fetch: findByCriteria.execute,
    },
  };
}
