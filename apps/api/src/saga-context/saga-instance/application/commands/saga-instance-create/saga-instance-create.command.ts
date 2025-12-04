import { ISagaInstanceCreateCommandDto } from '@/saga-context/saga-instance/application/dtos/commands/saga-instance-create/saga-instance-create-command.dto';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceEndDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-end-date/saga-instance-end-date.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStartDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-start-date/saga-instance-start-date.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

export class SagaInstanceCreateCommand {
  readonly id: SagaInstanceUuidValueObject;
  readonly name: SagaInstanceNameValueObject;
  readonly status: SagaInstanceStatusValueObject;
  readonly startDate: SagaInstanceStartDateValueObject | null;
  readonly endDate: SagaInstanceEndDateValueObject | null;

  constructor(props: ISagaInstanceCreateCommandDto) {
    this.id = new SagaInstanceUuidValueObject();
    this.name = new SagaInstanceNameValueObject(props.name);
    this.status = new SagaInstanceStatusValueObject(
      SagaInstanceStatusEnum.PENDING,
    );
    this.startDate = null;
    this.endDate = null;
  }
}
