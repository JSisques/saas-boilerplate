import { ISagaInstanceFindViewModelByIdQueryDto } from '@/saga-context/saga-instance/application/dtos/queries/saga-instance-find-view-model-by-id/saga-instance-find-view-model-by-id.dto';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

export class FindSagaInstanceViewModelByIdQuery {
  readonly id: SagaInstanceUuidValueObject;

  constructor(props: ISagaInstanceFindViewModelByIdQueryDto) {
    this.id = new SagaInstanceUuidValueObject(props.id);
  }
}
