import { AssertAuthEmailExistsService } from '@/auth-context/auth/application/services/assert-auth-email-exists/assert-auth-email-exists.service';
import { JwtAuthService } from '@/auth-context/auth/application/services/jwt-auth/jwt-auth.service';
import { PasswordHashingService } from '@/auth-context/auth/application/services/password-hashing/password-hashing.service';
import { AuthLoginByEmailCommandHandler } from '@/auth-context/auth/application/commands/auth-login-by-email/auth-login-by-email.command-handler';
import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { ITokenPair } from '@/auth-context/auth/domain/interfaces/token-pair.interface';
import {
  AUTH_READ_REPOSITORY_TOKEN,
  AuthReadRepository,
} from '@/auth-context/auth/domain/repositories/auth-read.repository';
import {
  AUTH_WRITE_REPOSITORY_TOKEN,
  AuthWriteRepository,
} from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthLastLoginAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { AuthPasswordValueObject } from '@/auth-context/auth/domain/value-objects/auth-password/auth-password.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { AuthCreatedAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-created-at/auth-created-at.vo';
import { AuthUpdatedAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-updated-at/auth-updated-at.vo';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { UserFindByIdQuery } from '@/user-context/users/application/queries/user-find-by-id/user-find-by-id.query';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserCreatedAtValueObject } from '@/user-context/users/domain/value-objects/user-created-at/user-created-at.vo';
import { UserUpdatedAtValueObject } from '@/user-context/users/domain/value-objects/user-updated-at/user-updated-at.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { UnauthorizedException } from '@nestjs/common';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { AuthLoginByEmailCommand } from './auth-login-by-email.command';

describe('AuthLoginByEmailCommandHandler', () => {
  let handler: AuthLoginByEmailCommandHandler;
  let mockAuthReadRepository: jest.Mocked<AuthReadRepository>;
  let mockAuthWriteRepository: jest.Mocked<AuthWriteRepository>;
  let mockAssertAuthEmailExistsService: jest.Mocked<AssertAuthEmailExistsService>;
  let mockPasswordHashingService: jest.Mocked<PasswordHashingService>;
  let mockJwtAuthService: jest.Mocked<JwtAuthService>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockQueryBus: jest.Mocked<QueryBus>;

  beforeEach(() => {
    mockAuthReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthReadRepository>;

    mockAuthWriteRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthWriteRepository>;

    mockAssertAuthEmailExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertAuthEmailExistsService>;

    mockPasswordHashingService = {
      hashPassword: jest.fn(),
      verifyPassword: jest.fn(),
      isValidHash: jest.fn(),
      getCostFactor: jest.fn(),
      setCostFactor: jest.fn(),
    } as unknown as jest.Mocked<PasswordHashingService>;

    mockJwtAuthService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      generateTokenPair: jest.fn(),
      verifyAccessToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      decodeToken: jest.fn(),
    } as unknown as jest.Mocked<JwtAuthService>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    handler = new AuthLoginByEmailCommandHandler(
      mockAuthReadRepository,
      mockAuthWriteRepository,
      mockAssertAuthEmailExistsService,
      mockPasswordHashingService,
      mockJwtAuthService,
      mockEventBus,
      mockQueryBus,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should login successfully with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'SecurePass123!';
      const hashedPassword =
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqBWVHxkd0u';
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const command = new AuthLoginByEmailCommand({ email, password });

      const mockAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: new AuthEmailValueObject(email),
          emailVerified: new AuthEmailVerifiedValueObject(false),
          lastLoginAt: null,
          password: new AuthPasswordValueObject(hashedPassword),
          phoneNumber: null,
          provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
          providerId: null,
          twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
          createdAt: new AuthCreatedAtValueObject(now),
          updatedAt: new AuthUpdatedAtValueObject(now),
        },
        false,
      );

      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new UserCreatedAtValueObject(now),
          updatedAt: new UserUpdatedAtValueObject(now),
        },
        false,
      );

      const mockTokens: ITokenPair = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockAssertAuthEmailExistsService.execute.mockResolvedValue(mockAuth);
      mockPasswordHashingService.verifyPassword.mockResolvedValue(true);
      mockQueryBus.execute.mockResolvedValue(mockUser);
      mockAuthWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);
      mockJwtAuthService.generateTokenPair.mockReturnValue(mockTokens);

      const updateLastLoginAtSpy = jest.spyOn(mockAuth, 'updateLastLoginAt');
      const commitSpy = jest.spyOn(mockAuth, 'commit');
      const getUncommittedEventsSpy = jest
        .spyOn(mockAuth, 'getUncommittedEvents')
        .mockReturnValue([]);

      const result = await handler.execute(command);

      expect(result).toEqual(mockTokens);
      expect(mockAssertAuthEmailExistsService.execute).toHaveBeenCalledWith(
        email,
      );
      expect(mockPasswordHashingService.verifyPassword).toHaveBeenCalledWith(
        command.password,
        hashedPassword,
      );
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(UserFindByIdQuery),
      );
      expect(updateLastLoginAtSpy).toHaveBeenCalled();
      expect(mockAuthWriteRepository.save).toHaveBeenCalledWith(mockAuth);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(commitSpy).toHaveBeenCalled();
      expect(mockJwtAuthService.generateTokenPair).toHaveBeenCalledWith({
        id: authId,
        userId: userId,
        email: email,
        username: 'johndoe',
        role: UserRoleEnum.USER,
      });

      updateLastLoginAtSpy.mockRestore();
      commitSpy.mockRestore();
      getUncommittedEventsSpy.mockRestore();
    });

    it('should throw UnauthorizedException when auth has no password', async () => {
      const email = 'test@example.com';
      const password = 'SecurePass123!';
      const now = new Date();

      const command = new AuthLoginByEmailCommand({ email, password });

      const mockAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          userId: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174001'),
          email: new AuthEmailValueObject(email),
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

      mockAssertAuthEmailExistsService.execute.mockResolvedValue(mockAuth);

      await expect(handler.execute(command)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockPasswordHashingService.verifyPassword).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password verification fails', async () => {
      const email = 'test@example.com';
      const password = 'SecurePass123!';
      const hashedPassword =
        '$2b$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789012345678901234567890';
      const now = new Date();

      const command = new AuthLoginByEmailCommand({ email, password });

      const mockAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          userId: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174001'),
          email: new AuthEmailValueObject(email),
          emailVerified: new AuthEmailVerifiedValueObject(false),
          lastLoginAt: null,
          password: new AuthPasswordValueObject(hashedPassword),
          phoneNumber: null,
          provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
          providerId: null,
          twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
          createdAt: new AuthCreatedAtValueObject(now),
          updatedAt: new AuthUpdatedAtValueObject(now),
        },
        false,
      );

      mockAssertAuthEmailExistsService.execute.mockResolvedValue(mockAuth);
      mockPasswordHashingService.verifyPassword.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(handler.execute(command)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockQueryBus.execute).not.toHaveBeenCalled();
      expect(mockAuthWriteRepository.save).not.toHaveBeenCalled();
    });
  });
});

