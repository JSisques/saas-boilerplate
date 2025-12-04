import { SagaStepEndDateValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-end-date/saga-step-end-date.vo';

describe('SagaStepEndDateValueObject', () => {
  describe('constructor', () => {
    it('should create a saga step end date value object with provided date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const endDate = new SagaStepEndDateValueObject(date);

      expect(endDate.value).toBe(date);
    });

    it('should create a saga step end date value object with current date when no date provided', () => {
      const beforeCreation = new Date();
      const endDate = new SagaStepEndDateValueObject();
      const afterCreation = new Date();

      expect(endDate.value).toBeInstanceOf(Date);
      expect(endDate.value.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(endDate.value.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });

    it('should accept valid date strings', () => {
      const dateString = '2024-01-01T10:00:00Z';
      const date = new Date(dateString);
      const endDate = new SagaStepEndDateValueObject(date);

      expect(endDate.value).toBeInstanceOf(Date);
      expect(endDate.value.toISOString()).toBe(date.toISOString());
    });

    it('should handle different date formats', () => {
      const dates = [
        new Date('2024-01-01'),
        new Date('2024-12-31T23:59:59Z'),
        new Date('2023-06-15T12:30:45.123Z'),
      ];

      dates.forEach((date) => {
        const endDate = new SagaStepEndDateValueObject(date);
        expect(endDate.value).toBe(date);
      });
    });

    it('should handle future dates', () => {
      const futureDate = new Date('2030-01-01T10:00:00Z');
      const endDate = new SagaStepEndDateValueObject(futureDate);

      expect(endDate.value).toBe(futureDate);
    });

    it('should handle past dates', () => {
      const pastDate = new Date('2020-01-01T10:00:00Z');
      const endDate = new SagaStepEndDateValueObject(pastDate);

      expect(endDate.value).toBe(pastDate);
    });
  });

  describe('equals', () => {
    it('should return true for equal dates', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const endDate1 = new SagaStepEndDateValueObject(date);
      const endDate2 = new SagaStepEndDateValueObject(date);

      expect(endDate1.equals(endDate2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-02T10:00:00Z');
      const endDate1 = new SagaStepEndDateValueObject(date1);
      const endDate2 = new SagaStepEndDateValueObject(date2);

      expect(endDate1.equals(endDate2)).toBe(false);
    });
  });

  describe('toISOString', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const endDate = new SagaStepEndDateValueObject(date);

      expect(endDate.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    });

    it('should handle dates with milliseconds', () => {
      const date = new Date('2024-01-01T10:00:00.123Z');
      const endDate = new SagaStepEndDateValueObject(date);

      expect(endDate.toISOString()).toBe('2024-01-01T10:00:00.123Z');
    });
  });
});
