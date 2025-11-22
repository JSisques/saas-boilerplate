import { AuthPhoneNumberValueObject } from '@/auth-context/auth/domain/value-objects/auth-phone-number/auth-phone-number.vo';
import { PhoneValueObject } from '@/shared/domain/value-objects/phone/phone.vo';
import { InvalidPhoneException } from '@/shared/domain/exceptions/value-objects/invalid-phone/invalid-phone.exception';

describe('AuthPhoneNumberValueObject', () => {
  const validPhone = '+1234567890';

  it('should be an instance of PhoneValueObject', () => {
    const authPhoneNumber = new AuthPhoneNumberValueObject(validPhone);

    expect(authPhoneNumber).toBeInstanceOf(PhoneValueObject);
  });

  it('should create an auth phone number value object with valid international format', () => {
    const authPhoneNumber = new AuthPhoneNumberValueObject(validPhone);

    expect(authPhoneNumber.value).toBe(validPhone);
  });

  it('should create an auth phone number value object with valid national format', () => {
    const authPhoneNumber = new AuthPhoneNumberValueObject('1234567890');

    expect(authPhoneNumber.value).toMatch(/^\+/);
  });

  it('should normalize phone number to include + prefix', () => {
    const authPhoneNumber = new AuthPhoneNumberValueObject('1234567890');

    expect(authPhoneNumber.value).toMatch(/^\+/);
  });

  it('should throw InvalidPhoneException for empty string', () => {
    expect(() => new AuthPhoneNumberValueObject('')).toThrow(
      InvalidPhoneException,
    );
  });

  it('should throw InvalidPhoneException for invalid format', () => {
    expect(() => new AuthPhoneNumberValueObject('abc')).toThrow(
      InvalidPhoneException,
    );
    expect(() => new AuthPhoneNumberValueObject('123')).toThrow(
      InvalidPhoneException,
    );
  });

  it('should throw InvalidPhoneException for phone number too short', () => {
    expect(() => new AuthPhoneNumberValueObject('123456')).toThrow(
      InvalidPhoneException,
    );
  });

  it('should throw InvalidPhoneException for phone number too long', () => {
    expect(() =>
      new AuthPhoneNumberValueObject('+12345678901234567'),
    ).toThrow(InvalidPhoneException);
  });

  it('should support equals method from PhoneValueObject', () => {
    const authPhoneNumber1 = new AuthPhoneNumberValueObject(validPhone);
    const authPhoneNumber2 = new AuthPhoneNumberValueObject(validPhone);

    expect(authPhoneNumber1.equals(authPhoneNumber2)).toBe(true);
  });

  it('should return false for different phone numbers', () => {
    const authPhoneNumber1 = new AuthPhoneNumberValueObject('+1234567890');
    const authPhoneNumber2 = new AuthPhoneNumberValueObject('+1987654321');

    expect(authPhoneNumber1.equals(authPhoneNumber2)).toBe(false);
  });

  it('should support utility methods from PhoneValueObject', () => {
    const authPhoneNumber = new AuthPhoneNumberValueObject(validPhone);

    expect(authPhoneNumber.getCountryCode()).toBeDefined();
    expect(authPhoneNumber.getNationalNumber()).toBeDefined();
    expect(authPhoneNumber.toE164()).toMatch(/^\+/);
  });
});

