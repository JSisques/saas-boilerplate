import { SubscriptionPlanIntervalCountValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval-count/subscription-plan-interval-count.vo';
import { InvalidNumberException } from '@/shared/domain/exceptions/value-objects/invalid-number.exception';

describe('SubscriptionPlanIntervalCountValueObject', () => {
  describe('constructor', () => {
    it('should create a valid SubscriptionPlanIntervalCountValueObject with a valid number', () => {
      const count = new SubscriptionPlanIntervalCountValueObject(1);
      expect(count.value).toBe(1);
    });

    it('should create from string value', () => {
      const count = new SubscriptionPlanIntervalCountValueObject('3');
      expect(count.value).toBe(3);
    });

    it('should handle zero value', () => {
      const count = new SubscriptionPlanIntervalCountValueObject(0);
      expect(count.value).toBe(0);
    });

    it('should handle positive integers', () => {
      const count = new SubscriptionPlanIntervalCountValueObject(12);
      expect(count.value).toBe(12);
    });

    it('should throw InvalidNumberException for invalid string', () => {
      expect(() => {
        new SubscriptionPlanIntervalCountValueObject('invalid');
      }).toThrow(InvalidNumberException);
    });

    it('should throw InvalidNumberException for Infinity', () => {
      expect(() => {
        new SubscriptionPlanIntervalCountValueObject(Infinity);
      }).toThrow(InvalidNumberException);
    });

    it('should throw InvalidNumberException for NaN', () => {
      expect(() => {
        new SubscriptionPlanIntervalCountValueObject(NaN);
      }).toThrow(InvalidNumberException);
    });
  });

  describe('equals', () => {
    it('should return true for equal counts', () => {
      const count1 = new SubscriptionPlanIntervalCountValueObject(1);
      const count2 = new SubscriptionPlanIntervalCountValueObject(1);
      expect(count1.equals(count2)).toBe(true);
    });

    it('should return false for different counts', () => {
      const count1 = new SubscriptionPlanIntervalCountValueObject(1);
      const count2 = new SubscriptionPlanIntervalCountValueObject(2);
      expect(count1.equals(count2)).toBe(false);
    });
  });

  describe('inherited methods from NumberValueObject', () => {
    it('should check if positive correctly', () => {
      const count = new SubscriptionPlanIntervalCountValueObject(1);
      expect(count.isPositive()).toBe(true);
    });

    it('should check if negative correctly', () => {
      const count = new SubscriptionPlanIntervalCountValueObject(-1);
      expect(count.isNegative()).toBe(true);
    });

    it('should check if zero correctly', () => {
      const count = new SubscriptionPlanIntervalCountValueObject(0);
      expect(count.isZero()).toBe(true);
    });

    it('should check if in range correctly', () => {
      const count = new SubscriptionPlanIntervalCountValueObject(5);
      expect(count.isInRange(1, 10)).toBe(true);
      expect(count.isInRange(10, 20)).toBe(false);
    });

    it('should round correctly', () => {
      const count = new SubscriptionPlanIntervalCountValueObject(5.7);
      expect(count.round(0)).toBe(6);
    });
  });
});
