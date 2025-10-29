import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserAggregateFactory } from '@/user-context/users/domain/factories/user-aggregate.factory';
import { UserPrismaDto } from '@/user-context/users/infrastructure/database/prisma/dtos/user-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';
import { RoleEnum, StatusEnum } from '@prisma/client';

@Injectable()
export class UserPrismaMapper {
  private readonly logger = new Logger(UserPrismaMapper.name);

  constructor(private readonly userAggregateFactory: UserAggregateFactory) {}

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
      name: userData.name ?? null,
      lastName: userData.lastName ?? null,
      bio: userData.bio ?? null,
      avatarUrl: userData.avatarUrl ?? null,
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

    // Get primitives from aggregate
    const primitives = user.toPrimitives();

    return {
      id: primitives.id,
      avatarUrl: primitives.avatarUrl,
      bio: primitives.bio,
      lastName: primitives.lastName,
      name: primitives.name,
      role: primitives.role as RoleEnum,
      status: primitives.status as StatusEnum,
      userName: primitives.userName,
    };
  }
}
