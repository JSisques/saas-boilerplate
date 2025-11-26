import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class SubscriptionNotFoundException extends BaseApplicationException {
  constructor(subscriptionId: string) {
    super(`Subscription with id ${subscriptionId} not found`);
  }
}
