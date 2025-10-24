import { AuditReadRepository } from '@/audit/domain/repositories/audit-read.repository';
import { AuditViewModel } from '@/audit/domain/view-models/audit.view-model';
import {
  AUDIT_MONGODB_MAPPER_TOKEN,
  AuditMongoDBMapper,
} from '@/audit/infrastructure/mongodb/mappers/audit-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoRepository } from '@/shared/infrastructure/database/mongodb/base-mongo.repository';
import { MongoService } from '@/shared/infrastructure/database/mongodb/mongo.service';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditMongoRepository
  extends BaseMongoRepository
  implements AuditReadRepository
{
  private readonly collectionName = 'audits';

  constructor(
    mongoService: MongoService,
    @Inject(AUDIT_MONGODB_MAPPER_TOKEN)
    private readonly auditMongoDBMapper: AuditMongoDBMapper,
  ) {
    super(mongoService);
    this.logger = new Logger(AuditMongoRepository.name);
  }

  /**
   * Finds a audit by id
   *
   * @param id - The id of the audit to find
   * @returns The audit if found, null otherwise
   */
  async findById(id: string): Promise<AuditViewModel | null> {
    this.logger.log(`Finding audit by id: ${id}`);

    const collection = this.mongoService.getCollection(this.collectionName);
    const auditViewModel = await collection.findOne({ id });

    return auditViewModel
      ? this.auditMongoDBMapper.toViewModel({
          id: auditViewModel.id,
          eventType: auditViewModel.eventType,
          aggregateType: auditViewModel.aggregateType,
          aggregateId: auditViewModel.aggregateId,
          payload: auditViewModel.payload,
          timestamp: auditViewModel.timestamp,
          createdAt: auditViewModel.createdAt,
          updatedAt: auditViewModel.updatedAt,
        })
      : null;
  }

  /**
   * Finds audits by criteria
   *
   * @param criteria - The criteria to find audits by
   * @returns The audits found
   */

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<AuditViewModel>> {
    this.logger.log(`Finding audits by criteria: ${JSON.stringify(criteria)}`);

    const collection = this.mongoService.getCollection(this.collectionName);

    // 01: Build MongoDB query from criteria
    const mongoQuery = this.buildMongoQuery(criteria);
    const sortQuery = this.buildSortQuery(criteria);

    // 02: Calculate pagination
    const { page, limit, skip } = await this.calculatePagination(criteria);

    // 03: Execute query with pagination
    const [data, total] = await this.executeQueryWithPagination(
      collection,
      mongoQuery,
      sortQuery,
      skip,
      limit,
    );

    // 04: Convert MongoDB documents to domain entities
    const audits = data.map((doc) =>
      this.auditMongoDBMapper.toViewModel({
        id: doc.id,
        eventType: doc.eventType,
        aggregateType: doc.aggregateType,
        aggregateId: doc.aggregateId,
        payload: doc.payload,
        timestamp: doc.timestamp,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<AuditViewModel>(audits, total, page, limit);
  }

  /**
   * Saves a audit view model
   *
   * @param auditViewModel - The audit view model to save
   */
  async save(auditViewModel: AuditViewModel): Promise<void> {
    this.logger.log(`Saving audit view model with id: ${auditViewModel.id}`);

    const collection = this.mongoService.getCollection(this.collectionName);

    // 01: Insert the audit view model into the collection
    await collection.insertOne(
      this.auditMongoDBMapper.toMongoData(auditViewModel),
    );
  }

  /**
   * Deletes a audit view model by id
   *
   * @param id - The id of the audit view model to delete
   * @returns True if the audit was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting audit view model by id: ${id}`);

    const collection = this.mongoService.getCollection(this.collectionName);

    // 01: Delete the audit view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
