import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum.vo';

export class SubscriptionPlanCurrencyValueObject extends EnumValueObject<
  typeof SubscriptionPlanCurrencyEnum
> {
  protected get enumObject(): typeof SubscriptionPlanCurrencyEnum {
    return SubscriptionPlanCurrencyEnum;
  }
}
