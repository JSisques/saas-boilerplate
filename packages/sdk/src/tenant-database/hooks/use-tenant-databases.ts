'use client';
import { useAsyncState } from '../../react/hooks/use-async-state.js';
import { useSDKContext } from '../../react/index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import type {
  PaginatedTenantDatabaseResult,
  TenantDatabaseCreateInput,
  TenantDatabaseDeleteInput,
  TenantDatabaseFindByCriteriaInput,
  TenantDatabaseFindByIdInput,
  TenantDatabaseResponse,
  TenantDatabaseUpdateInput,
} from '../index.js';

/**
 * Hook for tenant database operations
 */
export function useTenantDatabases() {
  const sdk = useSDKContext();
  const findByCriteria = useAsyncState<
    PaginatedTenantDatabaseResult,
    [TenantDatabaseFindByCriteriaInput?]
  >((input?: TenantDatabaseFindByCriteriaInput) =>
    sdk.tenantDatabases.findByCriteria(input),
  );

  const findById = useAsyncState<
    TenantDatabaseResponse,
    [TenantDatabaseFindByIdInput]
  >((input: TenantDatabaseFindByIdInput) =>
    sdk.tenantDatabases.findById(input),
  );

  const create = useAsyncState<MutationResponse, [TenantDatabaseCreateInput]>(
    (input: TenantDatabaseCreateInput) => sdk.tenantDatabases.create(input),
  );

  const update = useAsyncState<MutationResponse, [TenantDatabaseUpdateInput]>(
    (input: TenantDatabaseUpdateInput) => sdk.tenantDatabases.update(input),
  );

  const remove = useAsyncState<MutationResponse, [TenantDatabaseDeleteInput]>(
    (input: TenantDatabaseDeleteInput) => sdk.tenantDatabases.delete(input),
  );

  return {
    findByCriteria: {
      ...findByCriteria,
      fetch: findByCriteria.execute,
    },
    findById: {
      ...findById,
      fetch: findById.execute,
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
