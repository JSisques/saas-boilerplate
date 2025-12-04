import { SagaStepOrderValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-order/saga-step-order.vo';
import { InvalidNumberException } from '@/shared/domain/exceptions/value-objects/invalid-number/invalid-number.exception';

describe('SagaStepOrderValueObject', () => {
  describe('constructor', () => {
    it('should create a saga step order value object with a valid number', () => {
      const order = new SagaStepOrderValueObject(1);

      expect(order.value).toBe(1);
    });

    it('should create with zero', () => {
      const order = new SagaStepOrderValueObject(0);

      expect(order.value).toBe(0);
    });

    it('should parse string to number', () => {
      const order = new SagaStepOrderValueObject('5');

      expect(order.value).toBe(5);
    });

    it('should throw InvalidNumberException for negative numbers', () => {
      expect(() => new SagaStepOrderValueObject(-1)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepOrderValueObject(-10)).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for decimal numbers', () => {
      expect(() => new SagaStepOrderValueObject(1.5)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepOrderValueObject(3.14)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepOrderValueObject('2.5')).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for invalid string', () => {
      expect(() => new SagaStepOrderValueObject('invalid')).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepOrderValueObject('abc123')).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for non-finite numbers', () => {
      expect(() => new SagaStepOrderValueObject(Infinity as any)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepOrderValueObject(-Infinity as any)).toThrow(
        InvalidNumberException,
      );
      expect(() => new SagaStepOrderValueObject(NaN as any)).toThrow(
        InvalidNumberException,
      );
    });

    it('should accept valid positive integers', () => {
      const validOrders = [0, 1, 2, 10, 100, 1000];

      validOrders.forEach((order) => {
        expect(() => new SagaStepOrderValueObject(order)).not.toThrow();
        expect(new SagaStepOrderValueObject(order).value).toBe(order);
      });
    });

    it('should accept valid positive integer strings', () => {
      const validOrders = ['0', '1', '2', '10', '100', '1000'];

      validOrders.forEach((order) => {
        expect(() => new SagaStepOrderValueObject(order)).not.toThrow();
        expect(new SagaStepOrderValueObject(order).value).toBe(Number(order));
      });
    });
  });

  describe('equals', () => {
    it('should return true for equal orders', () => {
      const order1 = new SagaStepOrderValueObject(1);
      const order2 = new SagaStepOrderValueObject(1);

      expect(order1.equals(order2)).toBe(true);
    });

    it('should return false for different orders', () => {
      const order1 = new SagaStepOrderValueObject(1);
      const order2 = new SagaStepOrderValueObject(2);

      expect(order1.equals(order2)).toBe(false);
    });

    it('should return true when comparing number and string with same value', () => {
      const order1 = new SagaStepOrderValueObject(5);
      const order2 = new SagaStepOrderValueObject('5');

      expect(order1.equals(order2)).toBe(true);
    });
  });

  describe('utility methods', () => {
    it('should check if order is in range', () => {
      const order = new SagaStepOrderValueObject(5);

      expect(order.isInRange(1, 10)).toBe(true);
      expect(order.isInRange(10, 20)).toBe(false);
    });

    it('should check if order is positive', () => {
      expect(new SagaStepOrderValueObject(1).isPositive()).toBe(true);
      expect(new SagaStepOrderValueObject(0).isPositive()).toBe(false);
    });

    it('should check if order is negative', () => {
      expect(new SagaStepOrderValueObject(0).isNegative()).toBe(false);
      expect(new SagaStepOrderValueObject(5).isNegative()).toBe(false);
    });

    it('should check if order is zero', () => {
      expect(new SagaStepOrderValueObject(0).isZero()).toBe(true);
      expect(new SagaStepOrderValueObject(1).isZero()).toBe(false);
    });

    it('should round to specified precision', () => {
      const order = new SagaStepOrderValueObject(5);

      expect(order.round(2)).toBe(5);
    });
  });
});
