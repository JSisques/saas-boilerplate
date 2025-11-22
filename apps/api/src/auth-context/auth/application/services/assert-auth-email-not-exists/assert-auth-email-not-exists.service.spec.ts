import { AuthEmailAlreadyExistsException } from '@/auth-context/auth/application/exceptions/auth-email-already-exists/auth-email-already-exists.exception';
import { AssertAuthEmailNotExistsService } from '@/auth-context/auth/application/services/assert-auth-email-not-exists/assert-auth-email-not-exists.service';
import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthWriteRepository } from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

describe('AssertAuthEmailNotExistsService', () => {
  let service: AssertAuthEmailNotExistsService;
  let mockAuthWriteRepository: jest.Mocked<AuthWriteRepository>;

  beforeEach(() => {
    mockAuthWriteRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthWriteRepository>;

    service = new AssertAuthEmailNotExistsService(mockAuthWriteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should not throw when auth email does not exist', async () => {
      const email = 'new@example.com';

      mockAuthWriteRepository.findByEmail.mockResolvedValue(null);

      await expect(service.execute(email)).resolves.toBeUndefined();
      expect(mockAuthWriteRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockAuthWriteRepository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw AuthEmailAlreadyExistsException when auth email exists', async () => {
      const email = 'existing@example.com';
      const mockAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject(),
          userId: new UserUuidValueObject(),
          email: new AuthEmailValueObject(email),
          emailVerified: null as any,
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: null as any,
          providerId: null,
          twoFactorEnabled: null as any,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockAuthWriteRepository.findByEmail.mockResolvedValue(mockAuth);

      await expect(service.execute(email)).rejects.toThrow(
        AuthEmailAlreadyExistsException,
      );
      expect(mockAuthWriteRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockAuthWriteRepository.findByEmail).toHaveBeenCalledTimes(1);
    });
  });
});
