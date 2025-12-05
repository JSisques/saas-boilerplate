import { AuthRegisterByEmailCommandHandler } from '@/auth-context/auth/application/commands/auth-register-by-email/auth-register-by-email.command-handler';
import { AuthRegistrationSaga } from '@/auth-context/auth/application/sagas/auth-registration/auth-registration.saga';
import { AssertAuthEmailNotExistsService } from '@/auth-context/auth/application/services/assert-auth-email-not-exists/assert-auth-email-not-exists.service';
import { AuthRegisterByEmailCommand } from './auth-register-by-email.command';

describe('AuthRegisterByEmailCommandHandler', () => {
  let handler: AuthRegisterByEmailCommandHandler;
  let mockAssertAuthEmailNotExistsService: jest.Mocked<AssertAuthEmailNotExistsService>;
  let mockAuthRegistrationSaga: jest.Mocked<AuthRegistrationSaga>;

  beforeEach(() => {
    mockAssertAuthEmailNotExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertAuthEmailNotExistsService>;

    mockAuthRegistrationSaga = {
      handle: jest.fn(),
    } as unknown as jest.Mocked<AuthRegistrationSaga>;

    handler = new AuthRegisterByEmailCommandHandler(
      mockAssertAuthEmailNotExistsService,
      mockAuthRegistrationSaga,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should register auth successfully', async () => {
      const email = 'test@example.com';
      const password = 'SecurePass123!';

      const command = new AuthRegisterByEmailCommand({ email, password });

      mockAssertAuthEmailNotExistsService.execute.mockResolvedValue(undefined);
      mockAuthRegistrationSaga.handle.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(mockAssertAuthEmailNotExistsService.execute).toHaveBeenCalledWith(
        email,
      );
      expect(mockAuthRegistrationSaga.handle).toHaveBeenCalled();
    });

    it('should throw error when email already exists', async () => {
      const email = 'existing@example.com';
      const password = 'SecurePass123!';

      const command = new AuthRegisterByEmailCommand({ email, password });

      const error = new Error('Email already exists');
      mockAssertAuthEmailNotExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAuthRegistrationSaga.handle).not.toHaveBeenCalled();
    });
  });
});
