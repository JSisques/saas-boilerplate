import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';
import { SubscriptionWriteRepository } from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { SubscriptionPrismaMapper } from '@/billing-context/subscription/infrastructure/database/prisma/mappers/subscription-prisma.mapper';
import { BasePrismaMasterRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-master/base-prisma-master.repository';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubscriptionPrismaRepository
  extends BasePrismaMasterRepository
  implements SubscriptionWriteRepository
{
  constructor(
    prismaMasterService: PrismaMasterService,
    private readonly subscriptionPrismaMapper: SubscriptionPrismaMapper,
  ) {
    super(prismaMasterService);
    this.logger = new Logger(SubscriptionPrismaRepository.name);
  }

  /**
   * Finds a subscription by their id
   *
   * @param id - The id of the subscription to find
   * @returns The subscription if found, null otherwise
   */
  async findById(id: string): Promise<SubscriptionAggregate | null> {
    const subscriptionData =
      await this.prismaMasterService.subscription.findUnique({
        where: { id },
      });

    if (!subscriptionData) {
      return null;
    }

    return this.subscriptionPrismaMapper.toDomainEntity({
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
   *   Finds a subscription by their tenant id
   *
   * @param tenantId - The id of the tenant to find subscriptions by
   * @returns The subscriptions if found, null otherwise
   */
  async findByTenantId(
    tenantId: string,
  ): Promise<SubscriptionAggregate | null> {
    const subscriptionData =
      await this.prismaMasterService.subscription.findUnique({
        where: { tenantId },
      });

    if (!subscriptionData) {
      return null;
    }

    return this.subscriptionPrismaMapper.toDomainEntity({
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
   * Saves a subscription
   *
   * @param subscription - The subscription to save
   * @returns The saved subscription
   */
  async save(
    subscription: SubscriptionAggregate,
  ): Promise<SubscriptionAggregate> {
    const subscriptionData =
      this.subscriptionPrismaMapper.toPrismaData(subscription);

    const result = await this.prismaMasterService.subscription.upsert({
      where: { id: subscription.id.value },
      update: subscriptionData,
      create: subscriptionData,
    });

    return this.subscriptionPrismaMapper.toDomainEntity({
      id: result.id,
      tenantId: result.tenantId,
      planId: result.planId,
      startDate: result.startDate,
      endDate: result.endDate,
      trialEndDate: result.trialEndDate,
      status: result.status,
      stripeSubscriptionId: result.stripeSubscriptionId,
      stripeCustomerId: result.stripeCustomerId,
      renewalMethod: result.renewalMethod,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }

  /**
   * Deletes a subscription
   *
   * @param subscription - The subscription to delete
   * @returns True if the subscription was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting subscription by id: ${id}`);

    await this.prismaMasterService.subscription.delete({
      where: { id },
    });

    return true;
  }
}
