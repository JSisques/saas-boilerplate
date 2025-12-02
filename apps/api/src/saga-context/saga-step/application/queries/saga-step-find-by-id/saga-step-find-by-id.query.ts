import { ISagaStepFindByIdQueryDto } from '@/saga-context/saga-step/application/dtos/queries/saga-step-find-by-id/saga-step-find-by-id.dto';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

export class FindSagaStepByIdQuery {
  readonly id: SagaStepUuidValueObject;

  constructor(props: ISagaStepFindByIdQueryDto) {
    this.id = new SagaStepUuidValueObject(props.id);
  }
}
