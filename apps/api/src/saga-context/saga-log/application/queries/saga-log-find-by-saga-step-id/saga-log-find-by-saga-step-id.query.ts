import { ISagaLogFindBySagaStepIdQueryDto } from '@/saga-context/saga-log/application/dtos/queries/saga-log-find-by-saga-step-id/saga-log-find-by-saga-step-id.dto';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

export class FindSagaLogsBySagaStepIdQuery {
  readonly sagaStepId: SagaStepUuidValueObject;

  constructor(props: ISagaLogFindBySagaStepIdQueryDto) {
    this.sagaStepId = new SagaStepUuidValueObject(props.sagaStepId);
  }
}
