import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthAggregateFactory } from '@/auth-context/auth/domain/factories/auth-aggregate/auth-aggregate.factory';
import { AuthTypeormEntity } from '@/auth-context/auth/infrastructure/database/typeorm/entities/auth-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthTypeormMapper {
  private readonly logger = new Logger(AuthTypeormMapper.name);

  constructor(private readonly authAggregateFactory: AuthAggregateFactory) {}

  /**
   * Converts a TypeORM entity to an auth aggregate
   *
   * @param authEntity - The TypeORM entity to convert
   * @returns The auth aggregate
   */
  toDomainEntity(authEntity: AuthTypeormEntity): AuthAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${authEntity.id}`,
    );

    return this.authAggregateFactory.fromPrimitives({
      id: authEntity.id,
      userId: authEntity.userId,
      email: authEntity.email ?? null,
      emailVerified: authEntity.emailVerified,
      phoneNumber: authEntity.phoneNumber ?? null,
      lastLoginAt: authEntity.lastLoginAt ?? null,
      password: authEntity.password ?? null,
      provider: authEntity.provider,
      providerId: authEntity.providerId ?? null,
      twoFactorEnabled: authEntity.twoFactorEnabled,
      createdAt: authEntity.createdAt,
      updatedAt: authEntity.updatedAt,
    });
  }

  /**
   * Converts an auth aggregate to a TypeORM entity
   *
   * @param auth - The auth aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(auth: AuthAggregate): AuthTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${auth.id.value} to TypeORM entity`,
    );

    const primitives = auth.toPrimitives();

    const entity = new AuthTypeormEntity();

    entity.id = primitives.id;
    entity.userId = primitives.userId;
    entity.email = primitives.email;
    entity.emailVerified = primitives.emailVerified;
    entity.phoneNumber = primitives.phoneNumber;
    entity.lastLoginAt = primitives.lastLoginAt;
    entity.password = primitives.password;
    entity.provider = primitives.provider as AuthProviderEnum;
    entity.providerId = primitives.providerId;
    entity.twoFactorEnabled = primitives.twoFactorEnabled;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
