import { SagaStepStartDateValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-start-date/saga-step-start-date.vo';

describe('SagaStepStartDateValueObject', () => {
  describe('constructor', () => {
    it('should create a saga step start date value object with provided date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const startDate = new SagaStepStartDateValueObject(date);

      expect(startDate.value).toBe(date);
    });

    it('should create a saga step start date value object with current date when no date provided', () => {
      const beforeCreation = new Date();
      const startDate = new SagaStepStartDateValueObject();
      const afterCreation = new Date();

      expect(startDate.value).toBeInstanceOf(Date);
      expect(startDate.value.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(startDate.value.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });

    it('should accept valid date strings', () => {
      const dateString = '2024-01-01T10:00:00Z';
      const date = new Date(dateString);
      const startDate = new SagaStepStartDateValueObject(date);

      expect(startDate.value).toBeInstanceOf(Date);
      expect(startDate.value.toISOString()).toBe(date.toISOString());
    });

    it('should handle different date formats', () => {
      const dates = [
        new Date('2024-01-01'),
        new Date('2024-12-31T23:59:59Z'),
        new Date('2023-06-15T12:30:45.123Z'),
      ];

      dates.forEach((date) => {
        const startDate = new SagaStepStartDateValueObject(date);
        expect(startDate.value).toBe(date);
      });
    });

    it('should handle future dates', () => {
      const futureDate = new Date('2030-01-01T10:00:00Z');
      const startDate = new SagaStepStartDateValueObject(futureDate);

      expect(startDate.value).toBe(futureDate);
    });

    it('should handle past dates', () => {
      const pastDate = new Date('2020-01-01T10:00:00Z');
      const startDate = new SagaStepStartDateValueObject(pastDate);

      expect(startDate.value).toBe(pastDate);
    });
  });

  describe('equals', () => {
    it('should return true for equal dates', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const startDate1 = new SagaStepStartDateValueObject(date);
      const startDate2 = new SagaStepStartDateValueObject(date);

      expect(startDate1.equals(startDate2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-02T10:00:00Z');
      const startDate1 = new SagaStepStartDateValueObject(date1);
      const startDate2 = new SagaStepStartDateValueObject(date2);

      expect(startDate1.equals(startDate2)).toBe(false);
    });
  });

  describe('toISOString', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const startDate = new SagaStepStartDateValueObject(date);

      expect(startDate.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    });

    it('should handle dates with milliseconds', () => {
      const date = new Date('2024-01-01T10:00:00.123Z');
      const startDate = new SagaStepStartDateValueObject(date);

      expect(startDate.toISOString()).toBe('2024-01-01T10:00:00.123Z');
    });
  });
});
