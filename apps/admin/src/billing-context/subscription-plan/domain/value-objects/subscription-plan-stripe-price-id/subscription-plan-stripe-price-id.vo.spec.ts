import { SubscriptionPlanStripePriceIdValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-stripe-price-id/subscription-plan-stripe-price-id.vo";

describe("SubscriptionPlanStripePriceIdValueObject", () => {
  describe("constructor", () => {
    it("should create a valid SubscriptionPlanStripePriceIdValueObject with a valid Stripe price ID", () => {
      const stripePriceId = new SubscriptionPlanStripePriceIdValueObject(
        "price_1234567890"
      );
      expect(stripePriceId.value).toBe("price_1234567890");
    });

    it("should trim whitespace from the Stripe price ID", () => {
      const stripePriceId = new SubscriptionPlanStripePriceIdValueObject(
        "  price_1234567890  "
      );
      expect(stripePriceId.value).toBe("price_1234567890");
    });

    it("should create a SubscriptionPlanStripePriceIdValueObject with empty string (default behavior)", () => {
      const stripePriceId = new SubscriptionPlanStripePriceIdValueObject("");
      expect(stripePriceId.value).toBe("");
    });

    it("should create a SubscriptionPlanStripePriceIdValueObject with only whitespace (trims to empty)", () => {
      const stripePriceId = new SubscriptionPlanStripePriceIdValueObject("   ");
      expect(stripePriceId.value).toBe("");
    });

    it("should create a SubscriptionPlanStripePriceIdValueObject with null value (converts to empty string)", () => {
      const stripePriceId = new SubscriptionPlanStripePriceIdValueObject(
        null as unknown as string
      );
      expect(stripePriceId.value).toBe("");
    });

    it("should create a SubscriptionPlanStripePriceIdValueObject with undefined value (converts to empty string)", () => {
      const stripePriceId = new SubscriptionPlanStripePriceIdValueObject(
        undefined as unknown as string
      );
      expect(stripePriceId.value).toBe("");
    });

    it("should handle Stripe price IDs with different formats", () => {
      const stripePriceId = new SubscriptionPlanStripePriceIdValueObject(
        "price_abcd1234xyz"
      );
      expect(stripePriceId.value).toBe("price_abcd1234xyz");
    });
  });

  describe("equals", () => {
    it("should return true for equal Stripe price IDs", () => {
      const stripePriceId1 = new SubscriptionPlanStripePriceIdValueObject(
        "price_1234567890"
      );
      const stripePriceId2 = new SubscriptionPlanStripePriceIdValueObject(
        "price_1234567890"
      );
      expect(stripePriceId1.equals(stripePriceId2)).toBe(true);
    });

    it("should return false for different Stripe price IDs", () => {
      const stripePriceId1 = new SubscriptionPlanStripePriceIdValueObject(
        "price_1234567890"
      );
      const stripePriceId2 = new SubscriptionPlanStripePriceIdValueObject(
        "price_0987654321"
      );
      expect(stripePriceId1.equals(stripePriceId2)).toBe(false);
    });
  });

  describe("inherited methods from StringValueObject", () => {
    it("should return correct length", () => {
      const stripePriceId = new SubscriptionPlanStripePriceIdValueObject(
        "price_1234567890"
      );
      expect(stripePriceId.length()).toBe(16);
    });

    it("should check if empty correctly", () => {
      const stripePriceId = new SubscriptionPlanStripePriceIdValueObject(
        "price_1234567890"
      );
      expect(stripePriceId.isEmpty()).toBe(false);
      expect(stripePriceId.isNotEmpty()).toBe(true);
    });

    it("should check if contains substring", () => {
      const stripePriceId = new SubscriptionPlanStripePriceIdValueObject(
        "price_1234567890"
      );
      expect(stripePriceId.contains("price_")).toBe(true);
      expect(stripePriceId.contains("price_999")).toBe(false);
    });

    it("should check if starts with prefix", () => {
      const stripePriceId = new SubscriptionPlanStripePriceIdValueObject(
        "price_1234567890"
      );
      expect(stripePriceId.startsWith("price_")).toBe(true);
      expect(stripePriceId.startsWith("sub_")).toBe(false);
    });

    it("should check if ends with suffix", () => {
      const stripePriceId = new SubscriptionPlanStripePriceIdValueObject(
        "price_1234567890"
      );
      expect(stripePriceId.endsWith("7890")).toBe(true);
      expect(stripePriceId.endsWith("9999")).toBe(false);
    });
  });
});
