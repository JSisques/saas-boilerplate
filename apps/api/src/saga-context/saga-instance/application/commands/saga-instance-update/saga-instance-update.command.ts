import { ISagaInstanceUpdateCommandDto } from '@/saga-context/saga-instance/application/dtos/commands/saga-instance-update/saga-instance-update-command.dto';
import { SagaInstanceEndDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-end-date/saga-instance-end-date.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStartDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-start-date/saga-instance-start-date.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

export class SagaInstanceUpdateCommand {
  readonly id: SagaInstanceUuidValueObject;
  readonly name?: SagaInstanceNameValueObject;
  readonly status?: SagaInstanceStatusValueObject;
  readonly startDate?: SagaInstanceStartDateValueObject | null;
  readonly endDate?: SagaInstanceEndDateValueObject | null;

  constructor(props: ISagaInstanceUpdateCommandDto) {
    this.id = new SagaInstanceUuidValueObject(props.id);

    if (props.name !== undefined) {
      this.name = new SagaInstanceNameValueObject(props.name);
    }
    if (props.status !== undefined) {
      this.status = new SagaInstanceStatusValueObject(props.status);
    }
    if (props.startDate !== undefined) {
      this.startDate = props.startDate
        ? new SagaInstanceStartDateValueObject(props.startDate)
        : null;
    }
    if (props.endDate !== undefined) {
      this.endDate = props.endDate
        ? new SagaInstanceEndDateValueObject(props.endDate)
        : null;
    }
  }
}
