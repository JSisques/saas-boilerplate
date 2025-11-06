import { ISubscriptionActivateCommandDto } from '@/billing-context/subscription/application/dtos/commands/subscription-activate/subscription-activate-command.dto';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';

export class SubscriptionActivateCommand {
  readonly id: SubscriptionUuidValueObject;

  constructor(props: ISubscriptionActivateCommandDto) {
    this.id = new SubscriptionUuidValueObject(props.id);
  }
}
