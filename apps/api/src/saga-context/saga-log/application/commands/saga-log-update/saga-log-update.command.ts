import { ISagaLogUpdateCommandDto } from '@/saga-context/saga-log/application/dtos/commands/saga-log-update/saga-log-update-command.dto';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';

export class SagaLogUpdateCommand {
  readonly id: SagaLogUuidValueObject;
  readonly type?: SagaLogTypeValueObject;
  readonly message?: SagaLogMessageValueObject;

  constructor(props: ISagaLogUpdateCommandDto) {
    this.id = new SagaLogUuidValueObject(props.id);

    if (props.type !== undefined) {
      this.type = new SagaLogTypeValueObject(props.type);
    }
    if (props.message !== undefined) {
      this.message = new SagaLogMessageValueObject(props.message);
    }
  }
}
