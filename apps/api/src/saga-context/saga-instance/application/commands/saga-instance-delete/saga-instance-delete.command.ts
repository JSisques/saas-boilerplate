import { ISagaInstanceDeleteCommandDto } from '@/saga-context/saga-instance/application/dtos/commands/saga-instance-delete/saga-instance-delete-command.dto';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

export class SagaInstanceDeleteCommand {
  readonly id: SagaInstanceUuidValueObject;

  constructor(props: ISagaInstanceDeleteCommandDto) {
    this.id = new SagaInstanceUuidValueObject(props.id);
  }
}
