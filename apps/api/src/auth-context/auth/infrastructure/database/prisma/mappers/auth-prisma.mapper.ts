import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import {
  AUTH_AGGREGATE_FACTORY_TOKEN,
  AuthAggregateFactory,
} from '@/auth-context/auth/domain/factories/auth-aggregate.factory';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthProviderEnum } from '@prisma/client';
import { AuthPrismaDto } from '../dtos/auth-prisma.dto';

export const AUTH_PRISMA_MAPPER_TOKEN = Symbol('AuthPrismaMapper');

@Injectable()
export class AuthPrismaMapper {
  private readonly logger = new Logger(AuthPrismaMapper.name);

  constructor(
    @Inject(AUTH_AGGREGATE_FACTORY_TOKEN)
    private readonly authAggregateFactory: AuthAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a auth aggregate
   *
   * @param authData - The Prisma data to convert
   * @returns The auth aggregate
   */
  toDomainEntity(authData: AuthPrismaDto): AuthAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${authData.id}`,
    );

    return this.authAggregateFactory.fromPrimitives({
      id: authData.id,
      userId: authData.userId,
      email: authData.email,
      emailVerified: authData.emailVerified,
      phoneNumber: authData.phoneNumber || null,
      lastLoginAt: authData.lastLoginAt,
      passwordHash: authData.passwordHash,
      provider: authData.provider,
      providerId: authData.providerId,
      twoFactorEnabled: authData.twoFactorEnabled,
    });
  }

  /**
   * Converts a auth aggregate to a Prisma data
   *
   * @param auth - The auth aggregate to convert
   * @returns The Prisma data
   */
  toPrismaData(auth: AuthAggregate): AuthPrismaDto {
    this.logger.log(
      `Converting domain entity with id ${auth.id.value} to Prisma data`,
    );

    // Get primitives from aggregate
    const primitives = auth.toPrimitives();

    return {
      id: primitives.id,
      userId: primitives.userId,
      email: primitives.email,
      emailVerified: primitives.emailVerified,
      phoneNumber: primitives.phoneNumber || null,
      lastLoginAt: primitives.lastLoginAt,
      passwordHash: primitives.passwordHash,
      provider: primitives.provider as AuthProviderEnum,
      providerId: primitives.providerId,
      twoFactorEnabled: primitives.twoFactorEnabled,
    };
  }
}
