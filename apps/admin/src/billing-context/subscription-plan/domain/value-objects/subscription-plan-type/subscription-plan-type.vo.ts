import { SubscriptionPlanTypeEnum } from "@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum";
import { EnumValueObject } from "@repo/shared/domain/value-objects/enum.vo";

export class SubscriptionPlanTypeValueObject extends EnumValueObject<
  typeof SubscriptionPlanTypeEnum
> {
  protected get enumObject(): typeof SubscriptionPlanTypeEnum {
    return SubscriptionPlanTypeEnum;
  }
}
