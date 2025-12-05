import type {
  BaseFilter,
  BaseSort,
  PaginationInput,
} from '../../shared/types/index.js';

export type SagaLogFindByCriteriaInput = {
  filters?: BaseFilter[];
  sorts?: BaseSort[];
  pagination?: PaginationInput;
};
