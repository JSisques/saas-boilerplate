import { LocaleValueObject } from '@/shared/domain/value-objects/locale/locale.vo';
import { TenantLocaleValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-locale/tenant-locale.vo';

describe('TenantLocaleValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantLocaleValueObject', () => {
      const locale = new TenantLocaleValueObject('en', {
        validateExistence: false,
      });
      expect(locale).toBeInstanceOf(TenantLocaleValueObject);
      expect(locale).toBeInstanceOf(LocaleValueObject);
      expect(locale.value).toBe('en');
    });

    it('should create a TenantLocaleValueObject with empty string when allowEmpty is true', () => {
      const locale = new TenantLocaleValueObject('', { allowEmpty: true });
      expect(locale.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal locales', () => {
      const locale1 = new TenantLocaleValueObject('en', {
        validateExistence: false,
      });
      const locale2 = new TenantLocaleValueObject('en', {
        validateExistence: false,
      });
      expect(locale1.equals(locale2)).toBe(true);
    });

    it('should return false for different locales', () => {
      const locale1 = new TenantLocaleValueObject('en', {
        validateExistence: false,
      });
      const locale2 = new TenantLocaleValueObject('es', {
        validateExistence: false,
      });
      expect(locale1.equals(locale2)).toBe(false);
    });
  });
});
