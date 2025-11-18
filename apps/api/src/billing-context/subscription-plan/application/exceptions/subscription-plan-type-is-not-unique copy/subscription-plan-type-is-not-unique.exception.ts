import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';
import { SubscriptionPlanTypeEnum } from '@prisma/client';

export class SubscriptionPlanTypeIsAlreadyTakenException extends BaseApplicationException {
  constructor(type: SubscriptionPlanTypeEnum) {
    super(`Subscription plan type ${type} is already taken`);
  }
}
