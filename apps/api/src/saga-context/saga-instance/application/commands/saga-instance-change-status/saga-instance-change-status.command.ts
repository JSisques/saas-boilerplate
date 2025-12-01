import { ISagaInstanceChangeStatusCommandDto } from '@/saga-context/saga-instance/application/dtos/commands/saga-instance-change-status/saga-instance-change-status-command.dto';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

export class SagaInstanceChangeStatusCommand {
  readonly id: SagaInstanceUuidValueObject;
  readonly status: SagaInstanceStatusValueObject;

  constructor(props: ISagaInstanceChangeStatusCommandDto) {
    this.id = new SagaInstanceUuidValueObject(props.id);
    this.status = new SagaInstanceStatusValueObject(props.status);
  }
}
