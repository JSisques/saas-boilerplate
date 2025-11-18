import { PasswordValueObject } from '@/shared/domain/value-objects/password/password.vo';
import { InvalidPasswordException } from '@/shared/domain/exceptions/value-objects/invalid-password/invalid-password.exception';

describe('PasswordValueObject', () => {
  describe('constructor', () => {
    it('should create a password value object with valid password', () => {
      const password = new PasswordValueObject('SecurePass123!');

      expect(password.value).toBe('SecurePass123!');
    });

    it('should throw InvalidPasswordException for empty string', () => {
      expect(() => new PasswordValueObject('')).toThrow(
        InvalidPasswordException,
      );
    });

    it('should throw InvalidPasswordException for password shorter than 8 characters', () => {
      expect(() => new PasswordValueObject('Short1!')).toThrow(
        InvalidPasswordException,
      );
    });

    it('should throw InvalidPasswordException for common passwords', () => {
      expect(() => new PasswordValueObject('password')).toThrow(
        InvalidPasswordException,
      );
      expect(() => new PasswordValueObject('123456')).toThrow(
        InvalidPasswordException,
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal passwords', () => {
      const password1 = new PasswordValueObject('SecurePass123!');
      const password2 = new PasswordValueObject('SecurePass123!');

      expect(password1.equals(password2)).toBe(true);
    });

    it('should return false for different passwords', () => {
      const password1 = new PasswordValueObject('SecurePass123!');
      const password2 = new PasswordValueObject('DifferentPass123!');

      expect(password1.equals(password2)).toBe(false);
    });
  });

  describe('strength methods', () => {
    it('should calculate password strength score', () => {
      const password = new PasswordValueObject('SecurePass123!');

      const score = password.getStrengthScore();
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should get password strength level', () => {
      const password = new PasswordValueObject('SecurePass123!');

      const level = password.getStrengthLevel();
      expect(['weak', 'medium', 'strong', 'very-strong']).toContain(level);
    });

    it('should check if password meets requirements', () => {
      const password = new PasswordValueObject('SecurePass123!');

      expect(password.meetsRequirements()).toBe(true);
    });
  });
});

