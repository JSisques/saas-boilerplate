import { SubscriptionPlanTypeEnum } from "@/billing-context/subscription-plan/domain/enum/subscription-plan-type.enum";
import { SubscriptionPlanTypeValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-type/subscription-plan-type.vo";
import { InvalidEnumValueException } from "@repo/shared/domain/exceptions/value-objects/invalid-enum-value.exception";

describe("SubscriptionPlanTypeValueObject", () => {
  describe("constructor", () => {
    it("should create a valid SubscriptionPlanTypeValueObject with FREE type", () => {
      const type = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.FREE
      );
      expect(type.value).toBe(SubscriptionPlanTypeEnum.FREE);
    });

    it("should create a valid SubscriptionPlanTypeValueObject with BASIC type", () => {
      const type = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.BASIC
      );
      expect(type.value).toBe(SubscriptionPlanTypeEnum.BASIC);
    });

    it("should create a valid SubscriptionPlanTypeValueObject with PRO type", () => {
      const type = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.PRO
      );
      expect(type.value).toBe(SubscriptionPlanTypeEnum.PRO);
    });

    it("should create a valid SubscriptionPlanTypeValueObject with ENTERPRISE type", () => {
      const type = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.ENTERPRISE
      );
      expect(type.value).toBe(SubscriptionPlanTypeEnum.ENTERPRISE);
    });

    it("should throw InvalidEnumValueException for empty string", () => {
      expect(() => {
        new SubscriptionPlanTypeValueObject("");
      }).toThrow(InvalidEnumValueException);
    });

    it("should throw InvalidEnumValueException for string with only whitespace", () => {
      expect(() => {
        new SubscriptionPlanTypeValueObject("   ");
      }).toThrow(InvalidEnumValueException);
    });

    it("should throw InvalidEnumValueException for invalid type", () => {
      expect(() => {
        new SubscriptionPlanTypeValueObject(
          "INVALID_TYPE" as unknown as SubscriptionPlanTypeEnum
        );
      }).toThrow(InvalidEnumValueException);
    });

    it("should throw InvalidEnumValueException for null value", () => {
      expect(() => {
        new SubscriptionPlanTypeValueObject(
          null as unknown as SubscriptionPlanTypeEnum
        );
      }).toThrow(InvalidEnumValueException);
    });

    it("should throw InvalidEnumValueException for undefined value", () => {
      expect(() => {
        new SubscriptionPlanTypeValueObject(
          undefined as unknown as SubscriptionPlanTypeEnum
        );
      }).toThrow(InvalidEnumValueException);
    });
  });

  describe("equals", () => {
    it("should return true for equal types", () => {
      const type1 = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.FREE
      );
      const type2 = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.FREE
      );
      expect(type1.equals(type2)).toBe(true);
    });

    it("should return false for different types", () => {
      const type1 = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.FREE
      );
      const type2 = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.BASIC
      );
      expect(type1.equals(type2)).toBe(false);
    });
  });

  describe("inherited methods from EnumValueObject", () => {
    it("should return the correct value", () => {
      const type = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.FREE
      );
      expect(type.value).toBe("FREE");
    });

    it("should check if equals specific enum value", () => {
      const type = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.FREE
      );
      expect(type.is(SubscriptionPlanTypeEnum.FREE)).toBe(true);
      expect(type.is(SubscriptionPlanTypeEnum.BASIC)).toBe(false);
    });

    it("should check if is one of enum values", () => {
      const type = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.BASIC
      );
      expect(
        type.isOneOf([
          SubscriptionPlanTypeEnum.FREE,
          SubscriptionPlanTypeEnum.BASIC,
        ])
      ).toBe(true);
      expect(
        type.isOneOf([
          SubscriptionPlanTypeEnum.PRO,
          SubscriptionPlanTypeEnum.ENTERPRISE,
        ])
      ).toBe(false);
    });

    it("should check if is not one of enum values", () => {
      const type = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.PRO
      );
      expect(
        type.isNotOneOf([
          SubscriptionPlanTypeEnum.FREE,
          SubscriptionPlanTypeEnum.BASIC,
        ])
      ).toBe(true);
      expect(
        type.isNotOneOf([
          SubscriptionPlanTypeEnum.PRO,
          SubscriptionPlanTypeEnum.ENTERPRISE,
        ])
      ).toBe(false);
    });

    it("should get all enum values", () => {
      const type = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.FREE
      );
      const allValues = type.getAllValues();
      expect(allValues).toContain(SubscriptionPlanTypeEnum.FREE);
      expect(allValues).toContain(SubscriptionPlanTypeEnum.BASIC);
      expect(allValues).toContain(SubscriptionPlanTypeEnum.PRO);
      expect(allValues).toContain(SubscriptionPlanTypeEnum.ENTERPRISE);
    });

    it("should validate enum values correctly for all types", () => {
      const freeType = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.FREE
      );
      expect(freeType.value).toBe("FREE");

      const basicType = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.BASIC
      );
      expect(basicType.value).toBe("BASIC");

      const proType = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.PRO
      );
      expect(proType.value).toBe("PRO");

      const enterpriseType = new SubscriptionPlanTypeValueObject(
        SubscriptionPlanTypeEnum.ENTERPRISE
      );
      expect(enterpriseType.value).toBe("ENTERPRISE");
    });
  });
});
