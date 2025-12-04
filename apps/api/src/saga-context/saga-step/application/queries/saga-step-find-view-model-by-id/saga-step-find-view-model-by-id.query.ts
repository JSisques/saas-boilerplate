import { ISagaStepFindViewModelByIdQueryDto } from '@/saga-context/saga-step/application/dtos/queries/saga-step-find-view-model-by-id/saga-step-find-view-model-by-id.dto';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

export class FindSagaStepViewModelByIdQuery {
  readonly id: SagaStepUuidValueObject;

  constructor(props: ISagaStepFindViewModelByIdQueryDto) {
    this.id = new SagaStepUuidValueObject(props.id);
  }
}
