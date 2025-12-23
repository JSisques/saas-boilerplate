import { TenantMaxStorageValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-max-storage/tenant-max-storage.vo';
import { NumberValueObject } from '@/shared/domain/value-objects/number/number.vo';

describe('TenantMaxStorageValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantMaxStorageValueObject', () => {
      const maxStorage = new TenantMaxStorageValueObject(1000);
      expect(maxStorage).toBeInstanceOf(TenantMaxStorageValueObject);
      expect(maxStorage).toBeInstanceOf(NumberValueObject);
      expect(maxStorage.value).toBe(1000);
    });

    it('should create a TenantMaxStorageValueObject with minimum value', () => {
      const maxStorage = new TenantMaxStorageValueObject(0);
      expect(maxStorage.value).toBe(0);
    });

    it('should create a TenantMaxStorageValueObject with maximum value', () => {
      const maxStorage = new TenantMaxStorageValueObject(1000000000);
      expect(maxStorage.value).toBe(1000000000);
    });

    it('should throw error for value below minimum', () => {
      expect(() => {
        new TenantMaxStorageValueObject(-1);
      }).toThrow();
    });

    it('should throw error for value above maximum', () => {
      expect(() => {
        new TenantMaxStorageValueObject(1000000001);
      }).toThrow();
    });

    it('should throw error for decimal values', () => {
      expect(() => {
        new TenantMaxStorageValueObject(1000.5);
      }).toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for equal values', () => {
      const maxStorage1 = new TenantMaxStorageValueObject(1000);
      const maxStorage2 = new TenantMaxStorageValueObject(1000);
      expect(maxStorage1.equals(maxStorage2)).toBe(true);
    });

    it('should return false for different values', () => {
      const maxStorage1 = new TenantMaxStorageValueObject(1000);
      const maxStorage2 = new TenantMaxStorageValueObject(2000);
      expect(maxStorage1.equals(maxStorage2)).toBe(false);
    });
  });
});
