import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

export const SAGA_INSTANCE_READ_REPOSITORY_TOKEN = Symbol(
  'SagaInstanceReadRepository',
);

export interface SagaInstanceReadRepository {
  findById(id: string): Promise<SagaInstanceViewModel | null>;
  findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<SagaInstanceViewModel>>;
  save(sagaInstanceViewModel: SagaInstanceViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
