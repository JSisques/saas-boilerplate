import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';

describe('UserRoleValueObject', () => {
  describe('constructor', () => {
    it('should create a valid UserRoleValueObject with ADMIN role', () => {
      const role = new UserRoleValueObject(UserRoleEnum.ADMIN);
      expect(role.value).toBe(UserRoleEnum.ADMIN);
    });

    it('should create a valid UserRoleValueObject with USER role', () => {
      const role = new UserRoleValueObject(UserRoleEnum.USER);
      expect(role.value).toBe(UserRoleEnum.USER);
    });

    it('should throw InvalidEnumValueException for empty string', () => {
      expect(() => {
        new UserRoleValueObject('');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for string with only whitespace', () => {
      expect(() => {
        new UserRoleValueObject('   ');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for invalid role', () => {
      expect(() => {
        new UserRoleValueObject('INVALID_ROLE' as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for null value', () => {
      expect(() => {
        new UserRoleValueObject(null as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for undefined value', () => {
      expect(() => {
        new UserRoleValueObject(undefined as any);
      }).toThrow(InvalidEnumValueException);
    });
  });

  describe('equals', () => {
    it('should return true for equal roles', () => {
      const role1 = new UserRoleValueObject(UserRoleEnum.ADMIN);
      const role2 = new UserRoleValueObject(UserRoleEnum.ADMIN);
      expect(role1.equals(role2)).toBe(true);
    });

    it('should return false for different roles', () => {
      const role1 = new UserRoleValueObject(UserRoleEnum.ADMIN);
      const role2 = new UserRoleValueObject(UserRoleEnum.USER);
      expect(role1.equals(role2)).toBe(false);
    });
  });

  describe('inherited methods from EnumValueObject', () => {
    it('should return the correct value', () => {
      const role = new UserRoleValueObject(UserRoleEnum.USER);
      expect(role.value).toBe('USER');
    });

    it('should validate enum values correctly', () => {
      const adminRole = new UserRoleValueObject(UserRoleEnum.ADMIN);
      expect(adminRole.value).toBe('ADMIN');

      const userRole = new UserRoleValueObject(UserRoleEnum.USER);
      expect(userRole.value).toBe('USER');
    });
  });
});
