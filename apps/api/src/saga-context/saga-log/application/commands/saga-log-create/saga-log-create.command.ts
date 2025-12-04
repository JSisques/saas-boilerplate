import { ISagaLogCreateCommandDto } from '@/saga-context/saga-log/application/dtos/commands/saga-log-create/saga-log-create-command.dto';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

export class SagaLogCreateCommand {
  readonly id: SagaLogUuidValueObject;
  readonly sagaInstanceId: SagaInstanceUuidValueObject;
  readonly sagaStepId: SagaStepUuidValueObject;
  readonly type: SagaLogTypeValueObject;
  readonly message: SagaLogMessageValueObject;

  constructor(props: ISagaLogCreateCommandDto) {
    this.id = new SagaLogUuidValueObject();
    this.sagaInstanceId = new SagaInstanceUuidValueObject(props.sagaInstanceId);
    this.sagaStepId = new SagaStepUuidValueObject(props.sagaStepId);
    this.type = new SagaLogTypeValueObject(props.type);
    this.message = new SagaLogMessageValueObject(props.message);
  }
}
