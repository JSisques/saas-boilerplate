import { AuthRegisterByEmailCommandHandler } from '@/auth-context/auth/application/commands/auth-register-by-email/auth-register-by-email.command-handler';
import { AssertAuthEmailNotExistsService } from '@/auth-context/auth/application/services/assert-auth-email-not-exists/assert-auth-email-not-exists.service';
import { PasswordHashingService } from '@/auth-context/auth/application/services/password-hashing/password-hashing.service';
import { AuthAggregateFactory } from '@/auth-context/auth/domain/factories/auth-aggregate/auth-aggregate.factory';
import { AuthWriteRepository } from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { UserCreateCommand } from '@/user-context/users/application/commands/user-create/user-create.command';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { AuthRegisterByEmailCommand } from './auth-register-by-email.command';

describe('AuthRegisterByEmailCommandHandler', () => {
  let handler: AuthRegisterByEmailCommandHandler;
  let mockAuthWriteRepository: jest.Mocked<AuthWriteRepository>;
  let mockAuthAggregateFactory: jest.Mocked<AuthAggregateFactory>;
  let mockPasswordHashingService: jest.Mocked<PasswordHashingService>;
  let mockAssertAuthEmailNotExistsService: jest.Mocked<AssertAuthEmailNotExistsService>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockCommandBus: jest.Mocked<CommandBus>;

  beforeEach(() => {
    mockAuthWriteRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthWriteRepository>;

    mockAuthAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<AuthAggregateFactory>;

    mockPasswordHashingService = {
      hashPassword: jest.fn(),
      verifyPassword: jest.fn(),
      isValidHash: jest.fn(),
      getCostFactor: jest.fn(),
      setCostFactor: jest.fn(),
    } as unknown as jest.Mocked<PasswordHashingService>;

    mockAssertAuthEmailNotExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertAuthEmailNotExistsService>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    handler = new AuthRegisterByEmailCommandHandler(
      mockAuthWriteRepository,
      mockAuthAggregateFactory,
      mockPasswordHashingService,
      mockAssertAuthEmailNotExistsService,
      mockEventBus,
      mockCommandBus,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should register auth successfully', async () => {
      const email = 'test@example.com';
      const password = 'SecurePass123!';
      const hashedPassword =
        '$2b$12$hashedpassword1234567890123456789012345678901234567890123456789012';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const authId = '123e4567-e89b-12d3-a456-426614174000';

      const command = new AuthRegisterByEmailCommand({ email, password });

      const mockAuth = {
        id: { value: authId },
        commit: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([]),
      } as any;

      mockAssertAuthEmailNotExistsService.execute.mockResolvedValue(undefined);
      mockCommandBus.execute.mockResolvedValue(userId);
      mockPasswordHashingService.hashPassword.mockResolvedValue(hashedPassword);
      mockAuthAggregateFactory.create.mockReturnValue(mockAuth);
      mockAuthWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(authId);
      expect(mockAssertAuthEmailNotExistsService.execute).toHaveBeenCalledWith(
        email,
      );
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(UserCreateCommand),
      );
      expect(mockPasswordHashingService.hashPassword).toHaveBeenCalledWith(
        command.password,
      );
      expect(mockAuthAggregateFactory.create).toHaveBeenCalled();
      expect(mockAuthWriteRepository.save).toHaveBeenCalledWith(mockAuth);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockAuth.commit).toHaveBeenCalled();
    });

    it('should throw error when email already exists', async () => {
      const email = 'existing@example.com';
      const password = 'SecurePass123!';

      const command = new AuthRegisterByEmailCommand({ email, password });

      const error = new Error('Email already exists');
      mockAssertAuthEmailNotExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockCommandBus.execute).not.toHaveBeenCalled();
      expect(mockPasswordHashingService.hashPassword).not.toHaveBeenCalled();
      expect(mockAuthAggregateFactory.create).not.toHaveBeenCalled();
    });
  });
});
