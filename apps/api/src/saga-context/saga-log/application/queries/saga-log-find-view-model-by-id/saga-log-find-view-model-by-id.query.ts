import { ISagaLogFindViewModelByIdQueryDto } from '@/saga-context/saga-log/application/dtos/queries/saga-log-find-view-model-by-id/saga-log-find-view-model-by-id.dto';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';

export class FindSagaLogViewModelByIdQuery {
  readonly id: SagaLogUuidValueObject;

  constructor(props: ISagaLogFindViewModelByIdQueryDto) {
    this.id = new SagaLogUuidValueObject(props.id);
  }
}
