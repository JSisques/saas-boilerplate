import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type/subscription-plan-type.enum';
import { SubscriptionPlanAggregateFactory } from '@/billing-context/subscription-plan/domain/factories/subscription-plan-aggregate/subscription-plan-aggregate.factory';
import { SubscriptionPlanTypeormEntity } from '@/billing-context/subscription-plan/infrastructure/database/typeorm/entities/subscription-plan-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubscriptionPlanTypeormMapper {
  private readonly logger = new Logger(SubscriptionPlanTypeormMapper.name);

  constructor(
    private readonly subscriptionPlanAggregateFactory: SubscriptionPlanAggregateFactory,
  ) {}

  /**
   * Converts a TypeORM entity to a subscription plan aggregate
   *
   * @param subscriptionPlanEntity - The TypeORM entity to convert
   * @returns The subscription plan aggregate
   */
  toDomainEntity(
    subscriptionPlanEntity: SubscriptionPlanTypeormEntity,
  ): SubscriptionPlanAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${subscriptionPlanEntity.id}`,
    );

    return this.subscriptionPlanAggregateFactory.fromPrimitives({
      id: subscriptionPlanEntity.id,
      name: subscriptionPlanEntity.name,
      slug: subscriptionPlanEntity.slug,
      type: subscriptionPlanEntity.type,
      description: subscriptionPlanEntity.description ?? null,
      priceMonthly: Number(subscriptionPlanEntity.priceMonthly),
      priceYearly: Number(subscriptionPlanEntity.priceYearly),
      currency: subscriptionPlanEntity.currency,
      interval: subscriptionPlanEntity.interval,
      intervalCount: subscriptionPlanEntity.intervalCount,
      trialPeriodDays: subscriptionPlanEntity.trialPeriodDays ?? null,
      isActive: subscriptionPlanEntity.isActive,
      features: subscriptionPlanEntity.features ?? null,
      limits: subscriptionPlanEntity.limits ?? null,
      stripePriceId: subscriptionPlanEntity.stripePriceId ?? null,
      createdAt: subscriptionPlanEntity.createdAt,
      updatedAt: subscriptionPlanEntity.updatedAt,
    });
  }

  /**
   * Converts a subscription plan aggregate to a TypeORM entity
   *
   * @param subscriptionPlan - The subscription plan aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(
    subscriptionPlan: SubscriptionPlanAggregate,
  ): SubscriptionPlanTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${subscriptionPlan.id.value} to TypeORM entity`,
    );

    const primitives = subscriptionPlan.toPrimitives();

    const entity = new SubscriptionPlanTypeormEntity();

    entity.id = primitives.id;
    entity.name = primitives.name;
    entity.slug = primitives.slug;
    entity.type = primitives.type as SubscriptionPlanTypeEnum;
    entity.description = primitives.description;
    entity.priceMonthly = primitives.priceMonthly;
    entity.priceYearly = primitives.priceYearly;
    entity.currency = primitives.currency as SubscriptionPlanCurrencyEnum;
    entity.interval = primitives.interval as SubscriptionPlanIntervalEnum;
    entity.intervalCount = primitives.intervalCount;
    entity.trialPeriodDays = primitives.trialPeriodDays;
    entity.isActive = primitives.isActive;
    entity.features = primitives.features;
    entity.limits = primitives.limits;
    entity.stripePriceId = primitives.stripePriceId;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
