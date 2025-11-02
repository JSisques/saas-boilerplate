import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import {
  PaginatedSubscriptionPlanResultDto,
  SubscriptionPlanResponseDto,
} from '@/billing-context/subscription-plan/transport/graphql/dtos/responses/subscription-plan.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubscriptionPlanGraphQLMapper {
  private readonly logger = new Logger(SubscriptionPlanGraphQLMapper.name);

  toResponseDto(
    subscriptionPlan: SubscriptionPlanViewModel,
  ): SubscriptionPlanResponseDto {
    this.logger.log(
      `Mapping subscription plan view model to response dto: ${subscriptionPlan.id}`,
    );
    return {
      id: subscriptionPlan.id,
      name: subscriptionPlan.name,
      slug: subscriptionPlan.slug,
      type: subscriptionPlan.type,
      description: subscriptionPlan.description,
      priceMonthly: subscriptionPlan.priceMonthly,
      priceYearly: subscriptionPlan.priceYearly,
      currency: subscriptionPlan.currency,
      interval: subscriptionPlan.interval,
      intervalCount: subscriptionPlan.intervalCount,
      trialPeriodDays: subscriptionPlan.trialPeriodDays,
      isActive: subscriptionPlan.isActive,
      features: subscriptionPlan.features,
      limits: subscriptionPlan.limits,
      stripePriceId: subscriptionPlan.stripePriceId,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<SubscriptionPlanViewModel>,
  ): PaginatedSubscriptionPlanResultDto {
    return {
      items: paginatedResult.items.map((subscriptionPlan) =>
        this.toResponseDto(subscriptionPlan),
      ),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
