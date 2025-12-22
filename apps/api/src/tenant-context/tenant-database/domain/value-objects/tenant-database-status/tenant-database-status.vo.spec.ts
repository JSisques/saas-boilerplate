import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('TenantDatabaseStatusValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantDatabaseStatusValueObject with PROVISIONING status', () => {
      const status = new TenantDatabaseStatusValueObject(
        TenantDatabaseStatusEnum.PROVISIONING,
      );
      expect(status.value).toBe(TenantDatabaseStatusEnum.PROVISIONING);
    });

    it('should create a valid TenantDatabaseStatusValueObject with ACTIVE status', () => {
      const status = new TenantDatabaseStatusValueObject(
        TenantDatabaseStatusEnum.ACTIVE,
      );
      expect(status.value).toBe(TenantDatabaseStatusEnum.ACTIVE);
    });

    it('should create a valid TenantDatabaseStatusValueObject with MIGRATING status', () => {
      const status = new TenantDatabaseStatusValueObject(
        TenantDatabaseStatusEnum.MIGRATING,
      );
      expect(status.value).toBe(TenantDatabaseStatusEnum.MIGRATING);
    });

    it('should create a valid TenantDatabaseStatusValueObject with FAILED status', () => {
      const status = new TenantDatabaseStatusValueObject(
        TenantDatabaseStatusEnum.FAILED,
      );
      expect(status.value).toBe(TenantDatabaseStatusEnum.FAILED);
    });

    it('should create a valid TenantDatabaseStatusValueObject with SUSPENDED status', () => {
      const status = new TenantDatabaseStatusValueObject(
        TenantDatabaseStatusEnum.SUSPENDED,
      );
      expect(status.value).toBe(TenantDatabaseStatusEnum.SUSPENDED);
    });

    it('should throw InvalidEnumValueException for empty string', () => {
      expect(() => {
        new TenantDatabaseStatusValueObject('' as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for string with only whitespace', () => {
      expect(() => {
        new TenantDatabaseStatusValueObject('   ' as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for invalid status value', () => {
      expect(() => {
        new TenantDatabaseStatusValueObject('INVALID_STATUS' as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for null value', () => {
      expect(() => {
        new TenantDatabaseStatusValueObject(null as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for undefined value', () => {
      expect(() => {
        new TenantDatabaseStatusValueObject(undefined as any);
      }).toThrow(InvalidEnumValueException);
    });
  });

  describe('equals', () => {
    it('should return true for equal statuses', () => {
      const status1 = new TenantDatabaseStatusValueObject(
        TenantDatabaseStatusEnum.ACTIVE,
      );
      const status2 = new TenantDatabaseStatusValueObject(
        TenantDatabaseStatusEnum.ACTIVE,
      );
      expect(status1.equals(status2)).toBe(true);
    });

    it('should return false for different statuses', () => {
      const status1 = new TenantDatabaseStatusValueObject(
        TenantDatabaseStatusEnum.ACTIVE,
      );
      const status2 = new TenantDatabaseStatusValueObject(
        TenantDatabaseStatusEnum.FAILED,
      );
      expect(status1.equals(status2)).toBe(false);
    });
  });

  describe('inherited methods from EnumValueObject', () => {
    it('should check if value is valid enum', () => {
      const status = new TenantDatabaseStatusValueObject(
        TenantDatabaseStatusEnum.ACTIVE,
      );
      expect(status.value).toBe(TenantDatabaseStatusEnum.ACTIVE);
    });

    it('should return all valid enum values', () => {
      const status = new TenantDatabaseStatusValueObject(
        TenantDatabaseStatusEnum.ACTIVE,
      );
      // EnumValueObject should have access to enum values through enumObject
      expect(Object.values(TenantDatabaseStatusEnum)).toContain(status.value);
    });
  });
});
