import { TenantCountryValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-country/tenant-country.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('TenantCountryValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantCountryValueObject', () => {
      const country = new TenantCountryValueObject('USA');
      expect(country).toBeInstanceOf(TenantCountryValueObject);
      expect(country).toBeInstanceOf(StringValueObject);
      expect(country.value).toBe('USA');
    });

    it('should create a TenantCountryValueObject with empty string when allowEmpty is true', () => {
      const country = new TenantCountryValueObject('', { allowEmpty: true });
      expect(country.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal countries', () => {
      const country1 = new TenantCountryValueObject('USA');
      const country2 = new TenantCountryValueObject('USA');
      expect(country1.equals(country2)).toBe(true);
    });

    it('should return false for different countries', () => {
      const country1 = new TenantCountryValueObject('USA');
      const country2 = new TenantCountryValueObject('Canada');
      expect(country1.equals(country2)).toBe(false);
    });
  });
});
