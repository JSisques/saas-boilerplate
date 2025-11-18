import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanWriteRepository } from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-write/subscription-plan-write.repository';
import { SubscriptionPlanPrismaMapper } from '@/billing-context/subscription-plan/infrastructure/database/prisma/mappers/subscription-plan-prisma.mapper';
import { BasePrismaRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/services/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubscriptionPlanPrismaRepository
  extends BasePrismaRepository
  implements SubscriptionPlanWriteRepository
{
  constructor(
    prisma: PrismaService,
    private readonly subscriptionPlanPrismaMapper: SubscriptionPlanPrismaMapper,
  ) {
    super(prisma);
    this.logger = new Logger(SubscriptionPlanPrismaRepository.name);
  }

  /**
   * Finds a subscription plan by their id
   *
   * @param id - The id of the subscription plan to find
   * @returns The subscription plan if found, null otherwise
   */
  async findById(id: string): Promise<SubscriptionPlanAggregate | null> {
    const subscriptionPlanData =
      await this.prismaService.subscriptionPlan.findUnique({
        where: { id },
      });

    if (!subscriptionPlanData) {
      return null;
    }

    return this.subscriptionPlanPrismaMapper.toDomainEntity({
      id: subscriptionPlanData.id,
      name: subscriptionPlanData.name,
      slug: subscriptionPlanData.slug,
      type: subscriptionPlanData.type,
      description: subscriptionPlanData.description,
      priceMonthly: subscriptionPlanData.priceMonthly.toNumber(),
      priceYearly: subscriptionPlanData.priceYearly.toNumber(),
      currency: subscriptionPlanData.currency,
      interval: subscriptionPlanData.interval,
      intervalCount: subscriptionPlanData.intervalCount,
      trialPeriodDays: subscriptionPlanData.trialPeriodDays,
      isActive: subscriptionPlanData.isActive,
      features: subscriptionPlanData.features as Record<string, any>,
      limits: subscriptionPlanData.limits as Record<string, any>,
      stripePriceId: subscriptionPlanData.stripePriceId,
    });
  }

  /**
   * Finds a subscription plan by their slug
   *
   * @param slug - The slug of the subscription plan to find
   * @returns The subscription plan if found, null otherwise
   */
  async findBySlug(slug: string): Promise<SubscriptionPlanAggregate | null> {
    const subscriptionPlanData =
      await this.prismaService.subscriptionPlan.findUnique({
        where: { slug },
      });

    if (!subscriptionPlanData) {
      return null;
    }

    return this.subscriptionPlanPrismaMapper.toDomainEntity({
      id: subscriptionPlanData.id,
      name: subscriptionPlanData.name,
      slug: subscriptionPlanData.slug,
      type: subscriptionPlanData.type,
      description: subscriptionPlanData.description,
      priceMonthly: subscriptionPlanData.priceMonthly.toNumber(),
      priceYearly: subscriptionPlanData.priceYearly.toNumber(),
      currency: subscriptionPlanData.currency,
      interval: subscriptionPlanData.interval,
      intervalCount: subscriptionPlanData.intervalCount,
      trialPeriodDays: subscriptionPlanData.trialPeriodDays,
      isActive: subscriptionPlanData.isActive,
      features: subscriptionPlanData.features as Record<string, any>,
      limits: subscriptionPlanData.limits as Record<string, any>,
      stripePriceId: subscriptionPlanData.stripePriceId,
    });
  }

  /**
   * Saves a subscription plan
   *
   * @param subscriptionPlan - The subscription plan to save
   * @returns The saved subscription plan
   */
  async save(
    subscriptionPlan: SubscriptionPlanAggregate,
  ): Promise<SubscriptionPlanAggregate> {
    const subscriptionPlanData =
      this.subscriptionPlanPrismaMapper.toPrismaData(subscriptionPlan);

    const result = await this.prismaService.subscriptionPlan.upsert({
      where: { id: subscriptionPlan.id.value },
      update: subscriptionPlanData,
      create: subscriptionPlanData,
    });

    return this.subscriptionPlanPrismaMapper.toDomainEntity({
      id: result.id,
      name: result.name,
      slug: result.slug,
      type: result.type,
      description: result.description,
      priceMonthly: result.priceMonthly.toNumber(),
      priceYearly: result.priceYearly.toNumber(),
      currency: result.currency,
      interval: result.interval,
      intervalCount: result.intervalCount,
      trialPeriodDays: result.trialPeriodDays,
      isActive: result.isActive,
      features: result.features as Record<string, any>,
      limits: result.limits as Record<string, any>,
      stripePriceId: result.stripePriceId,
    });
  }

  /**
   * Deletes a subscription plan
   *
   * @param subscriptionPlan - The subscription plan to delete
   * @returns True if the subscription plan was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting subscription plan by id: ${id}`);

    await this.prismaService.subscriptionPlan.delete({
      where: { id },
    });

    return true;
  }
}
