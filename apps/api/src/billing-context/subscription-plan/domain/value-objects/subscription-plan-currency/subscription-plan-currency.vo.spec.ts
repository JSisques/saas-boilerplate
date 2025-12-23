import { SubscriptionPlanCurrencyEnum } from '@/billing-context/subscription-plan/domain/enum/subscription-plan-currency/subscription-plan-currency.enum';
import { SubscriptionPlanCurrencyValueObject } from '@/billing-context/subscription-plan/domain/value-objects/subscription-plan-currency/subscription-plan-currency.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('SubscriptionPlanCurrencyValueObject', () => {
  describe('constructor', () => {
    it('should create a valid SubscriptionPlanCurrencyValueObject with USD', () => {
      const currency = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.USD,
      );
      expect(currency.value).toBe(SubscriptionPlanCurrencyEnum.USD);
    });

    it('should create a valid SubscriptionPlanCurrencyValueObject with EUR', () => {
      const currency = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.EUR,
      );
      expect(currency.value).toBe(SubscriptionPlanCurrencyEnum.EUR);
    });

    it('should create a valid SubscriptionPlanCurrencyValueObject with GBP', () => {
      const currency = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.GBP,
      );
      expect(currency.value).toBe(SubscriptionPlanCurrencyEnum.GBP);
    });

    it('should create a valid SubscriptionPlanCurrencyValueObject with JPY', () => {
      const currency = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.JPY,
      );
      expect(currency.value).toBe(SubscriptionPlanCurrencyEnum.JPY);
    });

    it('should throw InvalidEnumValueException for empty string', () => {
      expect(() => {
        new SubscriptionPlanCurrencyValueObject('');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for string with only whitespace', () => {
      expect(() => {
        new SubscriptionPlanCurrencyValueObject('   ');
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for invalid currency', () => {
      expect(() => {
        new SubscriptionPlanCurrencyValueObject('INVALID_CURRENCY' as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for null value', () => {
      expect(() => {
        new SubscriptionPlanCurrencyValueObject(null as any);
      }).toThrow(InvalidEnumValueException);
    });

    it('should throw InvalidEnumValueException for undefined value', () => {
      expect(() => {
        new SubscriptionPlanCurrencyValueObject(undefined as any);
      }).toThrow(InvalidEnumValueException);
    });
  });

  describe('equals', () => {
    it('should return true for equal currencies', () => {
      const currency1 = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.USD,
      );
      const currency2 = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.USD,
      );
      expect(currency1.equals(currency2)).toBe(true);
    });

    it('should return false for different currencies', () => {
      const currency1 = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.USD,
      );
      const currency2 = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.EUR,
      );
      expect(currency1.equals(currency2)).toBe(false);
    });
  });

  describe('inherited methods from EnumValueObject', () => {
    it('should return the correct value', () => {
      const currency = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.USD,
      );
      expect(currency.value).toBe('USD');
    });

    it('should check if equals specific enum value', () => {
      const currency = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.USD,
      );
      expect(currency.is(SubscriptionPlanCurrencyEnum.USD)).toBe(true);
      expect(currency.is(SubscriptionPlanCurrencyEnum.EUR)).toBe(false);
    });

    it('should check if is one of enum values', () => {
      const currency = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.EUR,
      );
      expect(
        currency.isOneOf([
          SubscriptionPlanCurrencyEnum.USD,
          SubscriptionPlanCurrencyEnum.EUR,
        ]),
      ).toBe(true);
      expect(
        currency.isOneOf([
          SubscriptionPlanCurrencyEnum.GBP,
          SubscriptionPlanCurrencyEnum.JPY,
        ]),
      ).toBe(false);
    });

    it('should check if is not one of enum values', () => {
      const currency = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.GBP,
      );
      expect(
        currency.isNotOneOf([
          SubscriptionPlanCurrencyEnum.USD,
          SubscriptionPlanCurrencyEnum.EUR,
        ]),
      ).toBe(true);
      expect(
        currency.isNotOneOf([
          SubscriptionPlanCurrencyEnum.GBP,
          SubscriptionPlanCurrencyEnum.JPY,
        ]),
      ).toBe(false);
    });

    it('should get all enum values', () => {
      const currency = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.USD,
      );
      const allValues = currency.getAllValues();
      expect(allValues).toContain(SubscriptionPlanCurrencyEnum.USD);
      expect(allValues).toContain(SubscriptionPlanCurrencyEnum.EUR);
      expect(allValues).toContain(SubscriptionPlanCurrencyEnum.GBP);
      expect(allValues).toContain(SubscriptionPlanCurrencyEnum.MXN);
    });

    it('should validate enum values correctly for major currencies', () => {
      const usdCurrency = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.USD,
      );
      expect(usdCurrency.value).toBe('USD');

      const eurCurrency = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.EUR,
      );
      expect(eurCurrency.value).toBe('EUR');

      const gbpCurrency = new SubscriptionPlanCurrencyValueObject(
        SubscriptionPlanCurrencyEnum.GBP,
      );
      expect(gbpCurrency.value).toBe('GBP');
    });
  });
});
