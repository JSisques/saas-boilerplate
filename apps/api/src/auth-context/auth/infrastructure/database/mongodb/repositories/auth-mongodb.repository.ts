import { AuthReadRepository } from '@/auth-context/auth/domain/repositories/auth-read.repository';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import { AuthMongoDBMapper } from '@/auth-context/auth/infrastructure/database/mongodb/mappers/auth-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthMongoRepository
  extends BaseMongoMasterRepository
  implements AuthReadRepository
{
  private readonly collectionName = 'auths';

  constructor(
    mongoMasterService: MongoMasterService,
    private readonly authMongoDBMapper: AuthMongoDBMapper,
  ) {
    super(mongoMasterService);
    this.logger = new Logger(AuthMongoRepository.name);
  }

  /**
   * Finds a auth by id
   *
   * @param id - The id of the auth to find
   * @returns The auth if found, null otherwise
   */
  async findById(id: string): Promise<AuthViewModel | null> {
    this.logger.log(`Finding auth by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const authViewModel = await collection.findOne({ id });

    return authViewModel
      ? this.authMongoDBMapper.toViewModel({
          id: authViewModel.id,
          userId: authViewModel.userId,
          email: authViewModel.email,
          emailVerified: authViewModel.emailVerified,
          phoneNumber: authViewModel.phoneNumber,
          lastLoginAt: authViewModel.lastLoginAt,
          password: authViewModel.password,
          provider: authViewModel.provider,
          providerId: authViewModel.providerId,
          twoFactorEnabled: authViewModel.twoFactorEnabled,
          createdAt: authViewModel.createdAt,
          updatedAt: authViewModel.updatedAt,
        })
      : null;
  }

  /**
   * Finds auths by criteria
   *
   * @param criteria - The criteria to find auths by
   * @returns The auths found
   */

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<AuthViewModel>> {
    this.logger.log(`Finding auths by criteria: ${JSON.stringify(criteria)}`);

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
    const auths = data.map((doc) =>
      this.authMongoDBMapper.toViewModel({
        id: doc.id,
        userId: doc.userId,
        email: doc.email,
        emailVerified: doc.emailVerified,
        phoneNumber: doc.phoneNumber || null,
        lastLoginAt: doc.lastLoginAt,
        password: doc.password,
        provider: doc.provider,
        providerId: doc.providerId,
        twoFactorEnabled: doc.twoFactorEnabled,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<AuthViewModel>(auths, total, page, limit);
  }

  /**
   * Saves a auth view model (upsert operation)
   *
   * @param authViewModel - The auth view model to save
   */
  async save(authViewModel: AuthViewModel): Promise<void> {
    this.logger.log(`Saving auth view model with id: ${authViewModel.id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const mongoData = this.authMongoDBMapper.toMongoData(authViewModel);

    // 01: Use upsert to either insert or update the auth view model
    await collection.replaceOne({ id: authViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a auth view model by id
   *
   * @param id - The id of the auth view model to delete
   * @returns True if the auth was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting auth view model by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Delete the auth view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
