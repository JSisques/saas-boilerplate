import { ISagaStepChangeStatusCommandDto } from '@/saga-context/saga-step/application/dtos/commands/saga-step-change-status/saga-step-change-status-command.dto';
import { SagaStepStatusValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-status/saga-step-status.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

export class SagaStepChangeStatusCommand {
  readonly id: SagaStepUuidValueObject;
  readonly status: SagaStepStatusValueObject;

  constructor(props: ISagaStepChangeStatusCommandDto) {
    this.id = new SagaStepUuidValueObject(props.id);
    this.status = new SagaStepStatusValueObject(props.status);
  }
}
