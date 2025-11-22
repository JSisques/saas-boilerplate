import { AuthPasswordValueObject } from '@/auth-context/auth/domain/value-objects/auth-password/auth-password.vo';
import { PasswordValueObject } from '@/shared/domain/value-objects/password/password.vo';
import { InvalidPasswordException } from '@/shared/domain/exceptions/value-objects/invalid-password/invalid-password.exception';

describe('AuthPasswordValueObject', () => {
  const validPassword = 'SecurePass123!';

  it('should be an instance of PasswordValueObject', () => {
    const authPassword = new AuthPasswordValueObject(validPassword);

    expect(authPassword).toBeInstanceOf(PasswordValueObject);
  });

  it('should create an auth password value object with valid password', () => {
    const authPassword = new AuthPasswordValueObject(validPassword);

    expect(authPassword.value).toBe(validPassword);
  });

  it('should throw InvalidPasswordException for empty string', () => {
    expect(() => new AuthPasswordValueObject('')).toThrow(
      InvalidPasswordException,
    );
  });

  it('should throw InvalidPasswordException for password shorter than 8 characters', () => {
    expect(() => new AuthPasswordValueObject('Short1!')).toThrow(
      InvalidPasswordException,
    );
  });

  it('should throw InvalidPasswordException for common passwords', () => {
    expect(() => new AuthPasswordValueObject('password')).toThrow(
      InvalidPasswordException,
    );
    expect(() => new AuthPasswordValueObject('123456')).toThrow(
      InvalidPasswordException,
    );
  });

  it('should support equals method from PasswordValueObject', () => {
    const authPassword1 = new AuthPasswordValueObject(validPassword);
    const authPassword2 = new AuthPasswordValueObject(validPassword);

    expect(authPassword1.equals(authPassword2)).toBe(true);
  });

  it('should return false for different passwords', () => {
    const authPassword1 = new AuthPasswordValueObject(validPassword);
    const authPassword2 = new AuthPasswordValueObject('DifferentPass123!');

    expect(authPassword1.equals(authPassword2)).toBe(false);
  });
});

