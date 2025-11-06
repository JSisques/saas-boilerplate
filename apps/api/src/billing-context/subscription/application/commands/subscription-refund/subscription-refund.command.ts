import { ISubscriptionRefundCommandDto } from '@/billing-context/subscription/application/dtos/commands/subscription-refund/subscription-refund-command.dto';
import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';

export class SubscriptionRefundCommand {
  readonly id: SubscriptionUuidValueObject;

  constructor(props: ISubscriptionRefundCommandDto) {
    this.id = new SubscriptionUuidValueObject(props.id);
  }
}
