import { TenantNameValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('TenantNameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantNameValueObject', () => {
      const name = new TenantNameValueObject('Test Tenant');
      expect(name).toBeInstanceOf(TenantNameValueObject);
      expect(name).toBeInstanceOf(StringValueObject);
      expect(name.value).toBe('Test Tenant');
    });

    it('should create a TenantNameValueObject with empty string', () => {
      const name = new TenantNameValueObject('');
      expect(name.value).toBe('');
    });

    it('should create a TenantNameValueObject with long name', () => {
      const longName = 'A'.repeat(100);
      const name = new TenantNameValueObject(longName);
      expect(name.value).toBe(longName);
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const name1 = new TenantNameValueObject('Test Tenant');
      const name2 = new TenantNameValueObject('Test Tenant');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different names', () => {
      const name1 = new TenantNameValueObject('Test Tenant');
      const name2 = new TenantNameValueObject('Another Tenant');
      expect(name1.equals(name2)).toBe(false);
    });

    it('should return false for case-sensitive differences', () => {
      const name1 = new TenantNameValueObject('Test Tenant');
      const name2 = new TenantNameValueObject('test tenant');
      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct string value', () => {
      const name = new TenantNameValueObject('Test Tenant');
      expect(name.value).toBe('Test Tenant');
    });

    it('should return correct length', () => {
      const name = new TenantNameValueObject('Test Tenant');
      expect(name.value.length).toBe(11);
    });
  });
});
