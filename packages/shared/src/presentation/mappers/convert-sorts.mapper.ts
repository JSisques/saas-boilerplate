import { SortDirection } from '@repo/shared/domain/enums/sort-direction.enum';

export type UiSortDirection = 'asc' | 'desc' | SortDirection | 'ASC' | 'DESC';
export type UiSort = { field: string; direction: UiSortDirection };

export type ApiSort = {
  field: string;
  direction: SortDirection;
};

export function dynamicSortsToApiSortsMapper(sorts: UiSort[]): ApiSort[] {
  if (!Array.isArray(sorts) || sorts.length === 0) return [];
  return sorts.map((sort) => {
    const dir = String(sort.direction).toLowerCase();
    return {
      field: sort.field,
      direction: dir === 'asc' ? SortDirection.ASC : SortDirection.DESC,
    };
  });
}
