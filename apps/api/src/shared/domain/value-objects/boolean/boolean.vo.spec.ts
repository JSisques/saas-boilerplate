import { InvalidBooleanException } from '@/shared/domain/exceptions/value-objects/invalid-boolean/invalid-boolean.exception';
import { BooleanValueObject } from '@/shared/domain/value-objects/boolean/boolean.vo';

describe('BooleanValueObject', () => {
  describe('constructor', () => {
    it('should create a boolean value object with true', () => {
      const bool = new BooleanValueObject(true);

      expect(bool.value).toBe(true);
    });

    it('should create a boolean value object with false', () => {
      const bool = new BooleanValueObject(false);

      expect(bool.value).toBe(false);
    });

    it('should parse string "true" to boolean true', () => {
      const bool = new BooleanValueObject('true');

      expect(bool.value).toBe(true);
    });

    it('should parse string "false" to boolean false', () => {
      const bool = new BooleanValueObject('false');

      expect(bool.value).toBe(false);
    });

    it('should parse number 1 to boolean true', () => {
      const bool = new BooleanValueObject(1);

      expect(bool.value).toBe(true);
    });

    it('should parse number 0 to boolean false', () => {
      const bool = new BooleanValueObject(0);

      expect(bool.value).toBe(false);
    });

    it('should throw InvalidBooleanException for invalid string in strict mode', () => {
      expect(() => {
        new BooleanValueObject('invalid', { strictMode: true });
      }).toThrow(InvalidBooleanException);
    });

    it('should parse flexible string values', () => {
      expect(new BooleanValueObject('yes').value).toBe(true);
      expect(new BooleanValueObject('no').value).toBe(false);
      expect(new BooleanValueObject('on').value).toBe(true);
      expect(new BooleanValueObject('off').value).toBe(false);
      expect(new BooleanValueObject('enabled').value).toBe(true);
      expect(new BooleanValueObject('disabled').value).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for equal boolean values', () => {
      const bool1 = new BooleanValueObject(true);
      const bool2 = new BooleanValueObject(true);

      expect(bool1.equals(bool2)).toBe(true);
    });

    it('should return false for different boolean values', () => {
      const bool1 = new BooleanValueObject(true);
      const bool2 = new BooleanValueObject(false);

      expect(bool1.equals(bool2)).toBe(false);
    });
  });

  describe('isTrue', () => {
    it('should return true when value is true', () => {
      const bool = new BooleanValueObject(true);

      expect(bool.isTrue()).toBe(true);
    });

    it('should return false when value is false', () => {
      const bool = new BooleanValueObject(false);

      expect(bool.isTrue()).toBe(false);
    });
  });

  describe('isFalse', () => {
    it('should return true when value is false', () => {
      const bool = new BooleanValueObject(false);

      expect(bool.isFalse()).toBe(true);
    });

    it('should return false when value is true', () => {
      const bool = new BooleanValueObject(true);

      expect(bool.isFalse()).toBe(false);
    });
  });

  describe('not', () => {
    it('should return negated boolean value', () => {
      const bool = new BooleanValueObject(true);
      const negated = bool.not();

      expect(negated.value).toBe(false);
      expect(bool.value).toBe(true); // Original unchanged
    });
  });

  describe('and', () => {
    it('should perform logical AND operation', () => {
      const bool1 = new BooleanValueObject(true);
      const bool2 = new BooleanValueObject(false);

      expect(bool1.and(bool2).value).toBe(false);
      expect(bool1.and(bool1).value).toBe(true);
    });
  });

  describe('or', () => {
    it('should perform logical OR operation', () => {
      const bool1 = new BooleanValueObject(true);
      const bool2 = new BooleanValueObject(false);

      expect(bool1.or(bool2).value).toBe(true);
      expect(bool2.or(bool2).value).toBe(false);
    });
  });

  describe('xor', () => {
    it('should perform logical XOR operation', () => {
      const bool1 = new BooleanValueObject(true);
      const bool2 = new BooleanValueObject(false);

      expect(bool1.xor(bool2).value).toBe(true);
      expect(bool1.xor(bool1).value).toBe(false);
    });
  });

  describe('static methods', () => {
    it('should create true value with static true()', () => {
      const bool = BooleanValueObject.true();

      expect(bool.value).toBe(true);
    });

    it('should create false value with static false()', () => {
      const bool = BooleanValueObject.false();

      expect(bool.value).toBe(false);
    });

    it('should create from string with fromString()', () => {
      const bool = BooleanValueObject.fromString('true');

      expect(bool.value).toBe(true);
    });

    it('should create from number with fromNumber()', () => {
      const bool = BooleanValueObject.fromNumber(1);

      expect(bool.value).toBe(true);
    });
  });

  describe('toString', () => {
    it('should convert to string representation', () => {
      expect(new BooleanValueObject(true).toString()).toBe('true');
      expect(new BooleanValueObject(false).toString()).toBe('false');
    });
  });

  describe('toNumber', () => {
    it('should convert to number representation', () => {
      expect(new BooleanValueObject(true).toNumber()).toBe(1);
      expect(new BooleanValueObject(false).toNumber()).toBe(0);
    });
  });
});
