import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthAggregateFactory } from '@/auth-context/auth/domain/factories/auth-aggregate/auth-aggregate.factory';
import { AuthProviderEnum } from '@/prisma/master/client';
import { Injectable, Logger } from '@nestjs/common';
import { AuthPrismaDto } from '../dtos/auth-prisma.dto';

@Injectable()
export class AuthPrismaMapper {
  private readonly logger = new Logger(AuthPrismaMapper.name);

  constructor(private readonly authAggregateFactory: AuthAggregateFactory) {}

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
      password: authData.password,
      provider: authData.provider,
      providerId: authData.providerId,
      twoFactorEnabled: authData.twoFactorEnabled,
      createdAt: authData.createdAt,
      updatedAt: authData.updatedAt,
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
      password: primitives.password,
      provider: primitives.provider as AuthProviderEnum,
      providerId: primitives.providerId,
      twoFactorEnabled: primitives.twoFactorEnabled,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
