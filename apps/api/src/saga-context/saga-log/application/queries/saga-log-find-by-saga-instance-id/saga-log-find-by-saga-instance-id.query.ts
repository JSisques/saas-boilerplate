import { ISagaLogFindBySagaInstanceIdQueryDto } from '@/saga-context/saga-log/application/dtos/queries/saga-log-find-by-saga-instance-id/saga-log-find-by-saga-instance-id.dto';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

export class FindSagaLogsBySagaInstanceIdQuery {
  readonly sagaInstanceId: SagaInstanceUuidValueObject;

  constructor(props: ISagaLogFindBySagaInstanceIdQueryDto) {
    this.sagaInstanceId = new SagaInstanceUuidValueObject(props.sagaInstanceId);
  }
}
