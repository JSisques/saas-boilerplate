import { AuthNotFoundException } from '@/auth-context/auth/application/exceptions/auth-not-found/auth-not-found.exception';
import { AssertAuthExistsService } from '@/auth-context/auth/application/services/assert-auth-exsists/assert-auth-exsists.service';
import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
import { AuthWriteRepository } from '@/auth-context/auth/domain/repositories/auth-write.repository';
import { AuthCreatedAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-created-at/auth-created-at.vo';
import { AuthUpdatedAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-updated-at/auth-updated-at.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

describe('AssertAuthExistsService', () => {
  let service: AssertAuthExistsService;
  let mockAuthWriteRepository: jest.Mocked<AuthWriteRepository>;

  beforeEach(() => {
    mockAuthWriteRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthWriteRepository>;

    service = new AssertAuthExistsService(mockAuthWriteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return auth aggregate when auth exists by id', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const mockAuth = new AuthAggregate(
        {
          id: new AuthUuidValueObject(authId),
          userId: new UserUuidValueObject(),
          email: null,
          emailVerified: null as any,
          lastLoginAt: null,
          password: null,
          phoneNumber: null,
          provider: null as any,
          providerId: null,
          twoFactorEnabled: null as any,
          createdAt: new AuthCreatedAtValueObject(new Date()),
          updatedAt: new AuthUpdatedAtValueObject(new Date()),
        },
        false,
      );

      mockAuthWriteRepository.findById.mockResolvedValue(mockAuth);

      const result = await service.execute(authId);

      expect(result).toBe(mockAuth);
      expect(mockAuthWriteRepository.findById).toHaveBeenCalledWith(authId);
      expect(mockAuthWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw AuthNotFoundException when auth does not exist', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';

      mockAuthWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(authId)).rejects.toThrow(
        AuthNotFoundException,
      );
      expect(mockAuthWriteRepository.findById).toHaveBeenCalledWith(authId);
      expect(mockAuthWriteRepository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
