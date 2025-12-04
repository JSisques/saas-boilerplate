import type {
  BaseFilter,
  BaseSort,
  PaginationInput,
} from '../../shared/types/index.js';

export type SagaStepFindByCriteriaInput = {
  filters?: BaseFilter[];
  sorts?: BaseSort[];
  pagination?: PaginationInput;
};
