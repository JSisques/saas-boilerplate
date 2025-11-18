import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class SubscriptionPlanSlugIsAlreadyTakenException extends BaseApplicationException {
  constructor(slug: string) {
    super(`Subscription plan slug ${slug} is already taken`);
  }
}
