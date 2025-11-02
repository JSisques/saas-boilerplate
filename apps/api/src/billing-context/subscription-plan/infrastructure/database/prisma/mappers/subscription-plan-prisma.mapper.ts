import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanAggregateFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-aggregate/subscription-plan-aggregate.factory';
import { SubscriptionPlanPrismaDto } from '@/billing-context/subscription-plan/infrastructure/database/prisma/dtos/subscription-plan-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';
import {
  CurrencyEnum,
  SubscriptionPlanIntervalEnum,
  SubscriptionPlanTypeEnum,
} from '@prisma/client';

@Injectable()
export class SubscriptionPlanPrismaMapper {
  private readonly logger = new Logger(SubscriptionPlanPrismaMapper.name);

  constructor(
    private readonly subscriptionPlanAggregateFactory: SubscriptionPlanAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a subscription plan aggregate
   *
   * @param subscriptionPlanData - The Prisma data to convert
   * @returns The subscription plan aggregate
   */
  public toDomainEntity(
    subscriptionPlanData: SubscriptionPlanPrismaDto,
  ): SubscriptionPlanAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${subscriptionPlanData.id}`,
    );

    return this.subscriptionPlanAggregateFactory.fromPrimitives({
      id: subscriptionPlanData.id,
      name: subscriptionPlanData.name,
      slug: subscriptionPlanData.slug,
      type: subscriptionPlanData.type,
      description: subscriptionPlanData.description,
      priceMonthly: subscriptionPlanData.priceMonthly,
      priceYearly: subscriptionPlanData.priceYearly,
      currency: subscriptionPlanData.currency,
      interval: subscriptionPlanData.interval,
      intervalCount: subscriptionPlanData.intervalCount,
      trialPeriodDays: subscriptionPlanData.trialPeriodDays,
      isActive: subscriptionPlanData.isActive,
      features: subscriptionPlanData.features,
      limits: subscriptionPlanData.limits,
      stripePriceId: subscriptionPlanData.stripePriceId,
    });
  }

  /**
   * Converts a tenant member aggregate to a Prisma data
   *
   * @param subscriptionPlan - The subscription plan aggregate to convert
   * @returns The Prisma data
   */
  public toPrismaData(
    subscriptionPlan: SubscriptionPlanAggregate,
  ): SubscriptionPlanPrismaDto {
    this.logger.log(
      `Converting domain entity with id ${subscriptionPlan.id.value} to Prisma data`,
    );

    // Get primitives from aggregate
    const primitives = subscriptionPlan.toPrimitives();

    return {
      id: primitives.id,
      name: primitives.name,
      slug: primitives.slug,
      type: primitives.type as SubscriptionPlanTypeEnum,
      description: primitives.description,
      priceMonthly: primitives.priceMonthly,
      priceYearly: primitives.priceYearly,
      currency: primitives.currency as CurrencyEnum,
      interval: primitives.interval as SubscriptionPlanIntervalEnum,
      intervalCount: primitives.intervalCount,
      trialPeriodDays: primitives.trialPeriodDays,
      isActive: primitives.isActive,
      features: primitives.features,
      limits: primitives.limits,
      stripePriceId: primitives.stripePriceId,
    };
  }
}
