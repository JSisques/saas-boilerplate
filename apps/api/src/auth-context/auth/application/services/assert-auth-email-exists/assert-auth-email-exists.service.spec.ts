import { AuthNotFoundByEmailException } from '@/auth-context/auth/application/exceptions/auth-not-found-by-email/auth-not-found-by-email.exception';
import { AssertAuthEmailExistsService } from '@/auth-context/auth/application/services/assert-auth-email-exists/assert-auth-email-exists.service';
import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthWriteRepository } from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

describe('AssertAuthEmailExistsService', () => {
  let service: AssertAuthEmailExistsService;
  let mockAuthWriteRepository: jest.Mocked<AuthWriteRepository>;

  beforeEach(() => {
    mockAuthWriteRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthWriteRepository>;

    service = new AssertAuthEmailExistsService(mockAuthWriteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return auth aggregate when auth exists by email', async () => {
      const email = 'test@example.com';
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

      const result = await service.execute(email);

      expect(result).toBe(mockAuth);
      expect(mockAuthWriteRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockAuthWriteRepository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw AuthNotFoundByEmailException when auth does not exist', async () => {
      const email = 'nonexistent@example.com';

      mockAuthWriteRepository.findByEmail.mockResolvedValue(null);

      await expect(service.execute(email)).rejects.toThrow(
        AuthNotFoundByEmailException,
      );
      expect(mockAuthWriteRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockAuthWriteRepository.findByEmail).toHaveBeenCalledTimes(1);
    });
  });
});
