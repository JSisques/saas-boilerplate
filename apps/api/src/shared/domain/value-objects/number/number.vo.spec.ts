import { NumberValueObject } from '@/shared/domain/value-objects/number/number.vo';
import { InvalidNumberException } from '@/shared/domain/exceptions/value-objects/invalid-number/invalid-number.exception';

describe('NumberValueObject', () => {
  describe('constructor', () => {
    it('should create a number value object with a valid number', () => {
      const num = new NumberValueObject(42);

      expect(num.value).toBe(42);
    });

    it('should parse string to number', () => {
      const num = new NumberValueObject('42');

      expect(num.value).toBe(42);
    });

    it('should parse decimal string to number', () => {
      const num = new NumberValueObject('3.14');

      expect(num.value).toBe(3.14);
    });

    it('should throw InvalidNumberException for invalid string', () => {
      expect(() => new NumberValueObject('invalid')).toThrow(
        InvalidNumberException,
      );
      expect(() => new NumberValueObject('abc123')).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for number below minimum', () => {
      expect(() => new NumberValueObject(5, { min: 10 })).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for number above maximum', () => {
      expect(() => new NumberValueObject(15, { max: 10 })).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for decimal when allowDecimals is false', () => {
      expect(() => new NumberValueObject(3.14, { allowDecimals: false })).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for number exceeding precision', () => {
      expect(() => new NumberValueObject(3.14159, { precision: 2 })).toThrow(
        InvalidNumberException,
      );
    });

    it('should throw InvalidNumberException for non-finite numbers', () => {
      expect(() => new NumberValueObject(Infinity)).toThrow(
        InvalidNumberException,
      );
      expect(() => new NumberValueObject(-Infinity)).toThrow(
        InvalidNumberException,
      );
      expect(() => new NumberValueObject(NaN)).toThrow(
        InvalidNumberException,
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal numbers', () => {
      const num1 = new NumberValueObject(42);
      const num2 = new NumberValueObject(42);

      expect(num1.equals(num2)).toBe(true);
    });

    it('should return false for different numbers', () => {
      const num1 = new NumberValueObject(42);
      const num2 = new NumberValueObject(43);

      expect(num1.equals(num2)).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('should return true when number is within range', () => {
      const num = new NumberValueObject(5);

      expect(num.isInRange(1, 10)).toBe(true);
    });

    it('should return false when number is outside range', () => {
      const num = new NumberValueObject(15);

      expect(num.isInRange(1, 10)).toBe(false);
    });
  });

  describe('isPositive', () => {
    it('should return true for positive numbers', () => {
      const num = new NumberValueObject(5);

      expect(num.isPositive()).toBe(true);
    });

    it('should return false for zero', () => {
      const num = new NumberValueObject(0);

      expect(num.isPositive()).toBe(false);
    });

    it('should return false for negative numbers', () => {
      const num = new NumberValueObject(-5);

      expect(num.isPositive()).toBe(false);
    });
  });

  describe('isNegative', () => {
    it('should return true for negative numbers', () => {
      const num = new NumberValueObject(-5);

      expect(num.isNegative()).toBe(true);
    });

    it('should return false for zero', () => {
      const num = new NumberValueObject(0);

      expect(num.isNegative()).toBe(false);
    });

    it('should return false for positive numbers', () => {
      const num = new NumberValueObject(5);

      expect(num.isNegative()).toBe(false);
    });
  });

  describe('isZero', () => {
    it('should return true for zero', () => {
      const num = new NumberValueObject(0);

      expect(num.isZero()).toBe(true);
    });

    it('should return false for non-zero numbers', () => {
      const num = new NumberValueObject(5);

      expect(num.isZero()).toBe(false);
    });
  });

  describe('round', () => {
    it('should round to specified precision', () => {
      const num = new NumberValueObject(3.14159);

      expect(num.round(2)).toBe(3.14);
      expect(num.round(3)).toBe(3.142);
    });

    it('should round to default precision of 2', () => {
      const num = new NumberValueObject(3.14159);

      expect(num.round()).toBe(3.14);
    });
  });
});

