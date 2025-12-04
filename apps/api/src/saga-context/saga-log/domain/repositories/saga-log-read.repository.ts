import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

export const SAGA_LOG_READ_REPOSITORY_TOKEN = Symbol('SagaLogReadRepository');

export interface SagaLogReadRepository {
  findById(id: string): Promise<SagaLogViewModel | null>;
  findBySagaInstanceId(sagaInstanceId: string): Promise<SagaLogViewModel[]>;
  findBySagaStepId(sagaStepId: string): Promise<SagaLogViewModel[]>;
  findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<SagaLogViewModel>>;
  save(sagaLogViewModel: SagaLogViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
