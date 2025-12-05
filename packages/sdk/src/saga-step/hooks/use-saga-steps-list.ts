'use client';
import { useEffect } from 'react';
import type { SagaStepFindByCriteriaInput } from '../types/saga-step-find-by-criteria-input.type.js';
import { useSagaSteps } from './use-saga-steps.js';

export function useSagaStepsList(
  input?: SagaStepFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useSagaSteps();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input as SagaStepFindByCriteriaInput);
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
    refetch: () => findByCriteria.fetch(input as SagaStepFindByCriteriaInput),
  };
}
