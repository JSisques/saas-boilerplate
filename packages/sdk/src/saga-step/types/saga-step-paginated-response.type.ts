import type { PaginatedResult } from '../../shared/types/index.js';
import type { SagaStepResponse } from './saga-step-response.type.js';

export type PaginatedSagaStepResult = PaginatedResult<SagaStepResponse>;
