import { TenantMaxUsersValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-max-users/tenant-max-users.vo';
import { NumberValueObject } from '@/shared/domain/value-objects/number/number.vo';

describe('TenantMaxUsersValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantMaxUsersValueObject', () => {
      const maxUsers = new TenantMaxUsersValueObject(100);
      expect(maxUsers).toBeInstanceOf(TenantMaxUsersValueObject);
      expect(maxUsers).toBeInstanceOf(NumberValueObject);
      expect(maxUsers.value).toBe(100);
    });

    it('should create a TenantMaxUsersValueObject with minimum value', () => {
      const maxUsers = new TenantMaxUsersValueObject(1);
      expect(maxUsers.value).toBe(1);
    });

    it('should create a TenantMaxUsersValueObject with maximum value', () => {
      const maxUsers = new TenantMaxUsersValueObject(1000000);
      expect(maxUsers.value).toBe(1000000);
    });

    it('should throw error for value below minimum', () => {
      expect(() => {
        new TenantMaxUsersValueObject(0);
      }).toThrow();
    });

    it('should throw error for value above maximum', () => {
      expect(() => {
        new TenantMaxUsersValueObject(1000001);
      }).toThrow();
    });

    it('should throw error for decimal values', () => {
      expect(() => {
        new TenantMaxUsersValueObject(100.5);
      }).toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for equal values', () => {
      const maxUsers1 = new TenantMaxUsersValueObject(100);
      const maxUsers2 = new TenantMaxUsersValueObject(100);
      expect(maxUsers1.equals(maxUsers2)).toBe(true);
    });

    it('should return false for different values', () => {
      const maxUsers1 = new TenantMaxUsersValueObject(100);
      const maxUsers2 = new TenantMaxUsersValueObject(200);
      expect(maxUsers1.equals(maxUsers2)).toBe(false);
    });
  });
});
