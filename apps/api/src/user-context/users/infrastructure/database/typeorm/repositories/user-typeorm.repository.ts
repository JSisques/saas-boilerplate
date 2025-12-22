import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserWriteRepository } from '@/user-context/users/domain/repositories/user-write.repository';
import { UserTypeormEntity } from '@/user-context/users/infrastructure/database/typeorm/entities/user-typeorm.entity';
import { UserTypeOrmMapper } from '@/user-context/users/infrastructure/database/typeorm/mappers/user-typeorm.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserTypeormRepository
  extends BaseTypeormMasterRepository<UserTypeormEntity>
  implements UserWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly userTypeormMapper: UserTypeOrmMapper,
  ) {
    super(typeormMasterService, UserTypeormEntity);
    this.logger = new Logger(UserTypeormRepository.name);
  }

  /**
   * Finds a user by their id
   *
   * @param id - The id of the user to find
   * @returns The user if found, null otherwise
   */
  async findById(id: string): Promise<UserAggregate | null> {
    this.logger.log(`Finding user by id: ${id}`);
    const userEntity = await this.repository.findOne({
      where: { id },
    });

    if (!userEntity) {
      return null;
    }

    return this.userTypeormMapper.toDomainEntity(userEntity);
  }

  /**
   * Finds a user by their user name
   *
   * @param userName - The user name of the user to find
   * @returns The user if found, null otherwise
   */
  async findByUserName(userName: string): Promise<UserAggregate | null> {
    this.logger.log(`Finding user by user name: ${userName}`);
    const userEntity = await this.repository.findOne({
      where: { userName },
    });

    if (!userEntity) {
      return null;
    }

    return this.userTypeormMapper.toDomainEntity(userEntity);
  }

  /**
   * Saves a user
   *
   * @param user - The user to save
   * @returns The saved user
   */
  async save(user: UserAggregate): Promise<UserAggregate> {
    this.logger.log(`Saving user: ${user.id.value}`);
    const userEntity = this.userTypeormMapper.toTypeormEntity(user);

    // Check if user exists
    const existingUser = await this.repository.findOne({
      where: { id: user.id.value },
    });

    let savedEntity: UserTypeormEntity;

    if (existingUser) {
      // Update existing user
      Object.assign(existingUser, userEntity);
      savedEntity = await this.repository.save(existingUser);
    } else {
      // Create new user
      savedEntity = await this.repository.save(userEntity);
    }

    return this.userTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a user (soft delete)
   *
   * @param id - The id of the user to delete
   * @returns True if the user was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Soft deleting user by id: ${id}`);

    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && result.affected > 0;
  }
}
