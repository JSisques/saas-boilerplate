import { BaseApplicationException } from '@/shared/application/exceptions/base-application.exception';

export class SubscriptionPlanNotFoundException extends BaseApplicationException {
  constructor(subscriptionPlanId: string) {
    super(`Subscription plan with id ${subscriptionPlanId} not found`);
  }
}
