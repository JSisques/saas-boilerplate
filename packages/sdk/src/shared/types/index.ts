// Client configuration
export type GraphQLClientConfig = {
  apiUrl: string;
  accessToken?: string;
  headers?: Record<string, string>;
};

// Common types
export type PaginationInput = {
  page: number;
  perPage: number;
};

export type PaginatedResult<T> = {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  items: T[];
};

export type FilterOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'LIKE'
  | 'IN'
  | 'GREATER_THAN'
  | 'LESS_THAN'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN_OR_EQUAL';

export type SortDirection = 'ASC' | 'DESC';

export type BaseFilter = {
  field: string;
  operator: FilterOperator;
  value: string;
};

export type BaseSort = {
  field: string;
  direction: SortDirection;
};

export type FindByCriteriaInput = {
  filters?: BaseFilter[];
  sorts?: BaseSort[];
  pagination?: PaginationInput;
};

// Mutation Response
export type MutationResponse = {
  success: boolean;
  message?: string;
  id?: string;
};
