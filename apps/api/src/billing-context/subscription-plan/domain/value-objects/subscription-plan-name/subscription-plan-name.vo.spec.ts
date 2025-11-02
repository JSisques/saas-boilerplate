import { SubscriptionPlanNameValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-name/subscription-plan-name.vo';

describe('SubscriptionPlanNameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid SubscriptionPlanNameValueObject with a valid name', () => {
      const name = new SubscriptionPlanNameValueObject('Basic Plan');
      expect(name.value).toBe('Basic Plan');
    });

    it('should trim whitespace from the name', () => {
      const name = new SubscriptionPlanNameValueObject('  Basic Plan  ');
      expect(name.value).toBe('Basic Plan');
    });

    it('should create a SubscriptionPlanNameValueObject with empty string (default behavior)', () => {
      const name = new SubscriptionPlanNameValueObject('');
      expect(name.value).toBe('');
    });

    it('should create a SubscriptionPlanNameValueObject with only whitespace (trims to empty)', () => {
      const name = new SubscriptionPlanNameValueObject('   ');
      expect(name.value).toBe('');
    });

    it('should create a SubscriptionPlanNameValueObject with null value (converts to empty string)', () => {
      const name = new SubscriptionPlanNameValueObject(null as any);
      expect(name.value).toBe('');
    });

    it('should create a SubscriptionPlanNameValueObject with undefined value (converts to empty string)', () => {
      const name = new SubscriptionPlanNameValueObject(undefined as any);
      expect(name.value).toBe('');
    });

    it('should handle long plan names', () => {
      const longName = 'Enterprise Premium Plan with Advanced Features';
      const name = new SubscriptionPlanNameValueObject(longName);
      expect(name.value).toBe(longName);
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const name1 = new SubscriptionPlanNameValueObject('Basic Plan');
      const name2 = new SubscriptionPlanNameValueObject('Basic Plan');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different names', () => {
      const name1 = new SubscriptionPlanNameValueObject('Basic Plan');
      const name2 = new SubscriptionPlanNameValueObject('Premium Plan');
      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct length', () => {
      const name = new SubscriptionPlanNameValueObject('Basic Plan');
      expect(name.length()).toBe(10);
    });

    it('should check if empty correctly', () => {
      const name = new SubscriptionPlanNameValueObject('Basic Plan');
      expect(name.isEmpty()).toBe(false);
      expect(name.isNotEmpty()).toBe(true);
    });

    it('should check if contains substring', () => {
      const name = new SubscriptionPlanNameValueObject('Basic Plan');
      expect(name.contains('Basic')).toBe(true);
      expect(name.contains('Premium')).toBe(false);
    });

    it('should check if starts with prefix', () => {
      const name = new SubscriptionPlanNameValueObject('Basic Plan');
      expect(name.startsWith('Basic')).toBe(true);
      expect(name.startsWith('Premium')).toBe(false);
    });

    it('should check if ends with suffix', () => {
      const name = new SubscriptionPlanNameValueObject('Basic Plan');
      expect(name.endsWith('Plan')).toBe(true);
      expect(name.endsWith('Premium')).toBe(false);
    });
  });
});
