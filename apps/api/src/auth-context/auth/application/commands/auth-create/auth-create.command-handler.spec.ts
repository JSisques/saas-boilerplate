import { AuthCreateCommandHandler } from '@/auth-context/auth/application/commands/auth-create/auth-create.command-handler';
import { PasswordHashingService } from '@/auth-context/auth/application/services/password-hashing/password-hashing.service';
import { AuthAggregateFactory } from '@/auth-context/auth/domain/factories/auth-aggregate/auth-aggregate.factory';
import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthWriteRepository } from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { AuthCreateCommand } from './auth-create.command';

describe('AuthCreateCommandHandler', () => {
  let handler: AuthCreateCommandHandler;
  let mockAuthWriteRepository: jest.Mocked<AuthWriteRepository>;
  let mockAuthAggregateFactory: jest.Mocked<AuthAggregateFactory>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockPasswordHashingService: jest.Mocked<PasswordHashingService>;

  const authId = '123e4567-e89b-12d3-a456-426614174000';
  const userId = '123e4567-e89b-12d3-a456-426614174001';
  const hashedPassword =
    '$2b$12$hashedpassword1234567890123456789012345678901234567890123456789012';

  beforeEach(() => {
    mockAuthWriteRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthWriteRepository>;

    mockAuthAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<AuthAggregateFactory>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockPasswordHashingService = {
      hashPassword: jest.fn(),
      verifyPassword: jest.fn(),
      isValidHash: jest.fn(),
      getCostFactor: jest.fn(),
      setCostFactor: jest.fn(),
    } as unknown as jest.Mocked<PasswordHashingService>;

    handler = new AuthCreateCommandHandler(
      mockAuthWriteRepository,
      mockAuthAggregateFactory,
      mockEventBus,
      mockPasswordHashingService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create auth successfully with password', async () => {
      const password = 'SecurePass123!';
      const command = new AuthCreateCommand({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        password: password,
        emailVerified: false,
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        lastLoginAt: null,
      });

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
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      const commitSpy = jest.spyOn(mockAuth, 'commit');
      const getUncommittedEventsSpy = jest
        .spyOn(mockAuth, 'getUncommittedEvents')
        .mockReturnValue([]);

      mockPasswordHashingService.hashPassword.mockResolvedValue(hashedPassword);
      mockAuthAggregateFactory.create.mockReturnValue(mockAuth);
      mockAuthWriteRepository.save.mockResolvedValue(mockAuth);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(authId);
      expect(mockPasswordHashingService.hashPassword).toHaveBeenCalledWith(
        expect.objectContaining({ value: password }),
      );
      expect(mockPasswordHashingService.hashPassword).toHaveBeenCalledTimes(1);
      expect(mockAuthAggregateFactory.create).toHaveBeenCalled();
      expect(mockAuthWriteRepository.save).toHaveBeenCalledWith(mockAuth);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(commitSpy).toHaveBeenCalled();

      commitSpy.mockRestore();
      getUncommittedEventsSpy.mockRestore();
    });

    it('should create auth successfully without password', async () => {
      const command = new AuthCreateCommand({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        password: null,
        emailVerified: false,
        phoneNumber: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: false,
        lastLoginAt: null,
      });

      const mockAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(userId),
          email: new AuthEmailValueObject('test@example.com'),
          emailVerified: new AuthEmailVerifiedValueObject(false),
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: new AuthProviderValueObject(AuthProviderEnum.GOOGLE),
          providerId: null,
          twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      const commitSpy = jest.spyOn(mockAuth, 'commit');
      const getUncommittedEventsSpy = jest
        .spyOn(mockAuth, 'getUncommittedEvents')
        .mockReturnValue([]);

      mockAuthAggregateFactory.create.mockReturnValue(mockAuth);
      mockAuthWriteRepository.save.mockResolvedValue(mockAuth);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(authId);
      expect(mockPasswordHashingService.hashPassword).not.toHaveBeenCalled();
      expect(mockAuthAggregateFactory.create).toHaveBeenCalled();
      expect(mockAuthWriteRepository.save).toHaveBeenCalledWith(mockAuth);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(commitSpy).toHaveBeenCalled();

      commitSpy.mockRestore();
      getUncommittedEventsSpy.mockRestore();
    });

    it('should hash password before creating auth aggregate', async () => {
      const password = 'SecurePass123!';
      const command = new AuthCreateCommand({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        password: password,
        emailVerified: false,
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        lastLoginAt: null,
      });

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
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      const getUncommittedEventsSpy = jest
        .spyOn(mockAuth, 'getUncommittedEvents')
        .mockReturnValue([]);

      mockPasswordHashingService.hashPassword.mockResolvedValue(hashedPassword);
      mockAuthAggregateFactory.create.mockReturnValue(mockAuth);
      mockAuthWriteRepository.save.mockResolvedValue(mockAuth);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      // Verify password is hashed before aggregate creation
      const hashOrder =
        mockPasswordHashingService.hashPassword.mock.invocationCallOrder[0];
      const createOrder = (mockAuthAggregateFactory.create as jest.Mock).mock
        .invocationCallOrder[0];
      expect(hashOrder).toBeLessThan(createOrder);

      getUncommittedEventsSpy.mockRestore();
    });

    it('should publish events before committing', async () => {
      const command = new AuthCreateCommand({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        password: null,
        emailVerified: false,
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        lastLoginAt: null,
      });

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
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      const commitSpy = jest.spyOn(mockAuth, 'commit');
      const getUncommittedEventsSpy = jest
        .spyOn(mockAuth, 'getUncommittedEvents')
        .mockReturnValue([]);

      mockAuthAggregateFactory.create.mockReturnValue(mockAuth);
      mockAuthWriteRepository.save.mockResolvedValue(mockAuth);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      const commitOrder = commitSpy.mock.invocationCallOrder[0];
      expect(publishOrder).toBeLessThan(commitOrder);

      commitSpy.mockRestore();
      getUncommittedEventsSpy.mockRestore();
    });

    it('should save auth to repository before publishing events', async () => {
      const command = new AuthCreateCommand({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        password: null,
        emailVerified: false,
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        lastLoginAt: null,
      });

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
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      const getUncommittedEventsSpy = jest
        .spyOn(mockAuth, 'getUncommittedEvents')
        .mockReturnValue([]);

      mockAuthAggregateFactory.create.mockReturnValue(mockAuth);
      mockAuthWriteRepository.save.mockResolvedValue(mockAuth);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockAuthWriteRepository.save.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(saveOrder).toBeLessThan(publishOrder);

      getUncommittedEventsSpy.mockRestore();
    });

    it('should use hashed password in aggregate when password is provided', async () => {
      const password = 'SecurePass123!';
      const command = new AuthCreateCommand({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        password: password,
        emailVerified: false,
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        lastLoginAt: null,
      });

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
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      const getUncommittedEventsSpy = jest
        .spyOn(mockAuth, 'getUncommittedEvents')
        .mockReturnValue([]);

      mockPasswordHashingService.hashPassword.mockResolvedValue(hashedPassword);
      mockAuthAggregateFactory.create.mockReturnValue(mockAuth);
      mockAuthWriteRepository.save.mockResolvedValue(mockAuth);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      // Verify that create was called with hashed password
      const createCall = mockAuthAggregateFactory.create.mock.calls[0][0];
      expect(createCall.password).toBeDefined();
      expect(createCall.password?.value).toBe(hashedPassword);

      getUncommittedEventsSpy.mockRestore();
    });
  });
});
