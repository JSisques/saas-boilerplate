import type { PaginatedResult } from '../../shared/types/index.js';
import type { SagaLogResponse } from './saga-log-response.type.js';

export type PaginatedSagaLogResult = PaginatedResult<SagaLogResponse>;
