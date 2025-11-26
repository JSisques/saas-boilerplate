'use client';

import { useEffect } from 'react';
import { TenantMemberFindByCriteriaInput } from '../types/tenant-member-find-by-criteria-input.type.js';
import { useTenantMembers } from './use-tenant-members.js';

export function useTenantMemberList(
  input?: TenantMemberFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useTenantMembers();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input as TenantMemberFindByCriteriaInput);
    }
  }, [
    enabled,
    input?.pagination?.page,
    input?.pagination?.perPage,
    input?.filters,
    input?.sorts,
  ]);

  return {
    ...findByCriteria,
    refetch: () =>
      findByCriteria.fetch(input as TenantMemberFindByCriteriaInput),
  };
}
