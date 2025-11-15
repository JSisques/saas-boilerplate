import type { DynamicFilter } from "@/shared/presentation/components/organisms/table-layout/table-layout";
import type { Filter } from "@repo/shared/domain/entities/criteria";
import { FilterOperator } from "@repo/shared/domain/enums/filter-operator.enum";

/**
 * Options for converting dynamic filters to API format
 */
export interface ConvertFiltersMapperOptions {
  /**
   * Optional search term to add as a LIKE filter
   */
  search?: string;
  /**
   * Field to use for search filter (required if search is provided)
   */
  searchField?: string;
  /**
   * Operator to use for search filter (defaults to LIKE)
   */
  searchOperator?: FilterOperator;
}

/**
 * Converts dynamic filters to API format
 * @param filters - Array of dynamic filters from the UI
 * @param options - Optional search configuration
 * @returns Array of filters in API format
 */
export function dynamicFiltersToApiFiltersMapper(
  filters: DynamicFilter[],
  options?: ConvertFiltersMapperOptions
): Filter[] {
  const apiFilters: Filter[] = [];

  // Add search filter if provided
  if (options?.search && options?.searchField) {
    apiFilters.push({
      field: options.searchField,
      operator: options.searchOperator || FilterOperator.LIKE,
      value: options.search,
    });
  }

  // Convert dynamic filters to API format
  const convertedFilters = filters
    .filter((f) => f.field && f.operator && f.value)
    .map((f) => ({
      field: f.field,
      operator: f.operator as FilterOperator,
      value: f.value,
    }));

  apiFilters.push(...convertedFilters);

  return apiFilters;
}
