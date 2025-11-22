import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { IJwtPayload } from '@/auth-context/auth/domain/interfaces/jwt-payload.interface';
import { AuthWriteRepository } from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { AuthCreatedAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-created-at/auth-created-at.vo';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { AuthUpdatedAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-updated-at/auth-updated-at.vo';
import { JwtStrategy } from '@/auth-context/auth/infrastructure/strategies/jwt/jwt.strategy';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRoleEnum } from '@prisma/client';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockAuthWriteRepository: jest.Mocked<AuthWriteRepository>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          JWT_ACCESS_SECRET: 'test-access-secret',
        };
        return config[key];
      }),
    } as unknown as jest.Mocked<ConfigService>;

    mockAuthWriteRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthWriteRepository>;

    strategy = new JwtStrategy(mockConfigService, mockAuthWriteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return user data with role and userId when auth exists', async () => {
      const now = new Date();
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';

      const payload: IJwtPayload = {
        id: authId,
        userId: userId,
        email: 'test@example.com',
        role: UserRoleEnum.ADMIN,
      };

      const mockAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: new AuthEmailValueObject('test@example.com'),
          emailVerified: new AuthEmailVerifiedValueObject(false),
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
          providerId: null,
          twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
          createdAt: new AuthCreatedAtValueObject(now),
          updatedAt: new AuthUpdatedAtValueObject(now),
        },
        false,
      );

      mockAuthWriteRepository.findById.mockResolvedValue(mockAuth);

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        ...mockAuth,
        role: UserRoleEnum.ADMIN,
        userId: userId,
      });
      expect(mockAuthWriteRepository.findById).toHaveBeenCalledWith(authId);
      expect(mockAuthWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException when auth does not exist', async () => {
      const payload: IJwtPayload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        role: UserRoleEnum.USER,
      };

      mockAuthWriteRepository.findById.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(payload)).rejects.toThrow(
        'User not found',
      );
      expect(mockAuthWriteRepository.findById).toHaveBeenCalledWith(payload.id);
    });
  });
});
