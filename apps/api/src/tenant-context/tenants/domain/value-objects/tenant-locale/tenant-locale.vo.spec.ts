import { TenantLocaleValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-locale/tenant-locale.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('TenantLocaleValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantLocaleValueObject', () => {
      const locale = new TenantLocaleValueObject('en-US');
      expect(locale).toBeInstanceOf(TenantLocaleValueObject);
      expect(locale).toBeInstanceOf(StringValueObject);
      expect(locale.value).toBe('en-US');
    });

    it('should create a TenantLocaleValueObject with empty string', () => {
      const locale = new TenantLocaleValueObject('');
      expect(locale.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal locales', () => {
      const locale1 = new TenantLocaleValueObject('en-US');
      const locale2 = new TenantLocaleValueObject('en-US');
      expect(locale1.equals(locale2)).toBe(true);
    });

    it('should return false for different locales', () => {
      const locale1 = new TenantLocaleValueObject('en-US');
      const locale2 = new TenantLocaleValueObject('es-ES');
      expect(locale1.equals(locale2)).toBe(false);
    });
  });
});
