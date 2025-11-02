import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum.vo';

export class SubscriptionPlanIntervalValueObject extends EnumValueObject<
  typeof SubscriptionPlanIntervalEnum
> {
  protected get enumObject(): typeof SubscriptionPlanIntervalEnum {
    return SubscriptionPlanIntervalEnum;
  }
}
