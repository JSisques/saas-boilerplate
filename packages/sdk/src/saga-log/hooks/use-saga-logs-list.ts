'use client';
import { useEffect } from 'react';
import type { SagaLogFindByCriteriaInput } from '../types/saga-log-find-by-criteria-input.type.js';
import { useSagaLogs } from './use-saga-logs.js';

export function useSagaLogsList(
  input?: SagaLogFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useSagaLogs();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input as SagaLogFindByCriteriaInput);
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
    refetch: () => findByCriteria.fetch(input as SagaLogFindByCriteriaInput),
  };
}
