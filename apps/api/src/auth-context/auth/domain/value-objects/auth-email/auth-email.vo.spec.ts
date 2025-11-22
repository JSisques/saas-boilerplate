import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { EmailValueObject } from '@/shared/domain/value-objects/email/email.vo';
import { InvalidEmailException } from '@/shared/domain/exceptions/value-objects/invalid-email/invalid-email.exception';

describe('AuthEmailValueObject', () => {
  const validEmail = 'test@example.com';

  it('should be an instance of EmailValueObject', () => {
    const authEmail = new AuthEmailValueObject(validEmail);

    expect(authEmail).toBeInstanceOf(EmailValueObject);
  });

  it('should create an auth email value object with valid email', () => {
    const authEmail = new AuthEmailValueObject(validEmail);

    expect(authEmail.value).toBe(validEmail.toLowerCase());
  });

  it('should normalize email to lowercase', () => {
    const authEmail = new AuthEmailValueObject('TEST@EXAMPLE.COM');

    expect(authEmail.value).toBe('test@example.com');
  });

  it('should throw InvalidEmailException for empty string', () => {
    expect(() => new AuthEmailValueObject('')).toThrow(InvalidEmailException);
    expect(() => new AuthEmailValueObject('   ')).toThrow(InvalidEmailException);
  });

  it('should throw InvalidEmailException for invalid email format', () => {
    expect(() => new AuthEmailValueObject('invalid')).toThrow(
      InvalidEmailException,
    );
    expect(() => new AuthEmailValueObject('@example.com')).toThrow(
      InvalidEmailException,
    );
    expect(() => new AuthEmailValueObject('test@')).toThrow(
      InvalidEmailException,
    );
  });

  it('should support equals method from EmailValueObject', () => {
    const authEmail1 = new AuthEmailValueObject(validEmail);
    const authEmail2 = new AuthEmailValueObject(validEmail);

    expect(authEmail1.equals(authEmail2)).toBe(true);
  });

  it('should return false for different emails', () => {
    const authEmail1 = new AuthEmailValueObject('test1@example.com');
    const authEmail2 = new AuthEmailValueObject('test2@example.com');

    expect(authEmail1.equals(authEmail2)).toBe(false);
  });

  it('should handle email with subdomain', () => {
    const email = 'user@mail.example.com';
    const authEmail = new AuthEmailValueObject(email);

    expect(authEmail.value).toBe(email.toLowerCase());
  });

  it('should handle email with plus sign', () => {
    const email = 'user+tag@example.com';
    const authEmail = new AuthEmailValueObject(email);

    expect(authEmail.value).toBe(email.toLowerCase());
  });
});

