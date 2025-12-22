import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthAggregateFactory } from '@/auth-context/auth/domain/factories/auth-aggregate/auth-aggregate.factory';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthTypeormEntity } from '@/auth-context/auth/infrastructure/database/typeorm/entities/auth-typeorm.entity';
import { AuthTypeormMapper } from '@/auth-context/auth/infrastructure/database/typeorm/mappers/auth-typeorm.mapper';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

describe('AuthTypeormMapper', () => {
  let mapper: AuthTypeormMapper;
  let mockAuthAggregateFactory: jest.Mocked<AuthAggregateFactory>;

  beforeEach(() => {
    mockAuthAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<AuthAggregateFactory>;

    mapper = new AuthTypeormMapper(mockAuthAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const typeormEntity = new AuthTypeormEntity();
      typeormEntity.id = authId;
      typeormEntity.userId = userId;
      typeormEntity.email = 'test@example.com';
      typeormEntity.emailVerified = true;
      typeormEntity.phoneNumber = '+1234567890';
      typeormEntity.lastLoginAt = now;
      typeormEntity.password = '$2b$12$hashedpassword';
      typeormEntity.provider = AuthProviderEnum.LOCAL;
      typeormEntity.providerId = null;
      typeormEntity.twoFactorEnabled = false;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

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

      mockAuthAggregateFactory.fromPrimitives.mockReturnValue(
        mockAuthAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

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

    it('should convert TypeORM entity with null optional properties', () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const typeormEntity = new AuthTypeormEntity();
      typeormEntity.id = authId;
      typeormEntity.userId = userId;
      typeormEntity.email = null;
      typeormEntity.emailVerified = false;
      typeormEntity.phoneNumber = null;
      typeormEntity.lastLoginAt = null;
      typeormEntity.password = null;
      typeormEntity.provider = AuthProviderEnum.GOOGLE;
      typeormEntity.providerId = 'google-123';
      typeormEntity.twoFactorEnabled = true;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

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

      mockAuthAggregateFactory.fromPrimitives.mockReturnValue(
        mockAuthAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

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

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
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

      const result = mapper.toTypeormEntity(mockAuthAggregate);

      expect(result).toBeInstanceOf(AuthTypeormEntity);
      expect(result.id).toBe(authId);
      expect(result.userId).toBe(userId);
      expect(result.email).toBe('test@example.com');
      expect(result.emailVerified).toBe(true);
      expect(result.phoneNumber).toBe('+1234567890');
      expect(result.lastLoginAt).toEqual(now);
      expect(result.password).toBe('$2b$12$hashedpassword');
      expect(result.provider).toBe(AuthProviderEnum.LOCAL);
      expect(result.providerId).toBeNull();
      expect(result.twoFactorEnabled).toBe(false);
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
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

      const result = mapper.toTypeormEntity(mockAuthAggregate);

      expect(result).toBeInstanceOf(AuthTypeormEntity);
      expect(result.id).toBe(authId);
      expect(result.userId).toBe(userId);
      expect(result.email).toBeNull();
      expect(result.emailVerified).toBe(false);
      expect(result.phoneNumber).toBeNull();
      expect(result.lastLoginAt).toBeNull();
      expect(result.password).toBeNull();
      expect(result.provider).toBe(AuthProviderEnum.GOOGLE);
      expect(result.providerId).toBe('google-123');
      expect(result.twoFactorEnabled).toBe(true);
      expect(result.deletedAt).toBeNull();

      toPrimitivesSpy.mockRestore();
    });
  });
});
