import { SagaInstanceEndDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-end-date/saga-instance-end-date.vo';

describe('SagaInstanceEndDateValueObject', () => {
  describe('constructor', () => {
    it('should create a valid saga instance end date value object', () => {
      const date = new Date('2024-01-01T11:00:00Z');
      const valueObject = new SagaInstanceEndDateValueObject(date);

      expect(valueObject.value).toEqual(date);
    });

    it('should create a saga instance end date with current date', () => {
      const date = new Date();
      const valueObject = new SagaInstanceEndDateValueObject(date);

      expect(valueObject.value).toEqual(date);
    });

    it('should create a saga instance end date with undefined (uses current date)', () => {
      const valueObject = new SagaInstanceEndDateValueObject(undefined);

      expect(valueObject.value).toBeInstanceOf(Date);
    });
  });

  describe('equals', () => {
    it('should return true when comparing two equal saga instance end dates', () => {
      const date = new Date('2024-01-01T11:00:00Z');
      const valueObject1 = new SagaInstanceEndDateValueObject(date);
      const valueObject2 = new SagaInstanceEndDateValueObject(date);

      expect(valueObject1.equals(valueObject2)).toBe(true);
    });

    it('should return false when comparing two different saga instance end dates', () => {
      const date1 = new Date('2024-01-01T11:00:00Z');
      const date2 = new Date('2024-01-02T11:00:00Z');
      const valueObject1 = new SagaInstanceEndDateValueObject(date1);
      const valueObject2 = new SagaInstanceEndDateValueObject(date2);

      expect(valueObject1.equals(valueObject2)).toBe(false);
    });

    it('should return false when comparing with different date', () => {
      const date1 = new Date('2024-01-01T11:00:00Z');
      const date2 = new Date('2024-01-01T12:00:00Z');
      const valueObject1 = new SagaInstanceEndDateValueObject(date1);
      const valueObject2 = new SagaInstanceEndDateValueObject(date2);

      expect(valueObject1.equals(valueObject2)).toBe(false);
    });
  });
});
