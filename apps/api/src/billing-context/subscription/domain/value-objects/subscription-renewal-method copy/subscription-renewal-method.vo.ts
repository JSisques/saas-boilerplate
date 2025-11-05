import { SubscriptionRenewalMethodEnum } from '@/billing-context/subscription/domain/enum/subscription-renewal-method.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum.vo';

export class SubscriptionRenewalMethodValueObject extends EnumValueObject<
  typeof SubscriptionRenewalMethodEnum
> {
  protected get enumObject(): typeof SubscriptionRenewalMethodEnum {
    return SubscriptionRenewalMethodEnum;
  }
}
