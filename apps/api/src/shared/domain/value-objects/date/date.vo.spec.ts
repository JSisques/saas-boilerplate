import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';

describe('DateValueObject', () => {
  describe('constructor', () => {
    it('should create a date value object with provided date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const dateVO = new DateValueObject(date);

      expect(dateVO.value).toBe(date);
    });

    it('should create a date value object with current date when no date provided', () => {
      const beforeCreation = new Date();
      const dateVO = new DateValueObject();
      const afterCreation = new Date();

      expect(dateVO.value).toBeInstanceOf(Date);
      expect(dateVO.value.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(dateVO.value.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  describe('value getter', () => {
    it('should return the date value', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const dateVO = new DateValueObject(date);

      expect(dateVO.value).toBe(date);
    });
  });

  describe('toISOString', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const dateVO = new DateValueObject(date);

      expect(dateVO.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    });
  });

  describe('equals', () => {
    it('should return true for equal dates', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const dateVO1 = new DateValueObject(date);
      const dateVO2 = new DateValueObject(date);

      expect(dateVO1.equals(dateVO2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-02T10:00:00Z');
      const dateVO1 = new DateValueObject(date1);
      const dateVO2 = new DateValueObject(date2);

      expect(dateVO1.equals(dateVO2)).toBe(false);
    });
  });
});

