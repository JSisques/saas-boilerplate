import { BasePrismaMasterRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-master/base-prisma-master.repository';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master.service';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserWriteRepository } from '@/user-context/users/domain/repositories/user-write.repository';
import { UserPrismaMapper } from '@/user-context/users/infrastructure/database/prisma/mappers/user-prisma.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserPrismaRepository
  extends BasePrismaMasterRepository
  implements UserWriteRepository
{
  constructor(
    prismaMasterService: PrismaMasterService,
    private readonly userPrismaMapper: UserPrismaMapper,
  ) {
    super(prismaMasterService);
    this.logger = new Logger(UserPrismaRepository.name);
  }

  /**
   * Finds a user by their id
   *
   * @param id - The id of the user to find
   * @returns The user if found, null otherwise
   */
  async findById(id: string): Promise<UserAggregate | null> {
    const userData = await this.prismaMasterService.user.findUnique({
      where: { id },
    });

    if (!userData) {
      return null;
    }

    return this.userPrismaMapper.toDomainEntity(userData);
  }

  /**
   * Finds a user by their user name
   *
   * @param userName - The user name of the user to find
   * @returns The user if found, null otherwise
   */
  async findByUserName(userName: string): Promise<UserAggregate | null> {
    const userData = await this.prismaMasterService.user.findUnique({
      where: { userName },
    });

    if (!userData) {
      return null;
    }

    return this.userPrismaMapper.toDomainEntity(userData);
  }

  /**
   * Saves a user
   *
   * @param user - The user to save
   * @returns The saved user
   */
  async save(user: UserAggregate): Promise<UserAggregate> {
    const userData = this.userPrismaMapper.toPrismaData(user);

    const result = await this.prismaMasterService.user.upsert({
      where: { id: user.id.value },
      update: userData,
      create: userData,
    });

    return this.userPrismaMapper.toDomainEntity(result);
  }

  /**
   * Deletes a user
   *
   * @param user - The user to delete
   * @returns True if the user was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting user by id: ${id}`);

    await this.prismaMasterService.user.delete({
      where: { id },
    });

    return true;
  }
}
