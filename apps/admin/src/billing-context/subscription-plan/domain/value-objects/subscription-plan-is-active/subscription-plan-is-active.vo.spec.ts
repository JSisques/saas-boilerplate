import { SubscriptionPlanIsActiveValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-is-active/subscription-plan-is-active.vo";
import { InvalidBooleanException } from "@repo/shared/domain/exceptions/value-objects/invalid-boolean.exception";

describe("SubscriptionPlanIsActiveValueObject", () => {
  describe("constructor", () => {
    it("should create a valid SubscriptionPlanIsActiveValueObject with true", () => {
      const isActive = new SubscriptionPlanIsActiveValueObject(true);
      expect(isActive.value).toBe(true);
    });

    it("should create a valid SubscriptionPlanIsActiveValueObject with false", () => {
      const isActive = new SubscriptionPlanIsActiveValueObject(false);
      expect(isActive.value).toBe(false);
    });

    it('should create from string "true"', () => {
      const isActive = new SubscriptionPlanIsActiveValueObject("true");
      expect(isActive.value).toBe(true);
    });

    it('should create from string "false"', () => {
      const isActive = new SubscriptionPlanIsActiveValueObject("false");
      expect(isActive.value).toBe(false);
    });

    it('should create from string "1"', () => {
      const isActive = new SubscriptionPlanIsActiveValueObject("1");
      expect(isActive.value).toBe(true);
    });

    it('should create from string "0"', () => {
      const isActive = new SubscriptionPlanIsActiveValueObject("0");
      expect(isActive.value).toBe(false);
    });

    it('should create from string "yes"', () => {
      const isActive = new SubscriptionPlanIsActiveValueObject("yes");
      expect(isActive.value).toBe(true);
    });

    it('should create from string "no"', () => {
      const isActive = new SubscriptionPlanIsActiveValueObject("no");
      expect(isActive.value).toBe(false);
    });

    it("should create from number 1", () => {
      const isActive = new SubscriptionPlanIsActiveValueObject(1);
      expect(isActive.value).toBe(true);
    });

    it("should create from number 0", () => {
      const isActive = new SubscriptionPlanIsActiveValueObject(0);
      expect(isActive.value).toBe(false);
    });

    it("should create from positive number", () => {
      const isActive = new SubscriptionPlanIsActiveValueObject(5);
      expect(isActive.value).toBe(true);
    });

    it("should throw InvalidBooleanException for invalid string", () => {
      expect(() => {
        new SubscriptionPlanIsActiveValueObject("invalid");
      }).toThrow(InvalidBooleanException);
    });

    it("should throw InvalidBooleanException for null value", () => {
      expect(() => {
        new SubscriptionPlanIsActiveValueObject(null as any);
      }).toThrow(InvalidBooleanException);
    });

    it("should throw InvalidBooleanException for undefined value", () => {
      expect(() => {
        new SubscriptionPlanIsActiveValueObject(undefined as any);
      }).toThrow(InvalidBooleanException);
    });
  });

  describe("equals", () => {
    it("should return true for equal boolean values", () => {
      const isActive1 = new SubscriptionPlanIsActiveValueObject(true);
      const isActive2 = new SubscriptionPlanIsActiveValueObject(true);
      expect(isActive1.equals(isActive2)).toBe(true);
    });

    it("should return false for different boolean values", () => {
      const isActive1 = new SubscriptionPlanIsActiveValueObject(true);
      const isActive2 = new SubscriptionPlanIsActiveValueObject(false);
      expect(isActive1.equals(isActive2)).toBe(false);
    });
  });

  describe("inherited methods from BooleanValueObject", () => {
    it("should check if true correctly", () => {
      const isActive = new SubscriptionPlanIsActiveValueObject(true);
      expect(isActive.isTrue()).toBe(true);
      expect(isActive.isFalse()).toBe(false);
    });

    it("should check if false correctly", () => {
      const isActive = new SubscriptionPlanIsActiveValueObject(false);
      expect(isActive.isFalse()).toBe(true);
      expect(isActive.isTrue()).toBe(false);
    });

    it("should negate correctly", () => {
      const isActive = new SubscriptionPlanIsActiveValueObject(true);
      const negated = isActive.not();
      expect(negated.value).toBe(false);
    });

    it("should perform AND operation correctly", () => {
      const isActive1 = new SubscriptionPlanIsActiveValueObject(true);
      const isActive2 = new SubscriptionPlanIsActiveValueObject(false);
      const result = isActive1.and(isActive2);
      expect(result.value).toBe(false);
    });

    it("should perform OR operation correctly", () => {
      const isActive1 = new SubscriptionPlanIsActiveValueObject(true);
      const isActive2 = new SubscriptionPlanIsActiveValueObject(false);
      const result = isActive1.or(isActive2);
      expect(result.value).toBe(true);
    });

    it("should perform XOR operation correctly", () => {
      const isActive1 = new SubscriptionPlanIsActiveValueObject(true);
      const isActive2 = new SubscriptionPlanIsActiveValueObject(false);
      const result = isActive1.xor(isActive2);
      expect(result.value).toBe(true);
    });

    it("should convert to string correctly", () => {
      const isActive = new SubscriptionPlanIsActiveValueObject(true);
      expect(isActive.toString()).toBe("true");
    });

    it("should convert to number correctly", () => {
      const isActiveTrue = new SubscriptionPlanIsActiveValueObject(true);
      expect(isActiveTrue.toNumber()).toBe(1);

      const isActiveFalse = new SubscriptionPlanIsActiveValueObject(false);
      expect(isActiveFalse.toNumber()).toBe(0);
    });
  });
});
