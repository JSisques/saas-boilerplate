import { SubscriptionPlanPriceMonthlyValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-price-monthly/subscription-plan-price-monthly.vo";
import { InvalidNumberException } from "@repo/shared/domain/exceptions/value-objects/invalid-number.exception";

describe("SubscriptionPlanPriceMonthlyValueObject", () => {
  describe("constructor", () => {
    it("should create a valid SubscriptionPlanPriceMonthlyValueObject with a valid number", () => {
      const price = new SubscriptionPlanPriceMonthlyValueObject(9.99);
      expect(price.value).toBe(9.99);
    });

    it("should create with integer value", () => {
      const price = new SubscriptionPlanPriceMonthlyValueObject(10);
      expect(price.value).toBe(10);
    });

    it("should create from string value", () => {
      const price = new SubscriptionPlanPriceMonthlyValueObject("19.99");
      expect(price.value).toBe(19.99);
    });

    it("should handle zero value", () => {
      const price = new SubscriptionPlanPriceMonthlyValueObject(0);
      expect(price.value).toBe(0);
    });

    it("should handle large values", () => {
      const price = new SubscriptionPlanPriceMonthlyValueObject(999999.99);
      expect(price.value).toBe(999999.99);
    });

    it("should handle negative values", () => {
      const price = new SubscriptionPlanPriceMonthlyValueObject(-10);
      expect(price.value).toBe(-10);
    });

    it("should throw InvalidNumberException for invalid string", () => {
      expect(() => {
        new SubscriptionPlanPriceMonthlyValueObject("invalid");
      }).toThrow(InvalidNumberException);
    });

    it("should throw InvalidNumberException for Infinity", () => {
      expect(() => {
        new SubscriptionPlanPriceMonthlyValueObject(Infinity);
      }).toThrow(InvalidNumberException);
    });

    it("should throw InvalidNumberException for NaN", () => {
      expect(() => {
        new SubscriptionPlanPriceMonthlyValueObject(NaN);
      }).toThrow(InvalidNumberException);
    });
  });

  describe("equals", () => {
    it("should return true for equal prices", () => {
      const price1 = new SubscriptionPlanPriceMonthlyValueObject(9.99);
      const price2 = new SubscriptionPlanPriceMonthlyValueObject(9.99);
      expect(price1.equals(price2)).toBe(true);
    });

    it("should return false for different prices", () => {
      const price1 = new SubscriptionPlanPriceMonthlyValueObject(9.99);
      const price2 = new SubscriptionPlanPriceMonthlyValueObject(19.99);
      expect(price1.equals(price2)).toBe(false);
    });
  });

  describe("inherited methods from NumberValueObject", () => {
    it("should check if positive correctly", () => {
      const positivePrice = new SubscriptionPlanPriceMonthlyValueObject(9.99);
      expect(positivePrice.isPositive()).toBe(true);
    });

    it("should check if negative correctly", () => {
      const negativePrice = new SubscriptionPlanPriceMonthlyValueObject(-9.99);
      expect(negativePrice.isNegative()).toBe(true);
    });

    it("should check if zero correctly", () => {
      const zeroPrice = new SubscriptionPlanPriceMonthlyValueObject(0);
      expect(zeroPrice.isZero()).toBe(true);
    });

    it("should check if in range correctly", () => {
      const price = new SubscriptionPlanPriceMonthlyValueObject(15);
      expect(price.isInRange(10, 20)).toBe(true);
      expect(price.isInRange(20, 30)).toBe(false);
    });

    it("should round correctly", () => {
      const price = new SubscriptionPlanPriceMonthlyValueObject(9.999);
      expect(price.round(2)).toBe(10);
    });
  });
});
