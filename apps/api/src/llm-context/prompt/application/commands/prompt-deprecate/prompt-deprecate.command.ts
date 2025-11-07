import { ISubscriptionRefundCommandDto } from '@/billing-context/subscription/application/dtos/commands/subscription-refund/subscription-refund-command.dto';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';

export class PromptDeprecateCommand {
  readonly id: PromptUuidValueObject;

  constructor(props: ISubscriptionRefundCommandDto) {
    this.id = new PromptUuidValueObject(props.id);
  }
}
