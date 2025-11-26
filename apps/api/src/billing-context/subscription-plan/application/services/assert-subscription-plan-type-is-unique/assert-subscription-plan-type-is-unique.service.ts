import { SubscriptionPlanTypeIsAlreadyTakenException } from '@/billing-context/subscription-plan/application/exceptions/subscription-plan-type-is-not-unique copy/subscription-plan-type-is-not-unique.exception';
import {
  SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN,
  SubscriptionPlanWriteRepository,
} from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-write/subscription-plan-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SubscriptionPlanTypeEnum } from '@prisma/client';

@Injectable()
export class AssertSubscriptionPlanTypeIsUniqueService
  implements IBaseService<SubscriptionPlanTypeEnum, void>
{
  private readonly logger = new Logger(
    AssertSubscriptionPlanTypeIsUniqueService.name,
  );

  constructor(
    @Inject(SUBSCRIPTION_PLAN_WRITE_REPOSITORY_TOKEN)
    private readonly subscriptionPlanWriteRepository: SubscriptionPlanWriteRepository,
  ) {}

  async execute(type: SubscriptionPlanTypeEnum): Promise<void> {
    this.logger.log(
      `Asserting subscription plan type is unique by type: ${type}`,
    );

    // 01: Find the subscription plan by slug
    const existingSubscriptionPlan =
      await this.subscriptionPlanWriteRepository.findByType(type);

    // 02: If the subscription plan type exists, throw an error
    if (existingSubscriptionPlan) {
      this.logger.error(`Subscription plan type ${type} is already taken`);
      throw new SubscriptionPlanTypeIsAlreadyTakenException(type);
    }
  }
}
