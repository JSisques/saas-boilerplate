import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthAggregateFactory } from '@/auth-context/auth/domain/factories/auth-aggregate/auth-aggregate.factory';
import { AuthPrismaMapper } from '@/auth-context/auth/infrastructure/database/prisma/mappers/auth-prisma.mapper';
import { AuthPrismaDto } from '@/auth-context/auth/infrastructure/database/prisma/dtos/auth-prisma.dto';
import { AuthProviderEnum } from '@prisma/client';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

describe('AuthPrismaMapper', () => {
  let mapper: AuthPrismaMapper;
  let mockAuthAggregateFactory: jest.Mocked<AuthAggregateFactory>;

  beforeEach(() => {
    mockAuthAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<AuthAggregateFactory>;

    mapper = new AuthPrismaMapper(mockAuthAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert Prisma data to domain entity with all properties', () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const prismaData: AuthPrismaDto = {
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        phoneNumber: '+1234567890',
        lastLoginAt: now,
        password: '$2b$12$hashedpassword',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      };

      const mockAuthAggregate = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: null as any,
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: null as any,
          providerId: null,
          twoFactorEnabled: null as any,
          createdAt: null as any,
          updatedAt: null as any,
        },
        false,
      );

      mockAuthAggregateFactory.fromPrimitives.mockReturnValue(mockAuthAggregate);

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockAuthAggregate);
      expect(mockAuthAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        phoneNumber: '+1234567890',
        lastLoginAt: now,
        password: '$2b$12$hashedpassword',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      });
      expect(mockAuthAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(1);
    });

    it('should convert Prisma data with null optional properties', () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const prismaData: AuthPrismaDto = {
        id: authId,
        userId: userId,
        email: null,
        emailVerified: false,
        phoneNumber: null,
        lastLoginAt: null,
        password: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: true,
        createdAt: now,
        updatedAt: now,
      };

      const mockAuthAggregate = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: null as any,
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: null as any,
          providerId: null,
          twoFactorEnabled: null as any,
          createdAt: null as any,
          updatedAt: null as any,
        },
        false,
      );

      mockAuthAggregateFactory.fromPrimitives.mockReturnValue(mockAuthAggregate);

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockAuthAggregate);
      expect(mockAuthAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: authId,
        userId: userId,
        email: null,
        emailVerified: false,
        phoneNumber: null,
        lastLoginAt: null,
        password: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: true,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toPrismaData', () => {
    it('should convert domain entity to Prisma data with all properties', () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const mockAuthAggregate = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: null as any,
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: null as any,
          providerId: null,
          twoFactorEnabled: null as any,
          createdAt: null as any,
          updatedAt: null as any,
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockAuthAggregate, 'toPrimitives')
        .mockReturnValue({
          id: authId,
          userId: userId,
          email: 'test@example.com',
          emailVerified: true,
          phoneNumber: '+1234567890',
          lastLoginAt: now,
          password: '$2b$12$hashedpassword',
          provider: AuthProviderEnum.LOCAL,
          providerId: null,
          twoFactorEnabled: false,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toPrismaData(mockAuthAggregate);

      expect(result).toEqual({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        phoneNumber: '+1234567890',
        lastLoginAt: now,
        password: '$2b$12$hashedpassword',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      });
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });

    it('should convert domain entity with null optional properties', () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const mockAuthAggregate = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: null,
          emailVerified: null as any,
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: null as any,
          providerId: null,
          twoFactorEnabled: null as any,
          createdAt: null as any,
          updatedAt: null as any,
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockAuthAggregate, 'toPrimitives')
        .mockReturnValue({
          id: authId,
          userId: userId,
          email: null,
          emailVerified: false,
          phoneNumber: null,
          lastLoginAt: null,
          password: null,
          provider: AuthProviderEnum.GOOGLE,
          providerId: 'google-123',
          twoFactorEnabled: true,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toPrismaData(mockAuthAggregate);

      expect(result).toEqual({
        id: authId,
        userId: userId,
        email: null,
        emailVerified: false,
        phoneNumber: null,
        lastLoginAt: null,
        password: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: true,
        createdAt: now,
        updatedAt: now,
      });

      toPrimitivesSpy.mockRestore();
    });
  });
});

