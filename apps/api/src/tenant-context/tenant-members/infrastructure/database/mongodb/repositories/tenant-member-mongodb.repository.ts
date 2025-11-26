import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { TenantMemberReadRepository } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { TenantMemberMongoDBMapper } from '@/tenant-context/tenant-members/infrastructure/database/mongodb/mappers/tenant-member-mongodb.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantMemberMongoRepository
  extends BaseMongoMasterRepository
  implements TenantMemberReadRepository
{
  private readonly collectionName = 'tenant-members';

  constructor(
    mongoMasterService: MongoMasterService,
    private readonly tenantMemberMongoDBMapper: TenantMemberMongoDBMapper,
  ) {
    super(mongoMasterService);
    this.logger = new Logger(TenantMemberMongoRepository.name);
  }

  /**
   * Finds a tenant member by id
   *
   * @param id - The id of the tenant member to find
   * @returns The tenant member if found, null otherwise
   */
  async findById(id: string): Promise<TenantMemberViewModel | null> {
    this.logger.log(`Finding tenant member by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const tenantMemberViewModel = await collection.findOne({ id });

    return tenantMemberViewModel
      ? this.tenantMemberMongoDBMapper.toViewModel({
          id: tenantMemberViewModel.id,
          tenantId: tenantMemberViewModel.tenantId,
          userId: tenantMemberViewModel.userId,
          role: tenantMemberViewModel.role,
          createdAt: tenantMemberViewModel.createdAt,
          updatedAt: tenantMemberViewModel.updatedAt,
        })
      : null;
  }

  /**
   * Finds tenant members by tenant id
   *
   * @param tenantId - The id of the tenant to find tenant members by
   * @returns The tenant members found
   */
  async findByTenantId(
    tenantId: string,
  ): Promise<TenantMemberViewModel[] | null> {
    this.logger.log(`Finding tenant members by tenant id: ${tenantId}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const tenantMembers = await collection.find({ tenantId }).toArray();

    return tenantMembers.map((doc) =>
      this.tenantMemberMongoDBMapper.toViewModel({
        id: doc.id,
        tenantId: doc.tenantId,
        userId: doc.userId,
        role: doc.role,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );
  }
  /**
   * Finds tenant members by user id
   *
   * @param userId - The id of the user to find tenant members by
   * @returns The tenant members found
   */
  async findByUserId(userId: string): Promise<TenantMemberViewModel[] | null> {
    this.logger.log(`Finding tenant members by user id: ${userId}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const tenantMembers = await collection.find({ userId }).toArray();

    return tenantMembers.map((doc) =>
      this.tenantMemberMongoDBMapper.toViewModel({
        id: doc.id,
        tenantId: doc.tenantId,
        userId: doc.userId,
        role: doc.role,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );
  }

  /**
   * Finds tenant members by criteria
   *
   * @param criteria - The criteria to find tenant members by
   * @returns The tenant members found
   */

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<TenantMemberViewModel>> {
    this.logger.log(
      `Finding tenant members by criteria: ${JSON.stringify(criteria)}`,
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
    const tenantMembers = data.map((doc) =>
      this.tenantMemberMongoDBMapper.toViewModel({
        id: doc.id,
        tenantId: doc.tenantId,
        userId: doc.userId,
        role: doc.role,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<TenantMemberViewModel>(
      tenantMembers,
      total,
      page,
      limit,
    );
  }

  /**
   * Saves a user view model (upsert operation)
   *
   * @param tenantMemberViewModel - The tenant member view model to save
   */
  async save(tenantMemberViewModel: TenantMemberViewModel): Promise<void> {
    this.logger.log(
      `Saving tenant member view model with id: ${tenantMemberViewModel.id}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const mongoData = this.tenantMemberMongoDBMapper.toMongoData(
      tenantMemberViewModel,
    );

    // 01: Use upsert to either insert or update the tenant view model
    await collection.replaceOne({ id: tenantMemberViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a tenant view model by id
   *
   * @param id - The id of the tenant member view model to delete
   * @returns True if the tenant member was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting tenant member view model by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Delete the tenant member view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
