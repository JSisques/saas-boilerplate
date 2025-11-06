import { ISubscriptionDeactivateCommandDto } from '@/billing-context/subscription/application/dtos/commands/subscription-deactivate/subscription-deactivate-command.dto';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';

export class SubscriptionDeactivateCommand {
  readonly id: SubscriptionUuidValueObject;

  constructor(props: ISubscriptionDeactivateCommandDto) {
    this.id = new SubscriptionUuidValueObject(props.id);
  }
}
