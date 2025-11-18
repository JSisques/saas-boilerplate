'use client';
import { useEffect } from 'react';
import { EventFindByCriteriaInput } from '../types/event-find-by-criteria-input.type.js';
import { useEvents } from './use-events.js';

export function useEventsList(
  input?: EventFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useEvents();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) {
      findByCriteria.fetch(input as EventFindByCriteriaInput);
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
    refetch: () => findByCriteria.fetch(input as EventFindByCriteriaInput),
  };
}
