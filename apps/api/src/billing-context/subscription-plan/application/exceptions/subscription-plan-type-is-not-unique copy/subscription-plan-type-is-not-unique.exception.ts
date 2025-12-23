import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class SubscriptionPlanTypeIsAlreadyTakenException extends BaseApplicationException {
  constructor(type: SubscriptionPlanTypeEnum) {
    super(`Subscription plan type ${type} is already taken`);
  }
}
