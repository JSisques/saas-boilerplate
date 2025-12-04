import { ISagaLogFindByIdQueryDto } from '@/saga-context/saga-log/application/dtos/queries/saga-log-find-by-id/saga-log-find-by-id.dto';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';

export class FindSagaLogByIdQuery {
  readonly id: SagaLogUuidValueObject;

  constructor(props: ISagaLogFindByIdQueryDto) {
    this.id = new SagaLogUuidValueObject(props.id);
  }
}
