'use client';

import type { DynamicFilter } from '@repo/shared/presentation/components/organisms/dynamic-filters';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface UseDebouncedFiltersOptions {
  /**
   * Debounce delay in milliseconds
   * @default 500
   */
  delay?: number;
}

/**
 * Hook to debounce search and filters to avoid multiple API calls
 * @param search - The search value
 * @param filters - The dynamic filters array
 * @param options - Configuration options
 * @returns Debounced search and filters values
 */
export function useDebouncedFilters(
  search: string,
  filters: DynamicFilter[],
  options?: UseDebouncedFiltersOptions,
) {
  const delay = options?.delay ?? 250;

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Serialize filters to detect deep changes
  const filtersSerialized = useMemo(() => JSON.stringify(filters), [filters]);
  const previousFiltersRef = useRef(filtersSerialized);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, delay);

    return () => clearTimeout(timer);
  }, [search, delay]);

  useEffect(() => {
    // Only update if filters actually changed
    if (previousFiltersRef.current !== filtersSerialized) {
      previousFiltersRef.current = filtersSerialized;
      const timer = setTimeout(() => {
        setDebouncedFilters(filters);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [filters, filtersSerialized, delay]);

  return {
    debouncedSearch,
    debouncedFilters,
  };
}
