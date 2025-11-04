import { useEffect } from 'react';
import type { HealthResponse } from '../../health-context/types/index.js';
import type { SDK } from '../../index.js';
import { useAsyncState } from './use-async-state.js';

/**
 * Hook for health check operations
 */
export function useHealth(sdk: SDK, options?: { autoFetch?: boolean }) {
  const check = useAsyncState<HealthResponse>(() => sdk.health.check());

  useEffect(() => {
    if (options?.autoFetch !== false) {
      check.execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    check: {
      ...check,
      fetch: check.execute,
    },
  };
}
