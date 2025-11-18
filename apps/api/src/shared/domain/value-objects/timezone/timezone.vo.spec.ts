import { InvalidTimezoneException } from '@/shared/domain/exceptions/value-objects/invalid-timezone/invalid-timezone.exception';
import { TimezoneValueObject } from '@/shared/domain/value-objects/timezone/timezone.vo';

describe('TimezoneValueObject', () => {
  describe('constructor', () => {
    it('should create a timezone value object with valid timezone', () => {
      const timezone = new TimezoneValueObject('Europe/Madrid');

      expect(timezone.value).toBe('Europe/Madrid');
    });

    it('should normalize timezone (trim only)', () => {
      const timezone = new TimezoneValueObject('  Europe/Madrid  ');

      expect(timezone.value).toBe('Europe/Madrid');
    });

    it('should throw InvalidTimezoneException for timezone not in common list', () => {
      expect(() => new TimezoneValueObject('Invalid/Timezone')).toThrow(
        InvalidTimezoneException,
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal timezones', () => {
      const timezone1 = new TimezoneValueObject('Europe/Madrid');
      const timezone2 = new TimezoneValueObject('Europe/Madrid');

      expect(timezone1.equals(timezone2)).toBe(true);
    });

    it('should return false for different timezones', () => {
      const timezone1 = new TimezoneValueObject('Europe/Madrid');
      const timezone2 = new TimezoneValueObject('America/New_York');

      expect(timezone1.equals(timezone2)).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should check if timezone exists', () => {
      expect(new TimezoneValueObject('Europe/Madrid').exists()).toBe(true);
    });

    it('should get region from timezone', () => {
      const timezone = new TimezoneValueObject('Europe/Madrid');

      expect(timezone.getRegion()).toBe('Europe');
    });

    it('should get city from timezone', () => {
      const timezone = new TimezoneValueObject('Europe/Madrid');

      expect(timezone.getCity()).toBe('Madrid');
    });

    it('should check if timezone is European', () => {
      expect(new TimezoneValueObject('Europe/Madrid').isEuropean()).toBe(true);
      expect(new TimezoneValueObject('America/New_York').isEuropean()).toBe(
        false,
      );
    });
  });
});
