import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo.repository';
import { MongoService } from '@/shared/infrastructure/database/mongodb/services/mongo.service';
import { UserReadRepository } from '@/user-context/users/domain/repositories/user-read.repository';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { UserMongoDBMapper } from '@/user-context/users/infrastructure/database/mongodb/mappers/user-mongodb.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserMongoRepository
  extends BaseMongoRepository
  implements UserReadRepository
{
  private readonly collectionName = 'users';

  constructor(
    mongoService: MongoService,
    private readonly userMongoDBMapper: UserMongoDBMapper,
  ) {
    super(mongoService);
    this.logger = new Logger(UserMongoRepository.name);
  }

  /**
   * Finds a user by id
   *
   * @param id - The id of the user to find
   * @returns The user if found, null otherwise
   */
  async findById(id: string): Promise<UserViewModel | null> {
    this.logger.log(`Finding user by id: ${id}`);

    const collection = this.mongoService.getCollection(this.collectionName);
    const userViewModel = await collection.findOne({ id });

    return userViewModel
      ? this.userMongoDBMapper.toViewModel({
          id: userViewModel.id,
          avatarUrl: userViewModel.avatarUrl,
          bio: userViewModel.bio,
          lastName: userViewModel.lastName,
          name: userViewModel.name,
          role: userViewModel.role,
          status: userViewModel.status,
          userName: userViewModel.userName,
          createdAt: userViewModel.createdAt,
          updatedAt: userViewModel.updatedAt,
        })
      : null;
  }

  /**
   * Finds users by criteria
   *
   * @param criteria - The criteria to find users by
   * @returns The users found
   */

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<UserViewModel>> {
    this.logger.log(`Finding users by criteria: ${JSON.stringify(criteria)}`);

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
    const users = data.map((doc) =>
      this.userMongoDBMapper.toViewModel({
        id: doc.id,
        avatarUrl: doc.avatarUrl,
        bio: doc.bio,
        lastName: doc.lastName,
        name: doc.name,
        role: doc.role,
        status: doc.status,
        userName: doc.userName,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<UserViewModel>(users, total, page, limit);
  }

  /**
   * Saves a user view model (upsert operation)
   *
   * @param userViewModel - The user view model to save
   */
  async save(userViewModel: UserViewModel): Promise<void> {
    this.logger.log(`Saving user view model with id: ${userViewModel.id}`);

    const collection = this.mongoService.getCollection(this.collectionName);
    const mongoData = this.userMongoDBMapper.toMongoData(userViewModel);

    // 01: Use upsert to either insert or update the user view model
    await collection.replaceOne({ id: userViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a user view model by id
   *
   * @param id - The id of the user view model to delete
   * @returns True if the user was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting user view model by id: ${id}`);

    const collection = this.mongoService.getCollection(this.collectionName);

    // 01: Delete the user view model from the collection
    await collection.deleteOne({ id });

    return true;
  }
}
