import { useAsyncState } from '../../react/hooks/use-async-state.js';
import { useSDKContext } from '../../react/index.js';
import { MutationResponse } from '../../shared/types/index';
import { PaginatedTenantResult } from '../types/paginated-tenant-result.type';
import { TenantCreateInput } from '../types/tenant-create-input.type';
import { TenantDeleteInput } from '../types/tenant-delete-input.type';
import { TenantFindByCriteriaInput } from '../types/tenant-find-by-criteria-input.type';
import { TenantFindByIdInput } from '../types/tenant-find-by-id-input.type';
import { TenantResponse } from '../types/tenant-response.type';
import { TenantUpdateInput } from '../types/tenant-update-input.type';

export function useTenants() {
  const sdk = useSDKContext();

  const findByCriteria = useAsyncState<
    PaginatedTenantResult,
    [TenantFindByCriteriaInput]
  >((input: TenantFindByCriteriaInput) => sdk.tenants.findByCriteria(input));

  const findById = useAsyncState<TenantResponse, [TenantFindByIdInput]>(
    (input: TenantFindByIdInput) => sdk.tenants.findById(input),
  );

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
    findById: {
      ...findById,
      fetch: findById.execute,
    },
    create: {
      ...create,
      fetch: create.execute,
    },
    update: {
      ...update,
      fetch: update.execute,
    },
    remove: {
      ...remove,
      fetch: remove.execute,
    },
  };
}
