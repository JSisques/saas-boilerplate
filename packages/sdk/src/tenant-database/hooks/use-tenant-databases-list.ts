'use client';
import { useEffect } from 'react';
import type { TenantDatabaseFindByCriteriaInput } from '../types/tenant-database-find-by-criteria-input.type.js';
import { useTenantDatabases } from './use-tenant-databases.js';

export function useTenantDatabasesList(
  input?: TenantDatabaseFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useTenantDatabases();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input as TenantDatabaseFindByCriteriaInput);
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
      findByCriteria.fetch(input as TenantDatabaseFindByCriteriaInput),
  };
}
