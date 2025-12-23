import { TenantTimezoneValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-timezone/tenant-timezone.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('TenantTimezoneValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantTimezoneValueObject', () => {
      const timezone = new TenantTimezoneValueObject('America/New_York');
      expect(timezone).toBeInstanceOf(TenantTimezoneValueObject);
      expect(timezone).toBeInstanceOf(StringValueObject);
      expect(timezone.value).toBe('America/New_York');
    });

    it('should create a TenantTimezoneValueObject with empty string when allowEmpty is true', () => {
      const timezone = new TenantTimezoneValueObject('', {
        allowEmpty: true,
        validateExistence: false,
      });
      expect(timezone.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal timezones', () => {
      const timezone1 = new TenantTimezoneValueObject('America/New_York');
      const timezone2 = new TenantTimezoneValueObject('America/New_York');
      expect(timezone1.equals(timezone2)).toBe(true);
    });

    it('should return false for different timezones', () => {
      const timezone1 = new TenantTimezoneValueObject('America/New_York');
      const timezone2 = new TenantTimezoneValueObject('Europe/London');
      expect(timezone1.equals(timezone2)).toBe(false);
    });
  });
});
