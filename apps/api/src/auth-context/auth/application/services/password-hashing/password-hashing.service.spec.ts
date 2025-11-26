import { InvalidHashFormatException } from '@/auth-context/auth/application/exceptions/auth-invalid-hash-format/auth-invalid-hash-format.exception';
import { InvalidSaltRoundsException } from '@/auth-context/auth/application/exceptions/auth-invalid-salt-rounds/auth-invalid-salt-rounds.exception';
import { PasswordHashingFailedException } from '@/auth-context/auth/application/exceptions/password-hashing-failed/password-hashing-failed.exception';
import { PasswordVerificationFailedException } from '@/auth-context/auth/application/exceptions/password-verification-failed/password-verification-failed.exception';
import { PasswordHashingService } from '@/auth-context/auth/application/services/password-hashing/password-hashing.service';
import { PasswordValueObject } from '@/shared/domain/value-objects/password/password.vo';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('PasswordHashingService', () => {
  let service: PasswordHashingService;
  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    service = new PasswordHashingService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = new PasswordValueObject('12345678');
      const expectedHash = '$2b$12$hashedpassword';

      mockedBcrypt.genSalt.mockResolvedValue('$2b$12$salt' as never);
      mockedBcrypt.hash.mockResolvedValue(expectedHash as never);

      const result = await service.hashPassword(password);

      expect(result).toBe(expectedHash);
      expect(mockedBcrypt.genSalt).toHaveBeenCalledWith(12);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(
        password.value,
        '$2b$12$salt',
      );
    });

    it('should throw PasswordHashingFailedException when hashing fails', async () => {
      const password = new PasswordValueObject('12345678');

      mockedBcrypt.genSalt.mockRejectedValue(
        new Error('Hashing failed') as never,
      );

      await expect(service.hashPassword(password)).rejects.toThrow(
        PasswordHashingFailedException,
      );
    });
  });

  describe('verifyPassword', () => {
    it('should verify password successfully when password matches', async () => {
      const password = new PasswordValueObject('12345678');
      // Valid bcrypt hash format: $2b$12$[22 chars salt][31 chars hash]
      const hash =
        '$2b$12$f.uS4i5hWbySoAtmAttAcuOxmYt1ELkFws0J7C48/iZnjqxAx32Ci';

      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.verifyPassword(password, hash);

      expect(result).toBe(true);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password.value, hash);
    });

    it('should throw InvalidHashFormatException for invalid hash format', async () => {
      const password = new PasswordValueObject('12345678');
      const invalidHash = 'invalid-hash';

      await expect(
        service.verifyPassword(password, invalidHash),
      ).rejects.toThrow(InvalidHashFormatException);
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw PasswordVerificationFailedException when password does not match', async () => {
      const password = new PasswordValueObject('12345678');
      // Valid bcrypt hash format
      const hash =
        '$2b$12$f.uS4i5hWbySoAtmAttAcuOxmYt1ELkFws0J7C48/iZnjqxAx32Ci';

      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(service.verifyPassword(password, hash)).rejects.toThrow(
        PasswordVerificationFailedException,
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password.value, hash);
    });

    it('should throw PasswordVerificationFailedException when verification fails', async () => {
      const password = new PasswordValueObject('12345678');
      // Valid bcrypt hash format
      const hash =
        '$2b$12$f.uS4i5hWbySoAtmAttAcuOxmYt1ELkFws0J7C48/iZnjqxAx32Ci';

      mockedBcrypt.compare.mockRejectedValue(
        new Error('Verification failed') as never,
      );

      await expect(service.verifyPassword(password, hash)).rejects.toThrow(
        PasswordVerificationFailedException,
      );
    });
  });

  describe('isValidHash', () => {
    it('should return true for valid bcrypt hash', () => {
      // Valid bcrypt hash format: $2b$12$[22 chars salt][31 chars hash]
      const validHash =
        '$2b$12$f.uS4i5hWbySoAtmAttAcuOxmYt1ELkFws0J7C48/iZnjqxAx32Ci';

      const result = service.isValidHash(validHash);

      expect(result).toBe(true);
    });

    it('should return false for invalid hash format', () => {
      const invalidHash = 'invalid-hash';

      const result = service.isValidHash(invalidHash);

      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const result = service.isValidHash('');

      expect(result).toBe(false);
    });

    it('should return false for non-string value', () => {
      const result = service.isValidHash(null as any);

      expect(result).toBe(false);
    });
  });

  describe('getCostFactor', () => {
    it('should return the current salt rounds', () => {
      const result = service.getCostFactor();

      expect(result).toBe(12);
    });
  });

  describe('setCostFactor', () => {
    it('should update the cost factor with valid rounds', () => {
      service.setCostFactor(10);

      expect(service.getCostFactor()).toBe(10);
    });

    it('should throw InvalidSaltRoundsException for rounds less than 4', () => {
      expect(() => service.setCostFactor(3)).toThrow(
        InvalidSaltRoundsException,
      );
    });

    it('should throw InvalidSaltRoundsException for rounds greater than 31', () => {
      expect(() => service.setCostFactor(32)).toThrow(
        InvalidSaltRoundsException,
      );
    });
  });
});
