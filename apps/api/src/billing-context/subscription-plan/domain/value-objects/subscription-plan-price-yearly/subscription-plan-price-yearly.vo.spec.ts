import { SubscriptionPlanPriceYearlyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-yearly/subscription-plan-price-yearly.vo';
import { InvalidNumberException } from '@/shared/domain/exceptions/value-objects/invalid-number/invalid-number.exception';

describe('SubscriptionPlanPriceYearlyValueObject', () => {
  describe('constructor', () => {
    it('should create a valid SubscriptionPlanPriceYearlyValueObject with a valid number', () => {
      const price = new SubscriptionPlanPriceYearlyValueObject(99.99);
      expect(price.value).toBe(99.99);
    });

    it('should create with integer value', () => {
      const price = new SubscriptionPlanPriceYearlyValueObject(100);
      expect(price.value).toBe(100);
    });

    it('should create from string value', () => {
      const price = new SubscriptionPlanPriceYearlyValueObject('199.99');
      expect(price.value).toBe(199.99);
    });

    it('should handle zero value', () => {
      const price = new SubscriptionPlanPriceYearlyValueObject(0);
      expect(price.value).toBe(0);
    });

    it('should handle large values', () => {
      const price = new SubscriptionPlanPriceYearlyValueObject(999999.99);
      expect(price.value).toBe(999999.99);
    });

    it('should handle negative values', () => {
      const price = new SubscriptionPlanPriceYearlyValueObject(-100);
      expect(price.value).toBe(-100);
    });

    it('should throw InvalidNumberException for invalid string', () => {
      expect(() => {
        new SubscriptionPlanPriceYearlyValueObject('invalid');
      }).toThrow(InvalidNumberException);
    });

    it('should throw InvalidNumberException for Infinity', () => {
      expect(() => {
        new SubscriptionPlanPriceYearlyValueObject(Infinity);
      }).toThrow(InvalidNumberException);
    });

    it('should throw InvalidNumberException for NaN', () => {
      expect(() => {
        new SubscriptionPlanPriceYearlyValueObject(NaN);
      }).toThrow(InvalidNumberException);
    });
  });

  describe('equals', () => {
    it('should return true for equal prices', () => {
      const price1 = new SubscriptionPlanPriceYearlyValueObject(99.99);
      const price2 = new SubscriptionPlanPriceYearlyValueObject(99.99);
      expect(price1.equals(price2)).toBe(true);
    });

    it('should return false for different prices', () => {
      const price1 = new SubscriptionPlanPriceYearlyValueObject(99.99);
      const price2 = new SubscriptionPlanPriceYearlyValueObject(199.99);
      expect(price1.equals(price2)).toBe(false);
    });
  });

  describe('inherited methods from NumberValueObject', () => {
    it('should check if positive correctly', () => {
      const positivePrice = new SubscriptionPlanPriceYearlyValueObject(99.99);
      expect(positivePrice.isPositive()).toBe(true);
    });

    it('should check if negative correctly', () => {
      const negativePrice = new SubscriptionPlanPriceYearlyValueObject(-99.99);
      expect(negativePrice.isNegative()).toBe(true);
    });

    it('should check if zero correctly', () => {
      const zeroPrice = new SubscriptionPlanPriceYearlyValueObject(0);
      expect(zeroPrice.isZero()).toBe(true);
    });

    it('should check if in range correctly', () => {
      const price = new SubscriptionPlanPriceYearlyValueObject(150);
      expect(price.isInRange(100, 200)).toBe(true);
      expect(price.isInRange(200, 300)).toBe(false);
    });

    it('should round correctly', () => {
      const price = new SubscriptionPlanPriceYearlyValueObject(99.999);
      expect(price.round(2)).toBe(100);
    });
  });
});
