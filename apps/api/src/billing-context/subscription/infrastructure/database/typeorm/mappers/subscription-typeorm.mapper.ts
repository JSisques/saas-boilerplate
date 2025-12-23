import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';
import { SubscriptionRenewalMethodEnum } from '@/billing-context/subscription/domain/enum/subscription-renewal-method.enum';
import { SubscriptionStatusEnum } from '@/billing-context/subscription/domain/enum/subscription-status.enum';
import { SubscriptionAggregateFactory } from '@/billing-context/subscription/domain/factories/subscription-aggregate/subscription-aggregate.factory';
import { SubscriptionTypeormEntity } from '@/billing-context/subscription/infrastructure/database/typeorm/entities/subscription-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubscriptionTypeormMapper {
  private readonly logger = new Logger(SubscriptionTypeormMapper.name);

  constructor(
    private readonly subscriptionAggregateFactory: SubscriptionAggregateFactory,
  ) {}

  /**
   * Converts a TypeORM entity to a subscription aggregate
   *
   * @param subscriptionEntity - The TypeORM entity to convert
   * @returns The subscription aggregate
   */
  toDomainEntity(
    subscriptionEntity: SubscriptionTypeormEntity,
  ): SubscriptionAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${subscriptionEntity.id}`,
    );

    return this.subscriptionAggregateFactory.fromPrimitives({
      id: subscriptionEntity.id,
      tenantId: subscriptionEntity.tenantId,
      planId: subscriptionEntity.planId,
      startDate: subscriptionEntity.startDate,
      endDate: subscriptionEntity.endDate,
      trialEndDate: subscriptionEntity.trialEndDate ?? null,
      status: subscriptionEntity.status,
      stripeSubscriptionId: subscriptionEntity.stripeSubscriptionId ?? null,
      stripeCustomerId: subscriptionEntity.stripeCustomerId ?? null,
      renewalMethod: subscriptionEntity.renewalMethod,
      createdAt: subscriptionEntity.createdAt,
      updatedAt: subscriptionEntity.updatedAt,
    });
  }

  /**
   * Converts a subscription aggregate to a TypeORM entity
   *
   * @param subscription - The subscription aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(
    subscription: SubscriptionAggregate,
  ): SubscriptionTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${subscription.id.value} to TypeORM entity`,
    );

    const primitives = subscription.toPrimitives();

    const entity = new SubscriptionTypeormEntity();

    entity.id = primitives.id;
    entity.tenantId = primitives.tenantId;
    entity.planId = primitives.planId;
    entity.startDate = primitives.startDate;
    entity.endDate = primitives.endDate;
    entity.trialEndDate = primitives.trialEndDate;
    entity.status = primitives.status as SubscriptionStatusEnum;
    entity.stripeSubscriptionId = primitives.stripeSubscriptionId;
    entity.stripeCustomerId = primitives.stripeCustomerId;
    entity.renewalMethod =
      primitives.renewalMethod as SubscriptionRenewalMethodEnum;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
