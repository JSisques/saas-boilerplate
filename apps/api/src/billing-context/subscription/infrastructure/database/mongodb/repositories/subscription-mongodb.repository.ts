import { SubscriptionReadRepository } from '@/billing-context/subscription/domain/repositories/subscription-read/subscription-read.repository';
import { SubscriptionViewModel } from '@/billing-context/subscription/domain/view-models/subscription.view-model';
import { SubscriptionMongoDBMapper } from '@/billing-context/subscription/infrastructure/database/mongodb/mappers/subscription-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubscriptionMongoRepository
  extends BaseMongoMasterRepository
  implements SubscriptionReadRepository
{
  private readonly collectionName = 'subscriptions';

  constructor(
    mongoMasterService: MongoMasterService,
    private readonly subscriptionMongoDBMapper: SubscriptionMongoDBMapper,
  ) {
    super(mongoMasterService);
    this.logger = new Logger(SubscriptionMongoRepository.name);
  }

  /**
   * Finds a subscription by id
   *
   * @param id - The id of the subscription to find
   * @returns The subscription if found, null otherwise
   */
  async findById(id: string): Promise<SubscriptionViewModel | null> {
    this.logger.log(`Finding subscription by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const subscriptionViewModel = await collection.findOne({ id });

    return subscriptionViewModel
      ? this.subscriptionMongoDBMapper.toViewModel({
          id: subscriptionViewModel.id,
          tenantId: subscriptionViewModel.tenantId,
          planId: subscriptionViewModel.planId,
          startDate: subscriptionViewModel.startDate,
          endDate: subscriptionViewModel.endDate,
          trialEndDate: subscriptionViewModel.trialEndDate,
          status: subscriptionViewModel.status,
          stripeSubscriptionId: subscriptionViewModel.stripeSubscriptionId,
          stripeCustomerId: subscriptionViewModel.stripeCustomerId,
          renewalMethod: subscriptionViewModel.renewalMethod,
          createdAt: subscriptionViewModel.createdAt,
          updatedAt: subscriptionViewModel.updatedAt,
        })
      : null;
  }

  /**
   * Finds subscriptions by tenant id
   *
   * @param tenantId - The id of the tenant to find subscriptions by
   * @returns The subscriptions found
   */
  async findByTenantId(
    tenantId: string,
  ): Promise<SubscriptionViewModel | null> {
    this.logger.log(`Finding subscriptions by tenant id: ${tenantId}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const subscription = await collection.findOne({ tenantId });

    return subscription
      ? this.subscriptionMongoDBMapper.toViewModel({
          id: subscription.id,
          tenantId: subscription.tenantId,
          planId: subscription.planId,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          trialEndDate: subscription.trialEndDate,
          status: subscription.status,
          stripeSubscriptionId: subscription.stripeSubscriptionId,
          stripeCustomerId: subscription.stripeCustomerId,
          renewalMethod: subscription.renewalMethod,
          createdAt: subscription.createdAt,
          updatedAt: subscription.updatedAt,
        })
      : null;
  }

  /**
   * Finds subscriptions by criteria
   *
   * @param criteria - The criteria to find subscriptions by
   * @returns The subscriptions found
   */

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<SubscriptionViewModel>> {
    this.logger.log(
      `Finding subscriptions by criteria: ${JSON.stringify(criteria)}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Build MongoDB query from criteria
    const mongoQuery = this.buildMongoQuery(criteria);
    const sortQuery = this.buildSortQuery(criteria);

    // 02: Calculate pagination
    const page = criteria.pagination.page || 1;
    const limit = criteria.pagination.perPage || 10;
    const skip = (page - 1) * limit;

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
    const subscriptions = data.map((doc) =>
      this.subscriptionMongoDBMapper.toViewModel({
        id: doc.id,
        tenantId: doc.tenantId,
        planId: doc.planId,
        startDate: doc.startDate,
        endDate: doc.endDate,
        trialEndDate: doc.trialEndDate,
        status: doc.status,
        stripeSubscriptionId: doc.stripeSubscriptionId,
        stripeCustomerId: doc.stripeCustomerId,
        renewalMethod: doc.renewalMethod,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<SubscriptionViewModel>(
      subscriptions,
      total,
      page,
      limit,
    );
  }

  /**
   * Saves a subscription view model (upsert operation)
   *
   * @param subscriptionViewModel - The subscription view model to save
   */
  async save(subscriptionViewModel: SubscriptionViewModel): Promise<void> {
    this.logger.log(
      `Saving subscription view model with id: ${subscriptionViewModel.id}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const mongoData = this.subscriptionMongoDBMapper.toMongoData(
      subscriptionViewModel,
    );

    // 01: Use upsert to either insert or update the subscription view model
    await collection.replaceOne({ id: subscriptionViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a subscription view model by id
   *
   * @param id - The id of the subscription view model to delete
   * @returns True if the subscription was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting subscription view model by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Delete the subscription view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
