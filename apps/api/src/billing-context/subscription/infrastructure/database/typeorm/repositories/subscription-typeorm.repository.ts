import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { SubscriptionAggregate } from '@/billing-context/subscription/domain/aggregates/subscription.aggregate';
import { SubscriptionWriteRepository } from '@/billing-context/subscription/domain/repositories/subscription-write/subscription-write.repository';
import { SubscriptionTypeormEntity } from '@/billing-context/subscription/infrastructure/database/typeorm/entities/subscription-typeorm.entity';
import { SubscriptionTypeormMapper } from '@/billing-context/subscription/infrastructure/database/typeorm/mappers/subscription-typeorm.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubscriptionTypeormRepository
  extends BaseTypeormMasterRepository<SubscriptionTypeormEntity>
  implements SubscriptionWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly subscriptionTypeormMapper: SubscriptionTypeormMapper,
  ) {
    super(typeormMasterService, SubscriptionTypeormEntity);
    this.logger = new Logger(SubscriptionTypeormRepository.name);
  }

  /**
   * Finds a subscription by their id
   *
   * @param id - The id of the subscription to find
   * @returns The subscription if found, null otherwise
   */
  async findById(id: string): Promise<SubscriptionAggregate | null> {
    this.logger.log(`Finding subscription by id: ${id}`);
    const subscriptionEntity = await this.repository.findOne({
      where: { id },
    });

    return subscriptionEntity
      ? this.subscriptionTypeormMapper.toDomainEntity(subscriptionEntity)
      : null;
  }

  /**
   * Finds a subscription by their tenant id
   *
   * @param tenantId - The id of the tenant to find subscriptions by
   * @returns The subscription if found, null otherwise
   */
  async findByTenantId(
    tenantId: string,
  ): Promise<SubscriptionAggregate | null> {
    this.logger.log(`Finding subscription by tenant id: ${tenantId}`);
    const subscriptionEntity = await this.repository.findOne({
      where: { tenantId },
    });

    return subscriptionEntity
      ? this.subscriptionTypeormMapper.toDomainEntity(subscriptionEntity)
      : null;
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
    this.logger.log(`Saving subscription: ${subscription.id.value}`);
    const subscriptionEntity =
      this.subscriptionTypeormMapper.toTypeormEntity(subscription);

    const savedEntity = await this.repository.save(subscriptionEntity);

    return this.subscriptionTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a subscription (soft delete)
   *
   * @param id - The id of the subscription to delete
   * @returns True if the subscription was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Soft deleting subscription by id: ${id}`);

    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && result.affected > 0;
  }
}
