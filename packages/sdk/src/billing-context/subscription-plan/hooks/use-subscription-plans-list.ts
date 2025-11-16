'use client';
import { useEffect } from 'react';
import type { SubscriptionPlanFindByCriteriaInput } from '../types/subscription-plan-find-by-criteria-input.type.js';
import { useSubscriptionPlans } from './use-subscription-plans.js';

export function useSubscriptionPlansList(
  input?: SubscriptionPlanFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useSubscriptionPlans();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input as SubscriptionPlanFindByCriteriaInput);
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
      findByCriteria.fetch(input as SubscriptionPlanFindByCriteriaInput),
  };
}
