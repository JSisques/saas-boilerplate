'use client';
import { useEffect } from 'react';
import type { SagaInstanceFindByCriteriaInput } from '../types/saga-instance-find-by-criteria-input.type.js';
import { useSagaInstances } from './use-saga-instances.js';

export function useSagaInstancesList(
  input?: SagaInstanceFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useSagaInstances();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input as SagaInstanceFindByCriteriaInput);
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
      findByCriteria.fetch(input as SagaInstanceFindByCriteriaInput),
  };
}
