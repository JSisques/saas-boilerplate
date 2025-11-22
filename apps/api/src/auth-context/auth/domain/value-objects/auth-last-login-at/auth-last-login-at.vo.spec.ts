import { AuthLastLoginAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';

describe('AuthLastLoginAtValueObject', () => {
  describe('constructor', () => {
    it('should create an AuthLastLoginAtValueObject with provided date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authLastLoginAt = new AuthLastLoginAtValueObject(date);

      expect(authLastLoginAt.value).toBe(date);
    });

    it('should create an AuthLastLoginAtValueObject with current date when no date provided', () => {
      const beforeCreation = new Date();
      const authLastLoginAt = new AuthLastLoginAtValueObject();
      const afterCreation = new Date();

      expect(authLastLoginAt.value).toBeInstanceOf(Date);
      expect(authLastLoginAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(authLastLoginAt.value.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  it('should be an instance of DateValueObject', () => {
    const date = new Date('2024-01-01T10:00:00Z');
    const authLastLoginAt = new AuthLastLoginAtValueObject(date);

    expect(authLastLoginAt).toBeInstanceOf(DateValueObject);
  });

  describe('value getter', () => {
    it('should return the date value', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authLastLoginAt = new AuthLastLoginAtValueObject(date);

      expect(authLastLoginAt.value).toBe(date);
    });
  });

  describe('toISOString', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authLastLoginAt = new AuthLastLoginAtValueObject(date);

      expect(authLastLoginAt.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    });
  });

  describe('equals', () => {
    it('should return true for equal dates', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authLastLoginAt1 = new AuthLastLoginAtValueObject(date);
      const authLastLoginAt2 = new AuthLastLoginAtValueObject(date);

      expect(authLastLoginAt1.equals(authLastLoginAt2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-02T10:00:00Z');
      const authLastLoginAt1 = new AuthLastLoginAtValueObject(date1);
      const authLastLoginAt2 = new AuthLastLoginAtValueObject(date2);

      expect(authLastLoginAt1.equals(authLastLoginAt2)).toBe(false);
    });

    it('should return true when comparing with another AuthLastLoginAtValueObject with same date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authLastLoginAt1 = new AuthLastLoginAtValueObject(date);
      const authLastLoginAt2 = new AuthLastLoginAtValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );

      expect(authLastLoginAt1.equals(authLastLoginAt2)).toBe(true);
    });
  });
});

