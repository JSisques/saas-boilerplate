import { SubscriptionPlanFeaturesValueObject } from "@/billing-context/subscription-plan/domain/value-objects/subscription-plan-features/subscription-plan-features.vo";
import { InvalidJsonException } from "@repo/shared/domain/exceptions/value-objects/invalid-json.exception";

describe("SubscriptionPlanFeaturesValueObject", () => {
  describe("constructor", () => {
    it("should create a valid SubscriptionPlanFeaturesValueObject with a valid object", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
        users: 5,
      });
      expect(features.value).toEqual({
        storage: "10GB",
        users: 5,
      });
    });

    it("should create with empty object", () => {
      const features = new SubscriptionPlanFeaturesValueObject({});
      expect(features.value).toEqual({});
    });

    it("should create from JSON string", () => {
      const jsonString = '{"storage":"10GB","users":5}';
      const features = new SubscriptionPlanFeaturesValueObject(jsonString);
      expect(features.value).toEqual({
        storage: "10GB",
        users: 5,
      });
    });

    it("should handle nested objects", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: {
          limit: "10GB",
          type: "SSD",
        },
        users: 5,
      });
      expect(features.value).toEqual({
        storage: {
          limit: "10GB",
          type: "SSD",
        },
        users: 5,
      });
    });

    it("should handle arrays in features", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        allowedFeatures: ["feature1", "feature2"],
      });
      expect(features.value).toEqual({
        allowedFeatures: ["feature1", "feature2"],
      });
    });

    it("should throw InvalidJsonException for invalid JSON string", () => {
      expect(() => {
        new SubscriptionPlanFeaturesValueObject("invalid json");
      }).toThrow(InvalidJsonException);
    });

    it("should throw InvalidJsonException for array value", () => {
      expect(() => {
        // @ts-expect-error - Testing invalid input type
        new SubscriptionPlanFeaturesValueObject([]);
      }).toThrow(InvalidJsonException);
    });

    it("should throw InvalidJsonException for primitive value", () => {
      expect(() => {
        // @ts-expect-error - Testing invalid input type
        new SubscriptionPlanFeaturesValueObject(123);
      }).toThrow(InvalidJsonException);
    });

    it("should throw InvalidJsonException for array string", () => {
      expect(() => {
        new SubscriptionPlanFeaturesValueObject("[]");
      }).toThrow(InvalidJsonException);
    });
  });

  describe("equals", () => {
    it("should return true for equal features", () => {
      const features1 = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
      });
      const features2 = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
      });
      expect(features1.equals(features2)).toBe(true);
    });

    it("should return false for different features", () => {
      const features1 = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
      });
      const features2 = new SubscriptionPlanFeaturesValueObject({
        storage: "20GB",
      });
      expect(features1.equals(features2)).toBe(false);
    });
  });

  describe("inherited methods from JsonValueObject", () => {
    it("should check if empty correctly", () => {
      const emptyFeatures = new SubscriptionPlanFeaturesValueObject({});
      expect(emptyFeatures.isEmpty()).toBe(true);

      const nonEmptyFeatures = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
      });
      expect(nonEmptyFeatures.isEmpty()).toBe(false);
    });

    it("should get size correctly", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
        users: 5,
      });
      expect(features.size()).toBe(2);
    });

    it("should check if has key correctly", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
      });
      expect(features.hasKey("storage")).toBe(true);
      expect(features.hasKey("users")).toBe(false);
    });

    it("should get value by key correctly", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
      });
      expect(features.get("storage")).toBe("10GB");
      expect(features.get("users")).toBeUndefined();
    });

    it("should get value with default correctly", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
      });
      expect(features.getOrDefault("users", 0)).toBe(0);
      expect(features.getOrDefault("storage", "0GB")).toBe("10GB");
    });

    it("should get all keys correctly", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
        users: 5,
      });
      const keys = features.keys();
      expect(keys).toContain("storage");
      expect(keys).toContain("users");
    });

    it("should get all values correctly", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
        users: 5,
      });
      const values = features.values();
      expect(values).toContain("10GB");
      expect(values).toContain(5);
    });

    it("should merge features correctly", () => {
      const features1 = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
      });
      const features2 = new SubscriptionPlanFeaturesValueObject({
        users: 5,
      });
      const merged = features1.merge(features2);
      expect(merged.value).toEqual({
        storage: "10GB",
        users: 5,
      });
    });

    it("should pick keys correctly", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
        users: 5,
        bandwidth: "100MB",
      });
      const picked = features.pick(["storage", "users"]);
      expect(picked.value).toEqual({
        storage: "10GB",
        users: 5,
      });
    });

    it("should omit keys correctly", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
        users: 5,
        bandwidth: "100MB",
      });
      const omitted = features.omit(["bandwidth"]);
      expect(omitted.value).toEqual({
        storage: "10GB",
        users: 5,
      });
    });

    it("should convert to string correctly", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
      });
      const stringified = features.toString();
      expect(stringified).toContain("storage");
      expect(stringified).toContain("10GB");
    });

    it("should convert to pretty string correctly", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
      });
      const prettyString = features.toString(true);
      expect(prettyString).toContain("\n");
    });

    it("should clone correctly", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        storage: "10GB",
      });
      const cloned = features.clone();
      expect(cloned.value).toEqual(features.value);
      expect(cloned).not.toBe(features);
    });

    it("should deep clone correctly", () => {
      const features = new SubscriptionPlanFeaturesValueObject({
        nested: {
          value: "10GB",
        },
      });
      const cloned = features.clone(true);
      expect(cloned.get("nested")).not.toBe(features.get("nested"));
    });
  });
});
