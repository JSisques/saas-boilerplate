import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';

describe('FeatureNameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid FeatureNameValueObject with a valid name', () => {
      const featureName = new FeatureNameValueObject('Advanced Analytics');
      expect(featureName.value).toBe('Advanced Analytics');
    });

    it('should trim whitespace from the name', () => {
      const featureName = new FeatureNameValueObject('  Advanced Analytics  ');
      expect(featureName.value).toBe('Advanced Analytics');
    });

    it('should create a FeatureNameValueObject with empty string (default behavior)', () => {
      const featureName = new FeatureNameValueObject('');
      expect(featureName.value).toBe('');
    });

    it('should create a FeatureNameValueObject with only whitespace (trims to empty)', () => {
      const featureName = new FeatureNameValueObject('   ');
      expect(featureName.value).toBe('');
    });

    it('should create a FeatureNameValueObject with null value (converts to empty string)', () => {
      const featureName = new FeatureNameValueObject(null as any);
      expect(featureName.value).toBe('');
    });

    it('should create a FeatureNameValueObject with undefined value (converts to empty string)', () => {
      const featureName = new FeatureNameValueObject(undefined as any);
      expect(featureName.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const featureName1 = new FeatureNameValueObject('Advanced Analytics');
      const featureName2 = new FeatureNameValueObject('Advanced Analytics');
      expect(featureName1.equals(featureName2)).toBe(true);
    });

    it('should return false for different names', () => {
      const featureName1 = new FeatureNameValueObject('Advanced Analytics');
      const featureName2 = new FeatureNameValueObject('Basic Analytics');
      expect(featureName1.equals(featureName2)).toBe(false);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct length', () => {
      const featureName = new FeatureNameValueObject('Advanced Analytics');
      expect(featureName.length()).toBe(18);
    });

    it('should check if empty correctly', () => {
      const featureName = new FeatureNameValueObject('Advanced Analytics');
      expect(featureName.isEmpty()).toBe(false);
      expect(featureName.isNotEmpty()).toBe(true);
    });

    it('should check if contains substring', () => {
      const featureName = new FeatureNameValueObject('Advanced Analytics');
      expect(featureName.contains('Analytics')).toBe(true);
      expect(featureName.contains('Basic')).toBe(false);
    });

    it('should check if starts with prefix', () => {
      const featureName = new FeatureNameValueObject('Advanced Analytics');
      expect(featureName.startsWith('Advanced')).toBe(true);
      expect(featureName.startsWith('Basic')).toBe(false);
    });

    it('should check if ends with suffix', () => {
      const featureName = new FeatureNameValueObject('Advanced Analytics');
      expect(featureName.endsWith('Analytics')).toBe(true);
      expect(featureName.endsWith('Features')).toBe(false);
    });
  });
});
