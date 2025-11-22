import { useAsyncState } from '../../react/hooks/use-async-state.js';
import { useSDKContext } from '../../react/index.js';
import { MutationResponse } from '../../shared/types/index';
import { PaginatedTenantMemberResult } from '../types/paginated-tenant-member-result.type.js';
import { TenantMemberAddInput } from '../types/tenant-member-add-input.type.js';
import { TenantMemberFindByCriteriaInput } from '../types/tenant-member-find-by-criteria-input.type.js';
import { TenantMemberFindByIdInput } from '../types/tenant-member-find-by-id-input.type.js';
import { TenantMemberRemoveInput } from '../types/tenant-member-remove-input.type.js';
import { TenantMemberResponse } from '../types/tenant-member-response.type.js';
import { TenantMemberUpdateInput } from '../types/tenant-member-update-input.type.js';

export function useTenantMembers() {
  const sdk = useSDKContext();

  const findByCriteria = useAsyncState<
    PaginatedTenantMemberResult,
    [TenantMemberFindByCriteriaInput]
  >((input: TenantMemberFindByCriteriaInput) =>
    sdk.tenantMembers.findByCriteria(input),
  );

  const findById = useAsyncState<
    TenantMemberResponse,
    [TenantMemberFindByIdInput]
  >((input: TenantMemberFindByIdInput) => sdk.tenantMembers.findById(input));

  const create = useAsyncState<MutationResponse, [TenantMemberAddInput]>(
    (input: TenantMemberAddInput) => sdk.tenantMembers.add(input),
  );

  const update = useAsyncState<MutationResponse, [TenantMemberUpdateInput]>(
    (input: TenantMemberUpdateInput) => sdk.tenantMembers.update(input),
  );

  const remove = useAsyncState<MutationResponse, [TenantMemberRemoveInput]>(
    (input: TenantMemberRemoveInput) => sdk.tenantMembers.remove(input),
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
