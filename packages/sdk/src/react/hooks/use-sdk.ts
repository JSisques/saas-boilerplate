import { useMemo } from 'react';
import { SDK } from '../../index.js';
import type { Storage } from '../../shared/storage/storage.interface.js';
import type { GraphQLClientConfig } from '../../shared/types/index.js';

/**
 * Hook to create and manage an SDK instance
 * This ensures the SDK instance is stable across re-renders
 */
export function useSDK(config: GraphQLClientConfig, storage?: Storage): SDK {
  const sdk = useMemo(() => {
    return new SDK({
      ...config,
      storage,
    });
  }, [config.apiUrl, storage]);

  return sdk;
}
