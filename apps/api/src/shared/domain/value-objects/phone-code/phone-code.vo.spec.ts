import { PhoneCodeValueObject } from '@/shared/domain/value-objects/phone-code/phone-code.vo';
import { InvalidStringException } from '@/shared/domain/exceptions/value-objects/invalid-string/invalid-string.exception';

describe('PhoneCodeValueObject', () => {
  describe('constructor', () => {
    it('should create a phone code value object with valid phone code', () => {
      const phoneCode = new PhoneCodeValueObject('+34');

      expect(phoneCode.value).toBe('+34');
    });

    it('should throw InvalidStringException for invalid phone code format', () => {
      expect(() => new PhoneCodeValueObject('invalid')).toThrow(
        InvalidStringException,
      );
    });

    it('should normalize phone code by adding + if missing', () => {
      const phoneCode = new PhoneCodeValueObject('34', {
        validateExistence: false,
      });

      expect(phoneCode.value).toBe('+34');
    });

    it('should throw InvalidStringException for phone code not in common list', () => {
      expect(() => new PhoneCodeValueObject('+999')).toThrow(
        InvalidStringException,
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal phone codes', () => {
      const phoneCode1 = new PhoneCodeValueObject('+34');
      const phoneCode2 = new PhoneCodeValueObject('+34');

      expect(phoneCode1.equals(phoneCode2)).toBe(true);
    });

    it('should return false for different phone codes', () => {
      const phoneCode1 = new PhoneCodeValueObject('+34');
      const phoneCode2 = new PhoneCodeValueObject('+1');

      expect(phoneCode1.equals(phoneCode2)).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should check if phone code exists', () => {
      expect(new PhoneCodeValueObject('+34').exists()).toBe(true);
    });
  });
});

