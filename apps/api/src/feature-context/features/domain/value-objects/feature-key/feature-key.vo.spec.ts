import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';

describe('FeatureKeyValueObject', () => {
  describe('constructor', () => {
    it('should create a valid FeatureKeyValueObject with a valid key', () => {
      const featureKey = new FeatureKeyValueObject('advanced-analytics');
      expect(featureKey.value).toBe('advanced-analytics');
    });

    it('should trim whitespace from the key', () => {
      const featureKey = new FeatureKeyValueObject('  advanced-analytics  ');
      expect(featureKey.value).toBe('advanced-analytics');
    });

    it('should throw InvalidStringException for empty string (slug cannot be empty)', () => {
      expect(() => new FeatureKeyValueObject('')).toThrow();
    });

    it('should throw InvalidStringException for only whitespace (trims to empty)', () => {
      expect(() => new FeatureKeyValueObject('   ')).toThrow();
    });

    it('should throw InvalidStringException for null value', () => {
      expect(() => new FeatureKeyValueObject(null as any)).toThrow();
    });

    it('should throw InvalidStringException for undefined value', () => {
      expect(() => new FeatureKeyValueObject(undefined as any)).toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for equal keys', () => {
      const featureKey1 = new FeatureKeyValueObject('advanced-analytics');
      const featureKey2 = new FeatureKeyValueObject('advanced-analytics');
      expect(featureKey1.equals(featureKey2)).toBe(true);
    });

    it('should return false for different keys', () => {
      const featureKey1 = new FeatureKeyValueObject('advanced-analytics');
      const featureKey2 = new FeatureKeyValueObject('basic-analytics');
      expect(featureKey1.equals(featureKey2)).toBe(false);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct length', () => {
      const featureKey = new FeatureKeyValueObject('advanced-analytics');
      expect(featureKey.length()).toBe(18);
    });

    it('should check if empty correctly', () => {
      const featureKey = new FeatureKeyValueObject('advanced-analytics');
      expect(featureKey.isEmpty()).toBe(false);
      expect(featureKey.isNotEmpty()).toBe(true);
    });

    it('should check if contains substring', () => {
      const featureKey = new FeatureKeyValueObject('advanced-analytics');
      expect(featureKey.contains('analytics')).toBe(true);
      expect(featureKey.contains('basic')).toBe(false);
    });

    it('should check if starts with prefix', () => {
      const featureKey = new FeatureKeyValueObject('advanced-analytics');
      expect(featureKey.startsWith('advanced')).toBe(true);
      expect(featureKey.startsWith('basic')).toBe(false);
    });

    it('should check if ends with suffix', () => {
      const featureKey = new FeatureKeyValueObject('advanced-analytics');
      expect(featureKey.endsWith('analytics')).toBe(true);
      expect(featureKey.endsWith('features')).toBe(false);
    });
  });
});
