'use client';
import { useEffect } from 'react';
import type { FeatureFindByCriteriaInput } from '../types/feature-find-by-criteria-input.type.js';
import { useFeatures } from './use-features.js';

export function useFeaturesList(
  input?: FeatureFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useFeatures();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input as FeatureFindByCriteriaInput);
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
    refetch: () => findByCriteria.fetch(input as FeatureFindByCriteriaInput),
  };
}
