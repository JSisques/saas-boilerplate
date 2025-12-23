import { TenantCityValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-city/tenant-city.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('TenantCityValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantCityValueObject', () => {
      const city = new TenantCityValueObject('New York');
      expect(city).toBeInstanceOf(TenantCityValueObject);
      expect(city).toBeInstanceOf(StringValueObject);
      expect(city.value).toBe('New York');
    });

    it('should create a TenantCityValueObject with empty string when allowEmpty is true', () => {
      const city = new TenantCityValueObject('', { allowEmpty: true });
      expect(city.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal cities', () => {
      const city1 = new TenantCityValueObject('New York');
      const city2 = new TenantCityValueObject('New York');
      expect(city1.equals(city2)).toBe(true);
    });

    it('should return false for different cities', () => {
      const city1 = new TenantCityValueObject('New York');
      const city2 = new TenantCityValueObject('Los Angeles');
      expect(city1.equals(city2)).toBe(false);
    });
  });
});
