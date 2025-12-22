import { TenantDatabaseLastMigrationAtValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-last-migration-at/tenant-database-last-migration-at.vo';
import { InvalidDateException } from '@/shared/domain/exceptions/value-objects/invalid-date/invalid-date.exception';

describe('TenantDatabaseLastMigrationAtValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantDatabaseLastMigrationAtValueObject with a valid date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const lastMigrationAt = new TenantDatabaseLastMigrationAtValueObject(
        date,
      );
      expect(lastMigrationAt.value).toEqual(date);
    });

    it('should create a valid TenantDatabaseLastMigrationAtValueObject with current date', () => {
      const date = new Date();
      const lastMigrationAt = new TenantDatabaseLastMigrationAtValueObject(
        date,
      );
      expect(lastMigrationAt.value).toEqual(date);
    });

    it('should create a valid TenantDatabaseLastMigrationAtValueObject with past date', () => {
      const date = new Date('2020-01-01T10:00:00Z');
      const lastMigrationAt = new TenantDatabaseLastMigrationAtValueObject(
        date,
      );
      expect(lastMigrationAt.value).toEqual(date);
    });

    it('should create a valid TenantDatabaseLastMigrationAtValueObject with future date', () => {
      const date = new Date('2030-01-01T10:00:00Z');
      const lastMigrationAt = new TenantDatabaseLastMigrationAtValueObject(
        date,
      );
      expect(lastMigrationAt.value).toEqual(date);
    });

    it('should throw InvalidDateException for invalid date string', () => {
      expect(() => {
        new TenantDatabaseLastMigrationAtValueObject('invalid-date' as any);
      }).toThrow(InvalidDateException);
    });

    it('should throw InvalidDateException for null value', () => {
      expect(() => {
        new TenantDatabaseLastMigrationAtValueObject(null as any);
      }).toThrow(InvalidDateException);
    });

    it('should throw InvalidDateException for undefined value', () => {
      expect(() => {
        new TenantDatabaseLastMigrationAtValueObject(undefined as any);
      }).toThrow(InvalidDateException);
    });

    it('should throw InvalidDateException for invalid date object', () => {
      expect(() => {
        new TenantDatabaseLastMigrationAtValueObject(
          new Date('invalid') as any,
        );
      }).toThrow(InvalidDateException);
    });
  });

  describe('equals', () => {
    it('should return true for equal dates', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const lastMigrationAt1 = new TenantDatabaseLastMigrationAtValueObject(
        date,
      );
      const lastMigrationAt2 = new TenantDatabaseLastMigrationAtValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );
      expect(lastMigrationAt1.equals(lastMigrationAt2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const lastMigrationAt1 = new TenantDatabaseLastMigrationAtValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );
      const lastMigrationAt2 = new TenantDatabaseLastMigrationAtValueObject(
        new Date('2024-01-02T10:00:00Z'),
      );
      expect(lastMigrationAt1.equals(lastMigrationAt2)).toBe(false);
    });
  });

  describe('inherited methods from DateValueObject', () => {
    it('should return correct ISO string', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const lastMigrationAt = new TenantDatabaseLastMigrationAtValueObject(
        date,
      );
      expect(lastMigrationAt.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    });

    it('should compare dates for equality', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const lastMigrationAt1 = new TenantDatabaseLastMigrationAtValueObject(
        date,
      );
      const lastMigrationAt2 = new TenantDatabaseLastMigrationAtValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );
      expect(lastMigrationAt1.equals(lastMigrationAt2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const lastMigrationAt1 = new TenantDatabaseLastMigrationAtValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );
      const lastMigrationAt2 = new TenantDatabaseLastMigrationAtValueObject(
        new Date('2024-01-02T10:00:00Z'),
      );
      expect(lastMigrationAt1.equals(lastMigrationAt2)).toBe(false);
    });
  });
});
