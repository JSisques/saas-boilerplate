import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

export const SAGA_STEP_READ_REPOSITORY_TOKEN = Symbol('SagaStepReadRepository');

export interface SagaStepReadRepository {
  findById(id: string): Promise<SagaStepViewModel | null>;
  findBySagaInstanceId(sagaInstanceId: string): Promise<SagaStepViewModel[]>;
  findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<SagaStepViewModel>>;
  save(sagaStepViewModel: SagaStepViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
