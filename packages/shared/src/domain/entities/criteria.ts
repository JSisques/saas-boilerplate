import { FilterOperator } from "@repo/shared/domain/enums/filter-operator.enum";
import { SortDirection } from "@repo/shared/domain/enums/sort-direction.enum";

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export interface Sort {
  field: string;
  direction: SortDirection;
}

export interface Pagination {
  page: number;
  perPage: number;
}

export class Criteria {
  constructor(
    public filters: Filter[] = [],
    public sorts: Sort[] = [],
    public pagination: Pagination = { page: 1, perPage: 10 }
  ) {}
}
