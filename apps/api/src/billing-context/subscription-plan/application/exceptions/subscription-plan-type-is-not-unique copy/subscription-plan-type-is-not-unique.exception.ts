import { SubscriptionPlanTypeEnum } from '@/prisma/master/client';
import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class SubscriptionPlanTypeIsAlreadyTakenException extends BaseApplicationException {
  constructor(type: SubscriptionPlanTypeEnum) {
    super(`Subscription plan type ${type} is already taken`);
  }
}
