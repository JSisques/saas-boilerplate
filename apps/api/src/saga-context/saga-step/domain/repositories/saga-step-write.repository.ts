import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';

export const SAGA_STEP_WRITE_REPOSITORY_TOKEN = Symbol(
  'SagaStepWriteRepository',
);

export interface SagaStepWriteRepository {
  findById(id: string): Promise<SagaStepAggregate | null>;
  findBySagaInstanceId(sagaInstanceId: string): Promise<SagaStepAggregate[]>;
  save(sagaStep: SagaStepAggregate): Promise<SagaStepAggregate>;
  delete(id: string): Promise<boolean>;
}
