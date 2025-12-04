import { ISagaStepFindBySagaInstanceIdQueryDto } from '@/saga-context/saga-step/application/dtos/queries/saga-step-find-by-saga-instance-id/saga-step-find-by-saga-instance-id.dto';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

export class FindSagaStepsBySagaInstanceIdQuery {
  readonly sagaInstanceId: SagaInstanceUuidValueObject;

  constructor(props: ISagaStepFindBySagaInstanceIdQueryDto) {
    this.sagaInstanceId = new SagaInstanceUuidValueObject(props.sagaInstanceId);
  }
}
