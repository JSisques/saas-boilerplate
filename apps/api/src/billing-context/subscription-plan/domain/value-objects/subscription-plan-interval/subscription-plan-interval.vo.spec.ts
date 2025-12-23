import { SubscriptionPlanIntervalEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-interval/subscription-plan-interval.enum';
import { SubscriptionPlanIntervalValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-interval/subscription-plan-interval.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('SubscriptionPlanIntervalValueObject', () => {
  describe('constructor', () => {
    it('should create a valid SubscriptionPlanIntervalValueObject with MONTHLY interval', () => {
      const interval = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.MONTHLY,
      );
      expect(interval.value).toBe(SubscriptionPlanIntervalEnum.MONTHLY);
    });

    it('should create a valid SubscriptionPlanIntervalValueObject with YEARLY interval', () => {
      const interval = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.YEARLY,
      );
      expect(interval.value).toBe(SubscriptionPlanIntervalEnum.YEARLY);
    });

    it('should throw InvalidEnumValueException for empty string', () => {
      expect(() => {
        new SubscriptionPlanIntervalValueObject('');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for string with only whitespace', () => {
      expect(() => {
        new SubscriptionPlanIntervalValueObject('   ');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for invalid interval', () => {
      expect(() => {
        new SubscriptionPlanIntervalValueObject('INVALID_INTERVAL' as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for null value', () => {
      expect(() => {
        new SubscriptionPlanIntervalValueObject(null as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for undefined value', () => {
      expect(() => {
        new SubscriptionPlanIntervalValueObject(undefined as any);
      }).toThrow(InvalidEnumValueException);
    });
  });

  describe('equals', () => {
    it('should return true for equal intervals', () => {
      const interval1 = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.MONTHLY,
      );
      const interval2 = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.MONTHLY,
      );
      expect(interval1.equals(interval2)).toBe(true);
    });

    it('should return false for different intervals', () => {
      const interval1 = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.MONTHLY,
      );
      const interval2 = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.YEARLY,
      );
      expect(interval1.equals(interval2)).toBe(false);
    });
  });

  describe('inherited methods from EnumValueObject', () => {
    it('should return the correct value', () => {
      const interval = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.MONTHLY,
      );
      expect(interval.value).toBe('MONTHLY');
    });

    it('should check if equals specific enum value', () => {
      const interval = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.MONTHLY,
      );
      expect(interval.is(SubscriptionPlanIntervalEnum.MONTHLY)).toBe(true);
      expect(interval.is(SubscriptionPlanIntervalEnum.YEARLY)).toBe(false);
    });

    it('should check if is one of enum values', () => {
      const interval = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.YEARLY,
      );
      expect(
        interval.isOneOf([
          SubscriptionPlanIntervalEnum.MONTHLY,
          SubscriptionPlanIntervalEnum.YEARLY,
        ]),
      ).toBe(true);
      expect(interval.isOneOf([SubscriptionPlanIntervalEnum.MONTHLY])).toBe(
        false,
      );
    });

    it('should check if is not one of enum values', () => {
      const interval = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.MONTHLY,
      );
      expect(interval.isNotOneOf([SubscriptionPlanIntervalEnum.YEARLY])).toBe(
        true,
      );
      expect(
        interval.isNotOneOf([
          SubscriptionPlanIntervalEnum.MONTHLY,
          SubscriptionPlanIntervalEnum.YEARLY,
        ]),
      ).toBe(false);
    });

    it('should get all enum values', () => {
      const interval = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.MONTHLY,
      );
      const allValues = interval.getAllValues();
      expect(allValues).toContain(SubscriptionPlanIntervalEnum.MONTHLY);
      expect(allValues).toContain(SubscriptionPlanIntervalEnum.YEARLY);
    });

    it('should validate enum values correctly for all intervals', () => {
      const monthlyInterval = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.MONTHLY,
      );
      expect(monthlyInterval.value).toBe('MONTHLY');

      const yearlyInterval = new SubscriptionPlanIntervalValueObject(
        SubscriptionPlanIntervalEnum.YEARLY,
      );
      expect(yearlyInterval.value).toBe('YEARLY');
    });
  });
});
