import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';

describe('UserStatusValueObject', () => {
  describe('constructor', () => {
    it('should create a valid UserStatusValueObject with ACTIVE status', () => {
      const status = new UserStatusValueObject(UserStatusEnum.ACTIVE);
      expect(status.value).toBe(UserStatusEnum.ACTIVE);
    });

    it('should create a valid UserStatusValueObject with INACTIVE status', () => {
      const status = new UserStatusValueObject(UserStatusEnum.INACTIVE);
      expect(status.value).toBe(UserStatusEnum.INACTIVE);
    });

    it('should create a valid UserStatusValueObject with BLOCKED status', () => {
      const status = new UserStatusValueObject(UserStatusEnum.BLOCKED);
      expect(status.value).toBe(UserStatusEnum.BLOCKED);
    });

    it('should throw InvalidEnumValueException for empty string', () => {
      expect(() => {
        new UserStatusValueObject('');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for string with only whitespace', () => {
      expect(() => {
        new UserStatusValueObject('   ');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for invalid status', () => {
      expect(() => {
        new UserStatusValueObject('INVALID_STATUS' as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for null value', () => {
      expect(() => {
        new UserStatusValueObject(null as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for undefined value', () => {
      expect(() => {
        new UserStatusValueObject(undefined as any);
      }).toThrow(InvalidEnumValueException);
    });
  });

  describe('equals', () => {
    it('should return true for equal statuses', () => {
      const status1 = new UserStatusValueObject(UserStatusEnum.ACTIVE);
      const status2 = new UserStatusValueObject(UserStatusEnum.ACTIVE);
      expect(status1.equals(status2)).toBe(true);
    });

    it('should return false for different statuses', () => {
      const status1 = new UserStatusValueObject(UserStatusEnum.ACTIVE);
      const status2 = new UserStatusValueObject(UserStatusEnum.INACTIVE);
      expect(status1.equals(status2)).toBe(false);
    });

    it('should return false for ACTIVE vs BLOCKED', () => {
      const status1 = new UserStatusValueObject(UserStatusEnum.ACTIVE);
      const status2 = new UserStatusValueObject(UserStatusEnum.BLOCKED);
      expect(status1.equals(status2)).toBe(false);
    });
  });

  describe('inherited methods from EnumValueObject', () => {
    it('should return the correct value', () => {
      const status = new UserStatusValueObject(UserStatusEnum.ACTIVE);
      expect(status.value).toBe('ACTIVE');
    });

    it('should validate enum values correctly for all statuses', () => {
      const activeStatus = new UserStatusValueObject(UserStatusEnum.ACTIVE);
      expect(activeStatus.value).toBe('ACTIVE');

      const inactiveStatus = new UserStatusValueObject(UserStatusEnum.INACTIVE);
      expect(inactiveStatus.value).toBe('INACTIVE');

      const blockedStatus = new UserStatusValueObject(UserStatusEnum.BLOCKED);
      expect(blockedStatus.value).toBe('BLOCKED');
    });
  });
});
