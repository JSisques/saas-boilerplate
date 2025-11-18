import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo.repository';
import { MongoService } from '@/shared/infrastructure/database/mongodb/services/mongo.service';
import { TenantReadRepository } from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';
import { TenantMongoDBMapper } from '@/tenant-context/tenants/infrastructure/database/mongodb/mappers/tenant-mongodb.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantMongoRepository
  extends BaseMongoRepository
  implements TenantReadRepository
{
  private readonly collectionName = 'tenants';

  constructor(
    mongoService: MongoService,
    private readonly tenantMongoDBMapper: TenantMongoDBMapper,
  ) {
    super(mongoService);
    this.logger = new Logger(TenantMongoRepository.name);
  }

  /**
   * Finds a tenant by id
   *
   * @param id - The id of the tenant to find
   * @returns The tenant if found, null otherwise
   */
  async findById(id: string): Promise<TenantViewModel | null> {
    this.logger.log(`Finding tenant by id: ${id}`);

    const collection = this.mongoService.getCollection(this.collectionName);
    const tenantViewModel = await collection.findOne({ id });

    return tenantViewModel
      ? this.tenantMongoDBMapper.toViewModel({
          id: tenantViewModel.id,
          name: tenantViewModel.name,
          slug: tenantViewModel.slug,
          description: tenantViewModel.description,
          websiteUrl: tenantViewModel.websiteUrl,
          logoUrl: tenantViewModel.logoUrl,
          faviconUrl: tenantViewModel.faviconUrl,
          primaryColor: tenantViewModel.primaryColor,
          secondaryColor: tenantViewModel.secondaryColor,
          status: tenantViewModel.status,
          email: tenantViewModel.email,
          phoneNumber: tenantViewModel.phoneNumber,
          phoneCode: tenantViewModel.phoneCode,
          address: tenantViewModel.address,
          city: tenantViewModel.city,
          state: tenantViewModel.state,
          country: tenantViewModel.country,
          postalCode: tenantViewModel.postalCode,
          timezone: tenantViewModel.timezone,
          locale: tenantViewModel.locale,
          maxUsers: tenantViewModel.maxUsers,
          maxStorage: tenantViewModel.maxStorage,
          maxApiCalls: tenantViewModel.maxApiCalls,
          tenantMembers: tenantViewModel.tenantMembers,
          createdAt: tenantViewModel.createdAt,
          updatedAt: tenantViewModel.updatedAt,
        })
      : null;
  }

  /**
   * Finds tenants by criteria
   *
   * @param criteria - The criteria to find tenants by
   * @returns The tenants found
   */

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<TenantViewModel>> {
    this.logger.log(`Finding tenants by criteria: ${JSON.stringify(criteria)}`);

    const collection = this.mongoService.getCollection(this.collectionName);

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
    const tenants = data.map((doc) =>
      this.tenantMongoDBMapper.toViewModel({
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        websiteUrl: doc.websiteUrl,
        logoUrl: doc.logoUrl,
        faviconUrl: doc.faviconUrl,
        primaryColor: doc.primaryColor,
        secondaryColor: doc.secondaryColor,
        status: doc.status,
        email: doc.email,
        phoneNumber: doc.phoneNumber,
        phoneCode: doc.phoneCode,
        address: doc.address,
        city: doc.city,
        state: doc.state,
        country: doc.country,
        postalCode: doc.postalCode,
        timezone: doc.timezone,
        locale: doc.locale,
        maxUsers: doc.maxUsers,
        maxStorage: doc.maxStorage,
        maxApiCalls: doc.maxApiCalls,
        tenantMembers: doc.tenantMembers,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<TenantViewModel>(tenants, total, page, limit);
  }

  /**
   * Saves a user view model (upsert operation)
   *
   * @param tenantViewModel - The tenant view model to save
   */
  async save(tenantViewModel: TenantViewModel): Promise<void> {
    this.logger.log(`Saving tenant view model with id: ${tenantViewModel.id}`);

    const collection = this.mongoService.getCollection(this.collectionName);
    const mongoData =
      await this.tenantMongoDBMapper.toMongoData(tenantViewModel);

    // 01: Use upsert to either insert or update the tenant view model
    await collection.replaceOne({ id: tenantViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a tenant view model by id
   *
   * @param id - The id of the tenant view model to delete
   * @returns True if the tenant was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting tenant view model by id: ${id}`);

    const collection = this.mongoService.getCollection(this.collectionName);

    // 01: Delete the tenant view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
