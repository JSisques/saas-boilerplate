import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';

describe('FeatureDescriptionValueObject', () => {
  describe('constructor', () => {
    it('should create a valid FeatureDescriptionValueObject with a valid description', () => {
      const featureDescription = new FeatureDescriptionValueObject(
        'This feature enables advanced analytics capabilities',
      );
      expect(featureDescription.value).toBe(
        'This feature enables advanced analytics capabilities',
      );
    });

    it('should trim whitespace from the description', () => {
      const featureDescription = new FeatureDescriptionValueObject(
        '  This feature enables advanced analytics capabilities  ',
      );
      expect(featureDescription.value).toBe(
        'This feature enables advanced analytics capabilities',
      );
    });

    it('should create a FeatureDescriptionValueObject with empty string (default behavior)', () => {
      const featureDescription = new FeatureDescriptionValueObject('');
      expect(featureDescription.value).toBe('');
    });

    it('should create a FeatureDescriptionValueObject with only whitespace (trims to empty)', () => {
      const featureDescription = new FeatureDescriptionValueObject('   ');
      expect(featureDescription.value).toBe('');
    });

    it('should create a FeatureDescriptionValueObject with null value (converts to empty string)', () => {
      const featureDescription = new FeatureDescriptionValueObject(null as any);
      expect(featureDescription.value).toBe('');
    });

    it('should create a FeatureDescriptionValueObject with undefined value (converts to empty string)', () => {
      const featureDescription = new FeatureDescriptionValueObject(
        undefined as any,
      );
      expect(featureDescription.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal descriptions', () => {
      const featureDescription1 = new FeatureDescriptionValueObject(
        'This feature enables advanced analytics capabilities',
      );
      const featureDescription2 = new FeatureDescriptionValueObject(
        'This feature enables advanced analytics capabilities',
      );
      expect(featureDescription1.equals(featureDescription2)).toBe(true);
    });

    it('should return false for different descriptions', () => {
      const featureDescription1 = new FeatureDescriptionValueObject(
        'This feature enables advanced analytics capabilities',
      );
      const featureDescription2 = new FeatureDescriptionValueObject(
        'This feature enables basic analytics capabilities',
      );
      expect(featureDescription1.equals(featureDescription2)).toBe(false);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct length', () => {
      const featureDescription = new FeatureDescriptionValueObject(
        'This feature enables advanced analytics capabilities',
      );
      expect(featureDescription.length()).toBe(52);
    });

    it('should check if empty correctly', () => {
      const featureDescription = new FeatureDescriptionValueObject(
        'This feature enables advanced analytics capabilities',
      );
      expect(featureDescription.isEmpty()).toBe(false);
      expect(featureDescription.isNotEmpty()).toBe(true);
    });

    it('should check if contains substring', () => {
      const featureDescription = new FeatureDescriptionValueObject(
        'This feature enables advanced analytics capabilities',
      );
      expect(featureDescription.contains('analytics')).toBe(true);
      expect(featureDescription.contains('basic')).toBe(false);
    });

    it('should check if starts with prefix', () => {
      const featureDescription = new FeatureDescriptionValueObject(
        'This feature enables advanced analytics capabilities',
      );
      expect(featureDescription.startsWith('This')).toBe(true);
      expect(featureDescription.startsWith('That')).toBe(false);
    });

    it('should check if ends with suffix', () => {
      const featureDescription = new FeatureDescriptionValueObject(
        'This feature enables advanced analytics capabilities',
      );
      expect(featureDescription.endsWith('capabilities')).toBe(true);
      expect(featureDescription.endsWith('features')).toBe(false);
    });
  });
});
