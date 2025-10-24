import { UserAggregate } from '@/features/users/domain/aggregates/user.aggregate';
import {
  USER_AGGREGATE_FACTORY_TOKEN,
  UserAggregateFactory,
} from '@/features/users/domain/factories/user.factory';
import { UserPrismaDto } from '@/features/users/infrastructure/database/prisma/dtos/user-prisma.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';

export const USER_PRISMA_MAPPER_TOKEN = Symbol('UserPrismaMapper');

@Injectable()
export class UserPrismaMapper {
  private readonly logger = new Logger(UserPrismaMapper.name);

  constructor(
    @Inject(USER_AGGREGATE_FACTORY_TOKEN)
    private readonly userAggregateFactory: UserAggregateFactory,
  ) {}

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
      role: user.role?.value,
      status: user.status?.value,
      userName: user.userName?.value,
    };
  }
}
