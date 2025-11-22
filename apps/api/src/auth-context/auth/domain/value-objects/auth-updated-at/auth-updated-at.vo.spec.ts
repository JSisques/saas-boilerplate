import { AuthUpdatedAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-updated-at/auth-updated-at.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';

describe('AuthUpdatedAtValueObject', () => {
  describe('constructor', () => {
    it('should create an AuthUpdatedAtValueObject with provided date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authUpdatedAt = new AuthUpdatedAtValueObject(date);

      expect(authUpdatedAt.value).toBe(date);
    });

    it('should create an AuthUpdatedAtValueObject with current date when no date provided', () => {
      const beforeCreation = new Date();
      const authUpdatedAt = new AuthUpdatedAtValueObject();
      const afterCreation = new Date();

      expect(authUpdatedAt.value).toBeInstanceOf(Date);
      expect(authUpdatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(authUpdatedAt.value.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  it('should be an instance of DateValueObject', () => {
    const date = new Date('2024-01-01T10:00:00Z');
    const authUpdatedAt = new AuthUpdatedAtValueObject(date);

    expect(authUpdatedAt).toBeInstanceOf(DateValueObject);
  });

  describe('value getter', () => {
    it('should return the date value', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authUpdatedAt = new AuthUpdatedAtValueObject(date);

      expect(authUpdatedAt.value).toBe(date);
    });
  });

  describe('toISOString', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authUpdatedAt = new AuthUpdatedAtValueObject(date);

      expect(authUpdatedAt.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    });
  });

  describe('equals', () => {
    it('should return true for equal dates', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authUpdatedAt1 = new AuthUpdatedAtValueObject(date);
      const authUpdatedAt2 = new AuthUpdatedAtValueObject(date);

      expect(authUpdatedAt1.equals(authUpdatedAt2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-02T10:00:00Z');
      const authUpdatedAt1 = new AuthUpdatedAtValueObject(date1);
      const authUpdatedAt2 = new AuthUpdatedAtValueObject(date2);

      expect(authUpdatedAt1.equals(authUpdatedAt2)).toBe(false);
    });

    it('should return true when comparing with another AuthUpdatedAtValueObject with same date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authUpdatedAt1 = new AuthUpdatedAtValueObject(date);
      const authUpdatedAt2 = new AuthUpdatedAtValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );

      expect(authUpdatedAt1.equals(authUpdatedAt2)).toBe(true);
    });
  });
});

