import { ISubscriptionDeleteCommandDto } from '@/billing-context/subscription/application/dtos/commands/subscription-delete/subscription-delete-command.dto';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';

export class SubscriptionDeleteCommand {
  readonly id: SubscriptionUuidValueObject;

  constructor(props: ISubscriptionDeleteCommandDto) {
    this.id = new SubscriptionUuidValueObject(props.id);
  }
}
