import { ISagaStepDeleteCommandDto } from '@/saga-context/saga-step/application/dtos/commands/saga-step-delete/saga-step-delete-command.dto';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

export class SagaStepDeleteCommand {
  readonly id: SagaStepUuidValueObject;

  constructor(props: ISagaStepDeleteCommandDto) {
    this.id = new SagaStepUuidValueObject(props.id);
  }
}
