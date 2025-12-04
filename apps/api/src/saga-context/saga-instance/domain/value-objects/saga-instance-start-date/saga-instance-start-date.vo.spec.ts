import { SagaInstanceStartDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-start-date/saga-instance-start-date.vo';

describe('SagaInstanceStartDateValueObject', () => {
  describe('constructor', () => {
    it('should create a valid saga instance start date value object', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const valueObject = new SagaInstanceStartDateValueObject(date);

      expect(valueObject.value).toEqual(date);
    });

    it('should create a saga instance start date with current date', () => {
      const date = new Date();
      const valueObject = new SagaInstanceStartDateValueObject(date);

      expect(valueObject.value).toEqual(date);
    });

    it('should create a saga instance start date with undefined (uses current date)', () => {
      const valueObject = new SagaInstanceStartDateValueObject(undefined);

      expect(valueObject.value).toBeInstanceOf(Date);
    });
  });

  describe('equals', () => {
    it('should return true when comparing two equal saga instance start dates', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const valueObject1 = new SagaInstanceStartDateValueObject(date);
      const valueObject2 = new SagaInstanceStartDateValueObject(date);

      expect(valueObject1.equals(valueObject2)).toBe(true);
    });

    it('should return false when comparing two different saga instance start dates', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-02T10:00:00Z');
      const valueObject1 = new SagaInstanceStartDateValueObject(date1);
      const valueObject2 = new SagaInstanceStartDateValueObject(date2);

      expect(valueObject1.equals(valueObject2)).toBe(false);
    });

    it('should return false when comparing with different date', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-01T11:00:00Z');
      const valueObject1 = new SagaInstanceStartDateValueObject(date1);
      const valueObject2 = new SagaInstanceStartDateValueObject(date2);

      expect(valueObject1.equals(valueObject2)).toBe(false);
    });
  });
});
