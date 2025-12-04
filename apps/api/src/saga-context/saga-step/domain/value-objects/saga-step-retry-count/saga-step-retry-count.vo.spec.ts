import { SagaStepRetryCountValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-retry-count/saga-step-retry-count.vo';
import { InvalidNumberException } from '@/shared/domain/exceptions/value-objects/invalid-number/invalid-number.exception';

describe('SagaStepRetryCountValueObject', () => {
  describe('constructor', () => {
    it('should create a saga step retry count value object with zero', () => {
      const retryCount = new SagaStepRetryCountValueObject(0);

      expect(retryCount.value).toBe(0);
    });

    it('should create a saga step retry count value object with valid number', () => {
      const retryCount = new SagaStepRetryCountValueObject(3);

      expect(retryCount.value).toBe(3);
    });

    it('should parse string to number', () => {
      const retryCount = new SagaStepRetryCountValueObject('5');

      expect(retryCount.value).toBe(5);
    });

    it('should throw InvalidNumberException for negative numbers', () => {
      expect(() => new SagaStepRetryCountValueObject(-1)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepRetryCountValueObject(-10)).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for decimal numbers', () => {
      expect(() => new SagaStepRetryCountValueObject(1.5)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepRetryCountValueObject(3.14)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepRetryCountValueObject('2.5')).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for invalid string', () => {
      expect(() => new SagaStepRetryCountValueObject('invalid')).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepRetryCountValueObject('abc123')).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for non-finite numbers', () => {
      expect(() => new SagaStepRetryCountValueObject(Infinity as any)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepRetryCountValueObject(-Infinity as any)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepRetryCountValueObject(NaN as any)).toThrow(
        InvalidNumberException,
      );
    });

    it('should accept valid non-negative integers', () => {
      const validRetryCounts = [0, 1, 2, 3, 5, 10, 100];

      validRetryCounts.forEach((count) => {
        expect(() => new SagaStepRetryCountValueObject(count)).not.toThrow();
        expect(new SagaStepRetryCountValueObject(count).value).toBe(count);
      });
    });

    it('should accept valid non-negative integer strings', () => {
      const validRetryCounts = ['0', '1', '2', '3', '5', '10', '100'];

      validRetryCounts.forEach((count) => {
        expect(() => new SagaStepRetryCountValueObject(count)).not.toThrow();
        expect(new SagaStepRetryCountValueObject(count).value).toBe(
          Number(count),
        );
      });
    });
  });

  describe('equals', () => {
    it('should return true for equal retry counts', () => {
      const retryCount1 = new SagaStepRetryCountValueObject(3);
      const retryCount2 = new SagaStepRetryCountValueObject(3);

      expect(retryCount1.equals(retryCount2)).toBe(true);
    });

    it('should return false for different retry counts', () => {
      const retryCount1 = new SagaStepRetryCountValueObject(3);
      const retryCount2 = new SagaStepRetryCountValueObject(5);

      expect(retryCount1.equals(retryCount2)).toBe(false);
    });

    it('should return true when comparing number and string with same value', () => {
      const retryCount1 = new SagaStepRetryCountValueObject(5);
      const retryCount2 = new SagaStepRetryCountValueObject('5');

      expect(retryCount1.equals(retryCount2)).toBe(true);
    });
  });

  describe('utility methods', () => {
    it('should check if retry count is in range', () => {
      const retryCount = new SagaStepRetryCountValueObject(5);

      expect(retryCount.isInRange(1, 10)).toBe(true);
      expect(retryCount.isInRange(10, 20)).toBe(false);
    });

    it('should check if retry count is positive', () => {
      expect(new SagaStepRetryCountValueObject(1).isPositive()).toBe(true);
      expect(new SagaStepRetryCountValueObject(0).isPositive()).toBe(false);
    });

    it('should check if retry count is negative', () => {
      expect(new SagaStepRetryCountValueObject(0).isNegative()).toBe(false);
      expect(new SagaStepRetryCountValueObject(5).isNegative()).toBe(false);
    });

    it('should check if retry count is zero', () => {
      expect(new SagaStepRetryCountValueObject(0).isZero()).toBe(true);
      expect(new SagaStepRetryCountValueObject(1).isZero()).toBe(false);
    });

    it('should round to specified precision', () => {
      const retryCount = new SagaStepRetryCountValueObject(5);

      expect(retryCount.round(2)).toBe(5);
    });
  });
});
