import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';
import { SubscriptionAggregateFactory } from '@/billing-context/subscription/domain/factories/subscription-aggregate/subscription-aggregate.factory';
import { SubscriptionPrismaDto } from '@/billing-context/subscription/infrastructure/database/prisma/dtos/subscription-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';
import { RenewalMethodEnum, SubscriptionStatusEnum } from '@prisma/client';

@Injectable()
export class SubscriptionPrismaMapper {
  private readonly logger = new Logger(SubscriptionPrismaMapper.name);

  constructor(
    private readonly subscriptionAggregateFactory: SubscriptionAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a subscription aggregate
   *
   * @param subscriptionData - The Prisma data to convert
   * @returns The subscription aggregate
   */
  public toDomainEntity(
    subscriptionData: SubscriptionPrismaDto,
  ): SubscriptionAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${subscriptionData.id}`,
    );

    return this.subscriptionAggregateFactory.fromPrimitives({
      id: subscriptionData.id,
      tenantId: subscriptionData.tenantId,
      planId: subscriptionData.planId,
      startDate: subscriptionData.startDate,
      endDate: subscriptionData.endDate,
      trialEndDate: subscriptionData.trialEndDate,
      status: subscriptionData.status,
      stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
      stripeCustomerId: subscriptionData.stripeCustomerId,
      renewalMethod: subscriptionData.renewalMethod,
      createdAt: subscriptionData.createdAt,
      updatedAt: subscriptionData.updatedAt,
    });
  }

  /**
   * Converts a subscription aggregate to a Prisma data
   *
   * @param subscription - The subscription aggregate to convert
   * @returns The Prisma data
   */
  public toPrismaData(
    subscription: SubscriptionAggregate,
  ): SubscriptionPrismaDto {
    this.logger.log(
      `Converting domain entity with id ${subscription.id.value} to Prisma data`,
    );

    // Get primitives from aggregate
    const primitives = subscription.toPrimitives();

    return {
      id: primitives.id,
      tenantId: primitives.tenantId,
      planId: primitives.planId,
      startDate: primitives.startDate,
      endDate: primitives.endDate,
      trialEndDate: primitives.trialEndDate,
      status: primitives.status as SubscriptionStatusEnum,
      stripeSubscriptionId: primitives.stripeSubscriptionId,
      stripeCustomerId: primitives.stripeCustomerId,
      renewalMethod: primitives.renewalMethod as RenewalMethodEnum,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
