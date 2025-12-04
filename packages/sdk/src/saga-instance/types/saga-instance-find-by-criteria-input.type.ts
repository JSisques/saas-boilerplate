import type {
  BaseFilter,
  BaseSort,
  PaginationInput,
} from '../../shared/types/index.js';

export type SagaInstanceFindByCriteriaInput = {
  filters?: BaseFilter[];
  sorts?: BaseSort[];
  pagination?: PaginationInput;
};
