import { SubscriptionPlanSlugValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-slug/subscription-plan-slug.vo";
import { InvalidStringException } from "@repo/shared/domain/exceptions/value-objects/invalid-string.exception";

describe("SubscriptionPlanSlugValueObject", () => {
  describe("constructor", () => {
    it("should create a valid SubscriptionPlanSlugValueObject with a valid slug", () => {
      const slug = new SubscriptionPlanSlugValueObject("basic-plan");
      expect(slug.value).toBe("basic-plan");
    });

    it("should trim whitespace from the slug", () => {
      const slug = new SubscriptionPlanSlugValueObject("  basic-plan  ");
      expect(slug.value).toBe("basic-plan");
    });

    it("should throw InvalidStringException for empty string", () => {
      expect(() => {
        new SubscriptionPlanSlugValueObject("");
      }).toThrow(InvalidStringException);
    });

    it("should throw InvalidStringException for string with only whitespace", () => {
      expect(() => {
        new SubscriptionPlanSlugValueObject("   ");
      }).toThrow(InvalidStringException);
    });

    it("should throw InvalidStringException for slug starting with hyphen", () => {
      expect(() => {
        new SubscriptionPlanSlugValueObject("-basic-plan");
      }).toThrow(InvalidStringException);
    });

    it("should throw InvalidStringException for slug ending with hyphen", () => {
      expect(() => {
        new SubscriptionPlanSlugValueObject("basic-plan-");
      }).toThrow(InvalidStringException);
    });

    it("should throw InvalidStringException for slug with uppercase letters", () => {
      expect(() => {
        new SubscriptionPlanSlugValueObject("Basic-Plan");
      }).toThrow(InvalidStringException);
    });

    it("should throw InvalidStringException for slug with special characters", () => {
      expect(() => {
        new SubscriptionPlanSlugValueObject("basic_plan!");
      }).toThrow(InvalidStringException);
    });

    it("should throw InvalidStringException for slug with spaces", () => {
      expect(() => {
        new SubscriptionPlanSlugValueObject("basic plan");
      }).toThrow(InvalidStringException);
    });

    it("should throw InvalidStringException for null value", () => {
      expect(() => {
        new SubscriptionPlanSlugValueObject(null as any);
      }).toThrow(InvalidStringException);
    });

    it("should throw InvalidStringException for undefined value", () => {
      expect(() => {
        new SubscriptionPlanSlugValueObject(undefined as any);
      }).toThrow(InvalidStringException);
    });
  });

  describe("equals", () => {
    it("should return true for equal slugs", () => {
      const slug1 = new SubscriptionPlanSlugValueObject("basic-plan");
      const slug2 = new SubscriptionPlanSlugValueObject("basic-plan");
      expect(slug1.equals(slug2)).toBe(true);
    });

    it("should return false for different slugs", () => {
      const slug1 = new SubscriptionPlanSlugValueObject("basic-plan");
      const slug2 = new SubscriptionPlanSlugValueObject("premium-plan");
      expect(slug1.equals(slug2)).toBe(false);
    });
  });

  describe("inherited methods from SlugValueObject", () => {
    it("should check if valid slug correctly", () => {
      const slug = new SubscriptionPlanSlugValueObject("basic-plan");
      expect(slug.isValidSlug()).toBe(true);
    });

    it("should get word count correctly", () => {
      const slug = new SubscriptionPlanSlugValueObject("basic-plan");
      expect(slug.getWordCount()).toBe(2);
    });

    it("should convert to human readable correctly", () => {
      const slug = new SubscriptionPlanSlugValueObject("basic-plan");
      const humanReadable = slug.toHumanReadable();
      expect(humanReadable.value).toBe("Basic Plan");
    });

    it("should add suffix correctly", () => {
      const slug = new SubscriptionPlanSlugValueObject("basic");
      const newSlug = slug.addSuffix("plan");
      expect(newSlug.value).toBe("basic-plan");
    });

    it("should add prefix correctly", () => {
      const slug = new SubscriptionPlanSlugValueObject("plan");
      const newSlug = slug.addPrefix("basic");
      expect(newSlug.value).toBe("basic-plan");
    });

    it("should generate slug from string correctly", () => {
      const slug = SubscriptionPlanSlugValueObject.fromString("Basic Plan");
      expect(slug.value).toBe("basic-plan");
    });

    it("should generate slug from string with special characters", () => {
      const slug =
        SubscriptionPlanSlugValueObject.fromString("Basic Plan 123!@#");
      expect(slug.value).toBe("basic-plan-123");
    });

    it("should handle long slugs correctly", () => {
      const longSlug = "basic-plan-with-many-features-and-benefits";
      const slug = new SubscriptionPlanSlugValueObject(longSlug);
      expect(slug.value).toBe(longSlug);
    });

    it("should handle numbers in slug correctly", () => {
      const slug = new SubscriptionPlanSlugValueObject("plan-123-456");
      expect(slug.value).toBe("plan-123-456");
    });
  });

  describe("inherited methods from StringValueObject", () => {
    it("should return correct length", () => {
      const slug = new SubscriptionPlanSlugValueObject("basic-plan");
      expect(slug.length()).toBe(10);
    });

    it("should check if empty correctly", () => {
      const slug = new SubscriptionPlanSlugValueObject("basic-plan");
      expect(slug.isEmpty()).toBe(false);
      expect(slug.isNotEmpty()).toBe(true);
    });

    it("should check if contains substring", () => {
      const slug = new SubscriptionPlanSlugValueObject("basic-plan");
      expect(slug.contains("basic")).toBe(true);
      expect(slug.contains("premium")).toBe(false);
    });
  });
});
