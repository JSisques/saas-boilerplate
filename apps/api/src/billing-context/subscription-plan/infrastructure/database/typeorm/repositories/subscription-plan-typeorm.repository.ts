import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { SubscriptionPlanAggregate } from '@/billing-context/subscription-plan/domain/aggregates/subscription-plan.aggregate';
import { SubscriptionPlanTypeEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum';
import { SubscriptionPlanWriteRepository } from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-write/subscription-plan-write.repository';
import { SubscriptionPlanTypeormEntity } from '@/billing-context/subscription-plan/infrastructure/database/typeorm/entities/subscription-plan-typeorm.entity';
import { SubscriptionPlanTypeormMapper } from '@/billing-context/subscription-plan/infrastructure/database/typeorm/mappers/subscription-plan-typeorm.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubscriptionPlanTypeormRepository
  extends BaseTypeormMasterRepository<SubscriptionPlanTypeormEntity>
  implements SubscriptionPlanWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly subscriptionPlanTypeormMapper: SubscriptionPlanTypeormMapper,
  ) {
    super(typeormMasterService, SubscriptionPlanTypeormEntity);
    this.logger = new Logger(SubscriptionPlanTypeormRepository.name);
  }

  /**
   * Finds a subscription plan by their id
   *
   * @param id - The id of the subscription plan to find
   * @returns The subscription plan if found, null otherwise
   */
  async findById(id: string): Promise<SubscriptionPlanAggregate | null> {
    this.logger.log(`Finding subscription plan by id: ${id}`);
    const subscriptionPlanEntity = await this.repository.findOne({
      where: { id },
    });

    return subscriptionPlanEntity
      ? this.subscriptionPlanTypeormMapper.toDomainEntity(
          subscriptionPlanEntity,
        )
      : null;
  }

  /**
   * Finds a subscription plan by their slug
   *
   * @param slug - The slug of the subscription plan to find
   * @returns The subscription plan if found, null otherwise
   */
  async findBySlug(slug: string): Promise<SubscriptionPlanAggregate | null> {
    this.logger.log(`Finding subscription plan by slug: ${slug}`);
    const subscriptionPlanEntity = await this.repository.findOne({
      where: { slug },
    });

    return subscriptionPlanEntity
      ? this.subscriptionPlanTypeormMapper.toDomainEntity(
          subscriptionPlanEntity,
        )
      : null;
  }

  /**
   * Finds a subscription plan by their type
   *
   * @param type - The type of the subscription plan to find
   * @returns The subscription plan if found, null otherwise
   */
  async findByType(
    type: SubscriptionPlanTypeEnum,
  ): Promise<SubscriptionPlanAggregate | null> {
    this.logger.log(`Finding subscription plan by type: ${type}`);
    const subscriptionPlanEntity = await this.repository.findOne({
      where: { type },
    });

    return subscriptionPlanEntity
      ? this.subscriptionPlanTypeormMapper.toDomainEntity(
          subscriptionPlanEntity,
        )
      : null;
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
    this.logger.log(`Saving subscription plan: ${subscriptionPlan.id.value}`);
    const subscriptionPlanEntity =
      this.subscriptionPlanTypeormMapper.toTypeormEntity(subscriptionPlan);

    const savedEntity = await this.repository.save(subscriptionPlanEntity);

    return this.subscriptionPlanTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a subscription plan (soft delete)
   *
   * @param id - The id of the subscription plan to delete
   * @returns True if the subscription plan was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Soft deleting subscription plan by id: ${id}`);

    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && result.affected > 0;
  }
}
