import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthWriteRepository } from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { AuthTypeormEntity } from '@/auth-context/auth/infrastructure/database/typeorm/entities/auth-typeorm.entity';
import { AuthTypeormMapper } from '@/auth-context/auth/infrastructure/database/typeorm/mappers/auth-typeorm.mapper';
import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthTypeormRepository
  extends BaseTypeormMasterRepository<AuthTypeormEntity>
  implements AuthWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly authTypeormMapper: AuthTypeormMapper,
  ) {
    super(typeormMasterService, AuthTypeormEntity);
    this.logger = new Logger(AuthTypeormRepository.name);
  }

  /**
   * Finds an auth by their id
   *
   * @param id - The id of the auth to find
   * @returns The auth if found, null otherwise
   */
  async findById(id: string): Promise<AuthAggregate | null> {
    this.logger.log(`Finding auth by id: ${id}`);
    const authEntity = await this.repository.findOne({
      where: { id },
    });

    if (!authEntity) {
      return null;
    }

    return this.authTypeormMapper.toDomainEntity(authEntity);
  }

  /**
   * Finds an auth by their email
   *
   * @param email - The email of the auth to find
   * @returns The auth if found, null otherwise
   */
  async findByEmail(email: string): Promise<AuthAggregate | null> {
    this.logger.log(`Finding auth by email: ${email}`);
    const authEntity = await this.repository.findOne({
      where: { email },
    });

    if (!authEntity) {
      return null;
    }

    return this.authTypeormMapper.toDomainEntity(authEntity);
  }

  /**
   * Finds an auth by their user id
   *
   * @param userId - The user id of the auth to find
   * @returns The auth if found, null otherwise
   */
  async findByUserId(userId: string): Promise<AuthAggregate | null> {
    this.logger.log(`Finding auth by user id: ${userId}`);
    const authEntity = await this.repository.findOne({
      where: { userId },
    });

    if (!authEntity) {
      return null;
    }

    return this.authTypeormMapper.toDomainEntity(authEntity);
  }

  /**
   * Saves an auth
   *
   * @param auth - The auth to save
   * @returns The saved auth
   */
  async save(auth: AuthAggregate): Promise<AuthAggregate> {
    this.logger.log(`Saving auth: ${auth.id.value}`);
    const authEntity = this.authTypeormMapper.toTypeormEntity(auth);

    const savedEntity = await this.repository.save(authEntity);

    return this.authTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes an auth (soft delete)
   *
   * @param id - The id of the auth to delete
   * @returns True if the auth was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Soft deleting auth by id: ${id}`);

    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && result.affected > 0;
  }
}
