import { ISagaLogFindViewModelBySagaStepIdQueryDto } from '@/saga-context/saga-log/application/dtos/queries/saga-log-find-view-model-by-saga-step-id/saga-log-find-view-model-by-saga-step-id.dto';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

export class FindSagaLogViewModelsBySagaStepIdQuery {
  readonly sagaStepId: SagaStepUuidValueObject;

  constructor(props: ISagaLogFindViewModelBySagaStepIdQueryDto) {
    this.sagaStepId = new SagaStepUuidValueObject(props.sagaStepId);
  }
}
