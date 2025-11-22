'use client';

import { useEffect } from 'react';
import { TenantFindByCriteriaInput } from '../types/tenant-find-by-criteria-input.type.js';
import { useTenants } from './use-tenants.js';

export function useTenantList(
  input?: TenantFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useTenants();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input as TenantFindByCriteriaInput);
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
    refetch: () => findByCriteria.fetch(input as TenantFindByCriteriaInput),
  };
}
