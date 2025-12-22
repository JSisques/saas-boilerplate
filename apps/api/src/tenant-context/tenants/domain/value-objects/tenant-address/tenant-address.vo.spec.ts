import { TenantAddressValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-address/tenant-address.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('TenantAddressValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantAddressValueObject', () => {
      const address = new TenantAddressValueObject('123 Main Street');
      expect(address).toBeInstanceOf(TenantAddressValueObject);
      expect(address).toBeInstanceOf(StringValueObject);
      expect(address.value).toBe('123 Main Street');
    });

    it('should create a TenantAddressValueObject with empty string', () => {
      const address = new TenantAddressValueObject('', { allowEmpty: true });
      expect(address.value).toBe('');
    });

    it('should trim whitespace from the address', () => {
      const address = new TenantAddressValueObject('  123 Main Street  ');
      expect(address.value).toBe('123 Main Street');
    });
  });

  describe('equals', () => {
    it('should return true for equal addresses', () => {
      const address1 = new TenantAddressValueObject('123 Main Street');
      const address2 = new TenantAddressValueObject('123 Main Street');
      expect(address1.equals(address2)).toBe(true);
    });

    it('should return false for different addresses', () => {
      const address1 = new TenantAddressValueObject('123 Main Street');
      const address2 = new TenantAddressValueObject('456 Oak Avenue');
      expect(address1.equals(address2)).toBe(false);
    });
  });
});
