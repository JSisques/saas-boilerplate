import { ISagaLogFindViewModelBySagaInstanceIdQueryDto } from '@/saga-context/saga-log/application/dtos/queries/saga-log-find-view-model-by-saga-instance-id/saga-log-find-view-model-by-saga-instance-id.dto';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

export class FindSagaLogViewModelsBySagaInstanceIdQuery {
  readonly sagaInstanceId: SagaInstanceUuidValueObject;

  constructor(props: ISagaLogFindViewModelBySagaInstanceIdQueryDto) {
    this.sagaInstanceId = new SagaInstanceUuidValueObject(props.sagaInstanceId);
  }
}
