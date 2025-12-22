import { TenantPostalCodeValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-postal-code/tenant-postal-code.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('TenantPostalCodeValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantPostalCodeValueObject', () => {
      const postalCode = new TenantPostalCodeValueObject('10001');
      expect(postalCode).toBeInstanceOf(TenantPostalCodeValueObject);
      expect(postalCode).toBeInstanceOf(StringValueObject);
      expect(postalCode.value).toBe('10001');
    });

    it('should create a TenantPostalCodeValueObject with empty string', () => {
      const postalCode = new TenantPostalCodeValueObject('');
      expect(postalCode.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal postal codes', () => {
      const postalCode1 = new TenantPostalCodeValueObject('10001');
      const postalCode2 = new TenantPostalCodeValueObject('10001');
      expect(postalCode1.equals(postalCode2)).toBe(true);
    });

    it('should return false for different postal codes', () => {
      const postalCode1 = new TenantPostalCodeValueObject('10001');
      const postalCode2 = new TenantPostalCodeValueObject('10002');
      expect(postalCode1.equals(postalCode2)).toBe(false);
    });
  });
});
