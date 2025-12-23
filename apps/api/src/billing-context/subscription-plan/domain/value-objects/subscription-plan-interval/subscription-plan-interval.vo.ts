import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval/subscription-plan-interval.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

export class SubscriptionPlanIntervalValueObject extends EnumValueObject<
  typeof SubscriptionPlanIntervalEnum
> {
  protected get enumObject(): typeof SubscriptionPlanIntervalEnum {
    return SubscriptionPlanIntervalEnum;
  }
}
