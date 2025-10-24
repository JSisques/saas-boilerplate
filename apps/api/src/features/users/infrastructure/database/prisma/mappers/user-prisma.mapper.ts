import { UserAggregate } from '@/features/users/domain/aggregates/user.aggregate';
import {
  USER_AGGREGATE_FACTORY_TOKEN,
  UserAggregateFactory,
} from '@/features/users/domain/factories/user.factory';
import { UserPrismaDto } from '@/features/users/infrastructure/database/prisma/dtos/user-prisma.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RoleEnum, StatusEnum } from '@prisma/client';

export const USER_PRISMA_MAPPER_TOKEN = Symbol('UserPrismaMapper');

@Injectable()
export class UserPrismaMapper {
  private readonly logger = new Logger(UserPrismaMapper.name);

  constructor(
    @Inject(USER_AGGREGATE_FACTORY_TOKEN)
    private readonly userAggregateFactory: UserAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a user aggregate
   *
   * @param userData - The Prisma data to convert
   * @returns The user aggregate
   */
  toDomainEntity(userData: UserPrismaDto): UserAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${userData.id}`,
    );

    return this.userAggregateFactory.fromPrimitives({
      id: userData.id,
      userName: userData.userName,
      name: userData.name,
      lastName: userData.lastName,
      bio: userData.bio,
      avatarUrl: userData.avatarUrl,
      role: userData.role,
      status: userData.status,
    });
  }

  /**
   * Converts a user aggregate to a Prisma data
   *
   * @param user - The user aggregate to convert
   * @returns The Prisma data
   */
  toPrismaData(user: UserAggregate): UserPrismaDto {
    this.logger.log(
      `Converting domain entity with id ${user.id.value} to Prisma data`,
    );

    return {
      id: user.id.value,
      avatarUrl: user.avatarUrl?.value,
      bio: user.bio?.value,
      lastName: user.lastName?.value,
      name: user.name?.value,
      role: user.role?.value as RoleEnum,
      status: user.status?.value as StatusEnum,
      userName: user.userName?.value,
    };
  }
}
