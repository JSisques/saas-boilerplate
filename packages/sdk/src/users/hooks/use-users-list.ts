'use client';
import { useEffect } from 'react';
import type { UserFindByCriteriaInput } from '../types/user-find-by-criteria-input.type.js';
import { useUsers } from './use-users.js';

export function useUsersList(
  input?: UserFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useUsers();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input as UserFindByCriteriaInput);
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
    refetch: () => findByCriteria.fetch(input as UserFindByCriteriaInput),
  };
}
