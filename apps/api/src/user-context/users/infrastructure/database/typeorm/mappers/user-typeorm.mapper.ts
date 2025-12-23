import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserAggregateFactory } from '@/user-context/users/domain/factories/user-aggregate/user-aggregate.factory';
import { UserTypeormEntity } from '@/user-context/users/infrastructure/database/typeorm/entities/user-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserTypeOrmMapper {
  private readonly logger = new Logger(UserTypeOrmMapper.name);

  constructor(private readonly userAggregateFactory: UserAggregateFactory) {}

  /**
   * Converts a TypeORM entity to a user aggregate
   *
   * @param userEntity - The TypeORM entity to convert
   * @returns The user aggregate
   */
  toDomainEntity(userEntity: UserTypeormEntity): UserAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${userEntity.id}`,
    );

    return this.userAggregateFactory.fromPrimitives({
      id: userEntity.id,
      userName: userEntity.userName ?? null,
      name: userEntity.name ?? null,
      lastName: userEntity.lastName ?? null,
      bio: userEntity.bio ?? null,
      avatarUrl: userEntity.avatarUrl ?? null,
      role: userEntity.role,
      status: userEntity.status,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    });
  }

  /**
   * Converts a user aggregate to a TypeORM entity
   *
   * @param user - The user aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(user: UserAggregate): UserTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${user.id.value} to TypeORM entity`,
    );

    const primitives = user.toPrimitives();

    const entity = new UserTypeormEntity();

    entity.id = primitives.id;
    entity.userName = primitives.userName;
    entity.name = primitives.name;
    entity.lastName = primitives.lastName;
    entity.bio = primitives.bio;
    entity.avatarUrl = primitives.avatarUrl;
    entity.role = primitives.role as UserRoleEnum;
    entity.status = primitives.status as UserStatusEnum;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
