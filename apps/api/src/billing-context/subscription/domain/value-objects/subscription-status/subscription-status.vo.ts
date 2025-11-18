import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

export class SubscriptionStatusValueObject extends EnumValueObject<
  typeof SubscriptionStatusEnum
> {
  protected get enumObject(): typeof SubscriptionStatusEnum {
    return SubscriptionStatusEnum;
  }
}
