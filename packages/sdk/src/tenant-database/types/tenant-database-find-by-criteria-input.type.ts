import type {
  BaseFilter,
  BaseSort,
  PaginationInput,
} from '../../shared/types/index.js';

export type TenantDatabaseFindByCriteriaInput = {
  filters?: BaseFilter[];
  sorts?: BaseSort[];
  pagination?: PaginationInput;
};
