import { SubscriptionPlanReadRepository } from '@/billing-context/subscription-plan/domain/repositories/subscription-plan-read/subscription-plan-read.repository';
import { SubscriptionPlanViewModel } from '@/billing-context/subscription-plan/domain/view-models/subscription-plan.view-model';
import { SubscriptionPlanMongoDBMapper } from '@/billing-context/subscription-plan/infrastructure/database/mongodb/mappers/subscription-plan-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubscriptionPlanMongoRepository
  extends BaseMongoMasterRepository
  implements SubscriptionPlanReadRepository
{
  private readonly collectionName = 'subscription-plans';

  constructor(
    mongoMasterService: MongoMasterService,
    private readonly subscriptionPlanMongoDBMapper: SubscriptionPlanMongoDBMapper,
  ) {
    super(mongoMasterService);
    this.logger = new Logger(SubscriptionPlanMongoRepository.name);
  }

  /**
   * Finds a subscription plan by id
   *
   * @param id - The id of the subscription plan to find
   * @returns The subscription plan if found, null otherwise
   */
  async findById(id: string): Promise<SubscriptionPlanViewModel | null> {
    this.logger.log(`Finding subscription plan by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const subscriptionPlanViewModel = await collection.findOne({ id });

    return subscriptionPlanViewModel
      ? this.subscriptionPlanMongoDBMapper.toViewModel({
          id: subscriptionPlanViewModel.id,
          name: subscriptionPlanViewModel.name,
          slug: subscriptionPlanViewModel.slug,
          type: subscriptionPlanViewModel.type,
          description: subscriptionPlanViewModel.description,
          priceMonthly: subscriptionPlanViewModel.priceMonthly,
          priceYearly: subscriptionPlanViewModel.priceYearly,
          currency: subscriptionPlanViewModel.currency,
          interval: subscriptionPlanViewModel.interval,
          intervalCount: subscriptionPlanViewModel.intervalCount,
          trialPeriodDays: subscriptionPlanViewModel.trialPeriodDays,
          isActive: subscriptionPlanViewModel.isActive,
          features: subscriptionPlanViewModel.features,
          limits: subscriptionPlanViewModel.limits,
          stripePriceId: subscriptionPlanViewModel.stripePriceId,
          createdAt: subscriptionPlanViewModel.createdAt,
          updatedAt: subscriptionPlanViewModel.updatedAt,
        })
      : null;
  }

  /**
   * Finds subscription plans by tenant id
   *
   * @param tenantId - The id of the tenant to find subscription plans by
   * @returns The subscription plans found
   */
  async findByTenantId(
    tenantId: string,
  ): Promise<SubscriptionPlanViewModel[] | null> {
    this.logger.log(`Finding subscription plans by tenant id: ${tenantId}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const subscriptionPlans = await collection.find({ tenantId }).toArray();

    return subscriptionPlans.map((doc) =>
      this.subscriptionPlanMongoDBMapper.toViewModel({
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        type: doc.type,
        description: doc.description,
        priceMonthly: doc.priceMonthly,
        priceYearly: doc.priceYearly,
        currency: doc.currency,
        interval: doc.interval,
        intervalCount: doc.intervalCount,
        trialPeriodDays: doc.trialPeriodDays,
        isActive: doc.isActive,
        features: doc.features,
        limits: doc.limits,
        stripePriceId: doc.stripePriceId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );
  }
  /**
   * Finds subscription plans by user id
   *
   * @param userId - The id of the user to find subscription plans by
   * @returns The subscription plans found
   */
  async findByUserId(
    userId: string,
  ): Promise<SubscriptionPlanViewModel[] | null> {
    this.logger.log(`Finding subscription plans by user id: ${userId}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const subscriptionPlans = await collection.find({ userId }).toArray();

    return subscriptionPlans.map((doc) =>
      this.subscriptionPlanMongoDBMapper.toViewModel({
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        type: doc.type,
        description: doc.description,
        priceMonthly: doc.priceMonthly,
        priceYearly: doc.priceYearly,
        currency: doc.currency,
        interval: doc.interval,
        intervalCount: doc.intervalCount,
        trialPeriodDays: doc.trialPeriodDays,
        isActive: doc.isActive,
        features: doc.features,
        limits: doc.limits,
        stripePriceId: doc.stripePriceId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );
  }

  /**
   * Finds subscription plans by criteria
   *
   * @param criteria - The criteria to find subscription plans by
   * @returns The subscription plans found
   */

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<SubscriptionPlanViewModel>> {
    this.logger.log(
      `Finding subscription plans by criteria: ${JSON.stringify(criteria)}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Build MongoDB query from criteria
    const mongoQuery = this.buildMongoQuery(criteria);
    const sortQuery = this.buildSortQuery(criteria);

    // 02: Calculate pagination
    const { page, limit, skip } = await this.calculatePagination(criteria);

    // 03: Execute query with pagination
    const [data, total] = await Promise.all([
      collection
        .find(mongoQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(mongoQuery),
    ]);

    // 04: Convert MongoDB documents to domain entities
    const subscriptionPlans = data.map((doc) =>
      this.subscriptionPlanMongoDBMapper.toViewModel({
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        type: doc.type,
        description: doc.description,
        priceMonthly: doc.priceMonthly,
        priceYearly: doc.priceYearly,
        currency: doc.currency,
        interval: doc.interval,
        intervalCount: doc.intervalCount,
        trialPeriodDays: doc.trialPeriodDays,
        isActive: doc.isActive,
        features: doc.features,
        limits: doc.limits,
        stripePriceId: doc.stripePriceId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<SubscriptionPlanViewModel>(
      subscriptionPlans,
      total,
      page,
      limit,
    );
  }

  /**
   * Saves a subscription plan view model (upsert operation)
   *
   * @param subscriptionPlanViewModel - The subscription plan view model to save
   */
  async save(
    subscriptionPlanViewModel: SubscriptionPlanViewModel,
  ): Promise<void> {
    this.logger.log(
      `Saving subscription plan view model with id: ${subscriptionPlanViewModel.id}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const mongoData = this.subscriptionPlanMongoDBMapper.toMongoData(
      subscriptionPlanViewModel,
    );

    // 01: Use upsert to either insert or update the subscription plan view model
    await collection.replaceOne(
      { id: subscriptionPlanViewModel.id },
      mongoData,
      {
        upsert: true,
      },
    );
  }

  /**
   * Deletes a subscription plan view model by id
   *
   * @param id - The id of the subscription plan view model to delete
   * @returns True if the subscription plan was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting subscription plan view model by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Delete the subscription plan view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
