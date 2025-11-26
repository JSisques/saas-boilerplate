import { InvalidEmailException } from '@/shared/domain/exceptions/value-objects/invalid-email/invalid-email.exception';
import { EmailValueObject } from '@/shared/domain/value-objects/email/email.vo';

describe('EmailValueObject', () => {
  const validEmail = 'test@example.com';
  const validEmailWithSubdomain = 'user@mail.example.com';
  const validEmailWithPlus = 'user+tag@example.com';

  describe('constructor', () => {
    it('should create an email value object with a valid email', () => {
      const email = new EmailValueObject(validEmail);

      expect(email.value).toBe(validEmail.toLowerCase());
    });

    it('should normalize email to lowercase', () => {
      const email = new EmailValueObject('TEST@EXAMPLE.COM');

      expect(email.value).toBe('test@example.com');
    });

    it('should trim whitespace from email', () => {
      const email = new EmailValueObject('test@example.com');

      expect(email.value).toBe('test@example.com');
    });

    it('should throw InvalidEmailException for empty string', () => {
      expect(() => new EmailValueObject('')).toThrow(InvalidEmailException);
      expect(() => new EmailValueObject('   ')).toThrow(InvalidEmailException);
    });

    it('should throw InvalidEmailException for invalid email format', () => {
      expect(() => new EmailValueObject('invalid')).toThrow(
        InvalidEmailException,
      );
      expect(() => new EmailValueObject('@example.com')).toThrow(
        InvalidEmailException,
      );
      expect(() => new EmailValueObject('test@')).toThrow(
        InvalidEmailException,
      );
      expect(() => new EmailValueObject('test@.com')).toThrow(
        InvalidEmailException,
      );
    });

    it('should throw InvalidEmailException for email longer than 254 characters', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';

      expect(() => new EmailValueObject(longEmail)).toThrow(
        InvalidEmailException,
      );
    });

    it('should throw InvalidEmailException for local part longer than 64 characters', () => {
      const longLocalPart = 'a'.repeat(65) + '@example.com';

      expect(() => new EmailValueObject(longLocalPart)).toThrow(
        InvalidEmailException,
      );
    });
  });

  describe('value getter', () => {
    it('should return the normalized email string', () => {
      const email = new EmailValueObject(validEmail);

      expect(email.value).toBe(validEmail.toLowerCase());
    });
  });

  describe('equals', () => {
    it('should return true for equal emails', () => {
      const email1 = new EmailValueObject(validEmail);
      const email2 = new EmailValueObject(validEmail);

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return true for emails that differ only in case', () => {
      const email1 = new EmailValueObject('TEST@EXAMPLE.COM');
      const email2 = new EmailValueObject('test@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = new EmailValueObject('user1@example.com');
      const email2 = new EmailValueObject('user2@example.com');

      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe('getLocalPart', () => {
    it('should return the local part of the email', () => {
      const email = new EmailValueObject(validEmail);

      expect(email.getLocalPart()).toBe('test');
    });

    it('should return the local part with plus sign', () => {
      const email = new EmailValueObject(validEmailWithPlus);

      expect(email.getLocalPart()).toBe('user+tag');
    });
  });

  describe('getDomain', () => {
    it('should return the domain part of the email', () => {
      const email = new EmailValueObject(validEmail);

      expect(email.getDomain()).toBe('example.com');
    });

    it('should return the domain with subdomain', () => {
      const email = new EmailValueObject(validEmailWithSubdomain);

      expect(email.getDomain()).toBe('mail.example.com');
    });
  });
});
