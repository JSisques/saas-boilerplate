import { SagaStepMaxRetriesValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-max-retries/saga-step-max-retries.vo';
import { InvalidNumberException } from '@/shared/domain/exceptions/value-objects/invalid-number/invalid-number.exception';

describe('SagaStepMaxRetriesValueObject', () => {
  describe('constructor', () => {
    it('should create a saga step max retries value object with zero', () => {
      const maxRetries = new SagaStepMaxRetriesValueObject(0);

      expect(maxRetries.value).toBe(0);
    });

    it('should create a saga step max retries value object with valid number', () => {
      const maxRetries = new SagaStepMaxRetriesValueObject(3);

      expect(maxRetries.value).toBe(3);
    });

    it('should parse string to number', () => {
      const maxRetries = new SagaStepMaxRetriesValueObject('5');

      expect(maxRetries.value).toBe(5);
    });

    it('should throw InvalidNumberException for negative numbers', () => {
      expect(() => new SagaStepMaxRetriesValueObject(-1)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepMaxRetriesValueObject(-10)).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for decimal numbers', () => {
      expect(() => new SagaStepMaxRetriesValueObject(1.5)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepMaxRetriesValueObject(3.14)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepMaxRetriesValueObject('2.5')).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for invalid string', () => {
      expect(() => new SagaStepMaxRetriesValueObject('invalid')).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepMaxRetriesValueObject('abc123')).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for non-finite numbers', () => {
      expect(() => new SagaStepMaxRetriesValueObject(Infinity as any)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepMaxRetriesValueObject(-Infinity as any)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepMaxRetriesValueObject(NaN as any)).toThrow(
        InvalidNumberException,
      );
    });

    it('should accept valid non-negative integers', () => {
      const validMaxRetries = [0, 1, 2, 3, 5, 10, 100];

      validMaxRetries.forEach((maxRetries) => {
        expect(
          () => new SagaStepMaxRetriesValueObject(maxRetries),
        ).not.toThrow();
        expect(new SagaStepMaxRetriesValueObject(maxRetries).value).toBe(
          maxRetries,
        );
      });
    });

    it('should accept valid non-negative integer strings', () => {
      const validMaxRetries = ['0', '1', '2', '3', '5', '10', '100'];

      validMaxRetries.forEach((maxRetries) => {
        expect(
          () => new SagaStepMaxRetriesValueObject(maxRetries),
        ).not.toThrow();
        expect(new SagaStepMaxRetriesValueObject(maxRetries).value).toBe(
          Number(maxRetries),
        );
      });
    });
  });

  describe('equals', () => {
    it('should return true for equal max retries', () => {
      const maxRetries1 = new SagaStepMaxRetriesValueObject(3);
      const maxRetries2 = new SagaStepMaxRetriesValueObject(3);

      expect(maxRetries1.equals(maxRetries2)).toBe(true);
    });

    it('should return false for different max retries', () => {
      const maxRetries1 = new SagaStepMaxRetriesValueObject(3);
      const maxRetries2 = new SagaStepMaxRetriesValueObject(5);

      expect(maxRetries1.equals(maxRetries2)).toBe(false);
    });

    it('should return true when comparing number and string with same value', () => {
      const maxRetries1 = new SagaStepMaxRetriesValueObject(5);
      const maxRetries2 = new SagaStepMaxRetriesValueObject('5');

      expect(maxRetries1.equals(maxRetries2)).toBe(true);
    });
  });

  describe('utility methods', () => {
    it('should check if max retries is in range', () => {
      const maxRetries = new SagaStepMaxRetriesValueObject(5);

      expect(maxRetries.isInRange(1, 10)).toBe(true);
      expect(maxRetries.isInRange(10, 20)).toBe(false);
    });

    it('should check if max retries is positive', () => {
      expect(new SagaStepMaxRetriesValueObject(1).isPositive()).toBe(true);
      expect(new SagaStepMaxRetriesValueObject(0).isPositive()).toBe(false);
    });

    it('should check if max retries is negative', () => {
      expect(new SagaStepMaxRetriesValueObject(0).isNegative()).toBe(false);
      expect(new SagaStepMaxRetriesValueObject(5).isNegative()).toBe(false);
    });

    it('should check if max retries is zero', () => {
      expect(new SagaStepMaxRetriesValueObject(0).isZero()).toBe(true);
      expect(new SagaStepMaxRetriesValueObject(1).isZero()).toBe(false);
    });

    it('should round to specified precision', () => {
      const maxRetries = new SagaStepMaxRetriesValueObject(5);

      expect(maxRetries.round(2)).toBe(5);
    });
  });
});
