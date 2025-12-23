import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

export class SubscriptionPlanTypeValueObject extends EnumValueObject<
  typeof SubscriptionPlanTypeEnum
> {
  protected get enumObject(): typeof SubscriptionPlanTypeEnum {
    return SubscriptionPlanTypeEnum;
  }
}
