import { SubscriptionPlanTrialPeriodDaysValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-trial-period-days/subscription-plan-trial-period-days.vo';
import { InvalidNumberException } from '@/shared/domain/exceptions/value-objects/invalid-number.exception';

describe('SubscriptionPlanTrialPeriodDaysValueObject', () => {
  describe('constructor', () => {
    it('should create a valid SubscriptionPlanTrialPeriodDaysValueObject with a valid number', () => {
      const days = new SubscriptionPlanTrialPeriodDaysValueObject(7);
      expect(days.value).toBe(7);
    });

    it('should create from string value', () => {
      const days = new SubscriptionPlanTrialPeriodDaysValueObject('14');
      expect(days.value).toBe(14);
    });

    it('should handle zero value', () => {
      const days = new SubscriptionPlanTrialPeriodDaysValueObject(0);
      expect(days.value).toBe(0);
    });

    it('should handle positive integers', () => {
      const days = new SubscriptionPlanTrialPeriodDaysValueObject(30);
      expect(days.value).toBe(30);
    });

    it('should throw InvalidNumberException for invalid string', () => {
      expect(() => {
        new SubscriptionPlanTrialPeriodDaysValueObject('invalid');
      }).toThrow(InvalidNumberException);
    });

    it('should throw InvalidNumberException for Infinity', () => {
      expect(() => {
        new SubscriptionPlanTrialPeriodDaysValueObject(Infinity);
      }).toThrow(InvalidNumberException);
    });

    it('should throw InvalidNumberException for NaN', () => {
      expect(() => {
        new SubscriptionPlanTrialPeriodDaysValueObject(NaN);
      }).toThrow(InvalidNumberException);
    });
  });

  describe('equals', () => {
    it('should return true for equal days', () => {
      const days1 = new SubscriptionPlanTrialPeriodDaysValueObject(7);
      const days2 = new SubscriptionPlanTrialPeriodDaysValueObject(7);
      expect(days1.equals(days2)).toBe(true);
    });

    it('should return false for different days', () => {
      const days1 = new SubscriptionPlanTrialPeriodDaysValueObject(7);
      const days2 = new SubscriptionPlanTrialPeriodDaysValueObject(14);
      expect(days1.equals(days2)).toBe(false);
    });
  });

  describe('inherited methods from NumberValueObject', () => {
    it('should check if positive correctly', () => {
      const days = new SubscriptionPlanTrialPeriodDaysValueObject(7);
      expect(days.isPositive()).toBe(true);
    });

    it('should check if negative correctly', () => {
      const days = new SubscriptionPlanTrialPeriodDaysValueObject(-7);
      expect(days.isNegative()).toBe(true);
    });

    it('should check if zero correctly', () => {
      const days = new SubscriptionPlanTrialPeriodDaysValueObject(0);
      expect(days.isZero()).toBe(true);
    });

    it('should check if in range correctly', () => {
      const days = new SubscriptionPlanTrialPeriodDaysValueObject(15);
      expect(days.isInRange(1, 30)).toBe(true);
      expect(days.isInRange(30, 60)).toBe(false);
    });

    it('should round correctly', () => {
      const days = new SubscriptionPlanTrialPeriodDaysValueObject(7.5);
      expect(days.round(0)).toBe(8);
    });
  });
});
