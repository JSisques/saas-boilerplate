'use client';
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
  const findByCriteria = useAsyncState<
    PaginatedTenantResult,
    [TenantFindByCriteriaInput?]
  >((input?: TenantFindByCriteriaInput) => sdk.tenants.findByCriteria(input));

  const create = useAsyncState<MutationResponse, [TenantCreateInput]>(
    (input: TenantCreateInput) => sdk.tenants.create(input),
  );

  const update = useAsyncState<MutationResponse, [TenantUpdateInput]>(
    (input: TenantUpdateInput) => sdk.tenants.update(input),
  );

  const remove = useAsyncState<MutationResponse, [TenantDeleteInput]>(
    (input: TenantDeleteInput) => sdk.tenants.delete(input),
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
  }, [enabled, input, findByCriteria]);

  return findByCriteria;
}
