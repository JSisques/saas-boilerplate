import { ISagaStepFindViewModelBySagaInstanceIdQueryDto } from '@/saga-context/saga-step/application/dtos/queries/saga-step-find-view-model-by-saga-instance-id/saga-step-find-view-model-by-saga-instance-id.dto';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

export class FindSagaStepViewModelsBySagaInstanceIdQuery {
  readonly sagaInstanceId: SagaInstanceUuidValueObject;

  constructor(props: ISagaStepFindViewModelBySagaInstanceIdQueryDto) {
    this.sagaInstanceId = new SagaInstanceUuidValueObject(props.sagaInstanceId);
  }
}
