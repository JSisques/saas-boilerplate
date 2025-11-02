import { SubscriptionPlanDescriptionValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-description/subscription-plan-description.vo';

describe('SubscriptionPlanDescriptionValueObject', () => {
  describe('constructor', () => {
    it('should create a valid SubscriptionPlanDescriptionValueObject with a valid description', () => {
      const description = new SubscriptionPlanDescriptionValueObject(
        'Basic plan with essential features',
      );
      expect(description.value).toBe('Basic plan with essential features');
    });

    it('should trim whitespace from the description', () => {
      const description = new SubscriptionPlanDescriptionValueObject(
        '  Basic plan  ',
      );
      expect(description.value).toBe('Basic plan');
    });

    it('should create a SubscriptionPlanDescriptionValueObject with empty string (default behavior)', () => {
      const description = new SubscriptionPlanDescriptionValueObject('');
      expect(description.value).toBe('');
    });

    it('should create a SubscriptionPlanDescriptionValueObject with only whitespace (trims to empty)', () => {
      const description = new SubscriptionPlanDescriptionValueObject('   ');
      expect(description.value).toBe('');
    });

    it('should create a SubscriptionPlanDescriptionValueObject with null value (converts to empty string)', () => {
      const description = new SubscriptionPlanDescriptionValueObject(
        null as any,
      );
      expect(description.value).toBe('');
    });

    it('should create a SubscriptionPlanDescriptionValueObject with undefined value (converts to empty string)', () => {
      const description = new SubscriptionPlanDescriptionValueObject(
        undefined as any,
      );
      expect(description.value).toBe('');
    });

    it('should handle long descriptions', () => {
      const longDescription =
        'This is a very long description that contains multiple sentences and provides comprehensive information about the subscription plan features and benefits.';
      const description = new SubscriptionPlanDescriptionValueObject(
        longDescription,
      );
      expect(description.value).toBe(longDescription);
    });
  });

  describe('equals', () => {
    it('should return true for equal descriptions', () => {
      const description1 = new SubscriptionPlanDescriptionValueObject(
        'Basic plan features',
      );
      const description2 = new SubscriptionPlanDescriptionValueObject(
        'Basic plan features',
      );
      expect(description1.equals(description2)).toBe(true);
    });

    it('should return false for different descriptions', () => {
      const description1 = new SubscriptionPlanDescriptionValueObject(
        'Basic plan features',
      );
      const description2 = new SubscriptionPlanDescriptionValueObject(
        'Premium plan features',
      );
      expect(description1.equals(description2)).toBe(false);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct length', () => {
      const description = new SubscriptionPlanDescriptionValueObject(
        'Basic plan features',
      );
      expect(description.length()).toBe(19);
    });

    it('should check if empty correctly', () => {
      const description = new SubscriptionPlanDescriptionValueObject(
        'Basic plan features',
      );
      expect(description.isEmpty()).toBe(false);
      expect(description.isNotEmpty()).toBe(true);
    });

    it('should check if contains substring', () => {
      const description = new SubscriptionPlanDescriptionValueObject(
        'Basic plan with features',
      );
      expect(description.contains('features')).toBe(true);
      expect(description.contains('premium')).toBe(false);
    });

    it('should check if starts with prefix', () => {
      const description = new SubscriptionPlanDescriptionValueObject(
        'Basic plan features',
      );
      expect(description.startsWith('Basic')).toBe(true);
      expect(description.startsWith('Premium')).toBe(false);
    });

    it('should check if ends with suffix', () => {
      const description = new SubscriptionPlanDescriptionValueObject(
        'Basic plan features',
      );
      expect(description.endsWith('features')).toBe(true);
      expect(description.endsWith('benefits')).toBe(false);
    });
  });
});
