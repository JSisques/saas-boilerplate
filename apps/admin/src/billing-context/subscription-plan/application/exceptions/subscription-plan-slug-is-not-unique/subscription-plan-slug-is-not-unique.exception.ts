import { BaseApplicationException } from "@repo/shared/application/exceptions/base-application.exception";

export class SubscriptionPlanSlugIsNotUniqueException extends BaseApplicationException {
  constructor(slug: string) {
    super(`Subscription plan slug ${slug} is not unique`);
  }
}
