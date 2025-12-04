import { ISagaLogDeleteCommandDto } from '@/saga-context/saga-log/application/dtos/commands/saga-log-delete/saga-log-delete-command.dto';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';

export class SagaLogDeleteCommand {
  readonly id: SagaLogUuidValueObject;

  constructor(props: ISagaLogDeleteCommandDto) {
    this.id = new SagaLogUuidValueObject(props.id);
  }
}
