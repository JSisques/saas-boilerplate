import { SubscriptionPlanSlugIsAlreadyTakenException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-slug-is-not-unique/subscription-plan-slug-is-not-unique.exception';
import {
  SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN,
  SubscriptionPlanWriteRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-write/subscription-plan-write.repository';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSubscriptionPlanSlugIsUniqueService
  implements IBaseService<string, void>
{
  private readonly logger = new Logger(
    AssertSubscriptionPlanSlugIsUniqueService.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionPlanWriteRepository: SubscriptionPlanWriteRepository,
  ) {}

  async execute(slug: string): Promise<void> {
    this.logger.log(
      `Asserting subscription plan slug is unique by slug: ${slug}`,
    );

    // 01: Find the subscription plan by slug
    const existingSubscriptionPlan =
      await this.subscriptionPlanWriteRepository.findBySlug(slug);

    // 02: If the subscription plan slug exists, throw an error
    if (existingSubscriptionPlan) {
      this.logger.error(`Subscription plan slug ${slug} is already taken`);
      throw new SubscriptionPlanSlugIsAlreadyTakenException(slug);
    }
  }
}
