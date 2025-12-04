import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';

export const SAGA_LOG_WRITE_REPOSITORY_TOKEN = Symbol('SagaLogWriteRepository');

export interface SagaLogWriteRepository {
  findById(id: string): Promise<SagaLogAggregate | null>;
  findBySagaInstanceId(sagaInstanceId: string): Promise<SagaLogAggregate[]>;
  findBySagaStepId(sagaStepId: string): Promise<SagaLogAggregate[]>;
  save(sagaLog: SagaLogAggregate): Promise<SagaLogAggregate>;
  delete(id: string): Promise<boolean>;
}
