import { ISagaInstanceFindByIdQueryDto } from '@/saga-context/saga-instance/application/dtos/queries/saga-instance-find-by-id/saga-instance-find-by-id.dto';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

export class FindSagaInstanceByIdQuery {
  readonly id: SagaInstanceUuidValueObject;

  constructor(props: ISagaInstanceFindByIdQueryDto) {
    this.id = new SagaInstanceUuidValueObject(props.id);
  }
}
