import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';

export const SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN = Symbol(
  'SagaInstanceWriteRepository',
);

export interface SagaInstanceWriteRepository {
  findById(id: string): Promise<SagaInstanceAggregate | null>;
  save(sagaInstance: SagaInstanceAggregate): Promise<SagaInstanceAggregate>;
  delete(id: string): Promise<boolean>;
}
