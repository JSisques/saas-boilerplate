import { useEffect } from 'react';
import type { SDK } from '../../index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import type {
  PaginatedTenantResult,
  TenantCreateInput,
  TenantDeleteInput,
  TenantFindByCriteriaInput,
  TenantUpdateInput,
} from '../../tenant-context/types/index.js';
import { useAsyncState } from './use-async-state.js';

/**
 * Hook for tenant operations
 */
export function useTenants(sdk: SDK) {
  const findByCriteria = useAsyncState<PaginatedTenantResult>(
    (input?: TenantFindByCriteriaInput) => sdk.tenants.findByCriteria(input),
  );

  const create = useAsyncState<MutationResponse>((input: TenantCreateInput) =>
    sdk.tenants.create(input),
  );

  const update = useAsyncState<MutationResponse>((input: TenantUpdateInput) =>
    sdk.tenants.update(input),
  );

  const remove = useAsyncState<MutationResponse>((input: TenantDeleteInput) =>
    sdk.tenants.delete(input),
  );

  return {
    findByCriteria: {
      ...findByCriteria,
      fetch: findByCriteria.execute,
    },
    create: {
      ...create,
      mutate: create.execute,
    },
    update: {
      ...update,
      mutate: update.execute,
    },
    delete: {
      ...remove,
      mutate: remove.execute,
    },
  };
}

/**
 * Hook to fetch tenants by criteria with automatic execution
 */
export function useTenantsList(
  sdk: SDK,
  input?: TenantFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useTenants(sdk);
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, input?.pagination?.page, input?.pagination?.perPage]);

  return findByCriteria;
}
