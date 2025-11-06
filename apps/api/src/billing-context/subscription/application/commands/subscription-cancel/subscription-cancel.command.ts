import { ISubscriptionCancelCommandDto } from '@/billing-context/subscription/application/dtos/commands/subscription-cancel/subscription-cancel-command.dto';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';

export class SubscriptionCancelCommand {
  readonly id: SubscriptionUuidValueObject;

  constructor(props: ISubscriptionCancelCommandDto) {
    this.id = new SubscriptionUuidValueObject(props.id);
  }
}
