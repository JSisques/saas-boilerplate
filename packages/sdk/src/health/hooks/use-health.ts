'use client';
import { useAsyncState } from '../../react/hooks/use-async-state.js';
import { useSDKContext } from '../../react/sdk-context.js';
import type { HealthResponse } from '../types/health-response.type.js';

export function useHealth() {
  const sdk = useSDKContext();
  const check = useAsyncState<HealthResponse, []>(() => sdk.health.check());

  return {
    check: {
      ...check,
      fetch: check.execute,
    },
  };
}
