import { SubscriptionPlanLimitsValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-limits/subscription-plan-limits.vo';
import { InvalidJsonException } from '@/shared/domain/exceptions/value-objects/invalid-json/invalid-json.exception';

describe('SubscriptionPlanLimitsValueObject', () => {
  describe('constructor', () => {
    it('should create a valid SubscriptionPlanLimitsValueObject with a valid object', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
        maxUsers: 10,
      });
      expect(limits.value).toEqual({
        maxStorage: 100,
        maxUsers: 10,
      });
    });

    it('should create with empty object', () => {
      const limits = new SubscriptionPlanLimitsValueObject({});
      expect(limits.value).toEqual({});
    });

    it('should create from JSON string', () => {
      const jsonString = '{"maxStorage":100,"maxUsers":10}';
      const limits = new SubscriptionPlanLimitsValueObject(jsonString);
      expect(limits.value).toEqual({
        maxStorage: 100,
        maxUsers: 10,
      });
    });

    it('should handle nested objects', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        storage: {
          max: 100,
          unit: 'GB',
        },
        users: {
          max: 10,
        },
      });
      expect(limits.value).toEqual({
        storage: {
          max: 100,
          unit: 'GB',
        },
        users: {
          max: 10,
        },
      });
    });

    it('should handle arrays in limits', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        allowedRegions: ['US', 'EU'],
      });
      expect(limits.value).toEqual({
        allowedRegions: ['US', 'EU'],
      });
    });

    it('should throw InvalidJsonException for invalid JSON string', () => {
      expect(() => {
        new SubscriptionPlanLimitsValueObject('invalid json');
      }).toThrow(InvalidJsonException);
    });

    it('should throw InvalidJsonException for array value', () => {
      expect(() => {
        new SubscriptionPlanLimitsValueObject([]);
      }).toThrow(InvalidJsonException);
    });

    it('should throw InvalidJsonException for primitive value', () => {
      expect(() => {
        new SubscriptionPlanLimitsValueObject('primitive' as any);
      }).toThrow(InvalidJsonException);
    });

    it('should throw InvalidJsonException for array string', () => {
      expect(() => {
        new SubscriptionPlanLimitsValueObject('[]');
      }).toThrow(InvalidJsonException);
    });
  });

  describe('equals', () => {
    it('should return true for equal limits', () => {
      const limits1 = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
      });
      const limits2 = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
      });
      expect(limits1.equals(limits2)).toBe(true);
    });

    it('should return false for different limits', () => {
      const limits1 = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
      });
      const limits2 = new SubscriptionPlanLimitsValueObject({
        maxStorage: 200,
      });
      expect(limits1.equals(limits2)).toBe(false);
    });
  });

  describe('inherited methods from JsonValueObject', () => {
    it('should check if empty correctly', () => {
      const emptyLimits = new SubscriptionPlanLimitsValueObject({});
      expect(emptyLimits.isEmpty()).toBe(true);

      const nonEmptyLimits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
      });
      expect(nonEmptyLimits.isEmpty()).toBe(false);
    });

    it('should get size correctly', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
        maxUsers: 10,
      });
      expect(limits.size()).toBe(2);
    });

    it('should check if has key correctly', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
      });
      expect(limits.hasKey('maxStorage')).toBe(true);
      expect(limits.hasKey('maxUsers')).toBe(false);
    });

    it('should get value by key correctly', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
      });
      expect(limits.get('maxStorage')).toBe(100);
      expect(limits.get('maxUsers')).toBeUndefined();
    });

    it('should get value with default correctly', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
      });
      expect(limits.getOrDefault('maxUsers', 0)).toBe(0);
      expect(limits.getOrDefault('maxStorage', 0)).toBe(100);
    });

    it('should get all keys correctly', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
        maxUsers: 10,
      });
      const keys = limits.keys();
      expect(keys).toContain('maxStorage');
      expect(keys).toContain('maxUsers');
    });

    it('should get all values correctly', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
        maxUsers: 10,
      });
      const values = limits.values();
      expect(values).toContain(100);
      expect(values).toContain(10);
    });

    it('should merge limits correctly', () => {
      const limits1 = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
      });
      const limits2 = new SubscriptionPlanLimitsValueObject({
        maxUsers: 10,
      });
      const merged = limits1.merge(limits2);
      expect(merged.value).toEqual({
        maxStorage: 100,
        maxUsers: 10,
      });
    });

    it('should pick keys correctly', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
        maxUsers: 10,
        maxBandwidth: 50,
      });
      const picked = limits.pick(['maxStorage', 'maxUsers']);
      expect(picked.value).toEqual({
        maxStorage: 100,
        maxUsers: 10,
      });
    });

    it('should omit keys correctly', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
        maxUsers: 10,
        maxBandwidth: 50,
      });
      const omitted = limits.omit(['maxBandwidth']);
      expect(omitted.value).toEqual({
        maxStorage: 100,
        maxUsers: 10,
      });
    });

    it('should convert to string correctly', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
      });
      const stringified = limits.toString();
      expect(stringified).toContain('maxStorage');
      expect(stringified).toContain('100');
    });

    it('should convert to pretty string correctly', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
      });
      const prettyString = limits.toString(true);
      expect(prettyString).toContain('\n');
    });

    it('should clone correctly', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        maxStorage: 100,
      });
      const cloned = limits.clone();
      expect(cloned.value).toEqual(limits.value);
      expect(cloned).not.toBe(limits);
    });

    it('should deep clone correctly', () => {
      const limits = new SubscriptionPlanLimitsValueObject({
        nested: {
          value: 100,
        },
      });
      const cloned = limits.clone(true);
      expect(cloned.get('nested')).not.toBe(limits.get('nested'));
    });
  });
});
