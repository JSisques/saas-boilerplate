import { UserAggregate } from '@/features/users/domain/entities/user.aggregate';
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

    return this.userAggregateFactory.create({
      id: userData.id,
      name: userData.name,
      bio: userData.bio,
      avatar: userData.avatar,
    });
  }

  toPrismaData(user: UserAggregate): UserPrismaDto {
    this.logger.log(
      `Converting domain entity with id ${user.id.value} to Prisma data`,
    );

    return {
      id: user.id.value,
      name: user.name?.value,
      bio: user.bio?.value,
      avatar: user.avatar?.value,
    };
  }
}
