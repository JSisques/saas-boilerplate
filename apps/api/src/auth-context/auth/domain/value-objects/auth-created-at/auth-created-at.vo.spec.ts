import { AuthCreatedAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-created-at/auth-created-at.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';

describe('AuthCreatedAtValueObject', () => {
  describe('constructor', () => {
    it('should create an AuthCreatedAtValueObject with provided date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authCreatedAt = new AuthCreatedAtValueObject(date);

      expect(authCreatedAt.value).toBe(date);
    });

    it('should create an AuthCreatedAtValueObject with current date when no date provided', () => {
      const beforeCreation = new Date();
      const authCreatedAt = new AuthCreatedAtValueObject();
      const afterCreation = new Date();

      expect(authCreatedAt.value).toBeInstanceOf(Date);
      expect(authCreatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(authCreatedAt.value.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  it('should be an instance of DateValueObject', () => {
    const date = new Date('2024-01-01T10:00:00Z');
    const authCreatedAt = new AuthCreatedAtValueObject(date);

    expect(authCreatedAt).toBeInstanceOf(DateValueObject);
  });

  describe('value getter', () => {
    it('should return the date value', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authCreatedAt = new AuthCreatedAtValueObject(date);

      expect(authCreatedAt.value).toBe(date);
    });
  });

  describe('toISOString', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authCreatedAt = new AuthCreatedAtValueObject(date);

      expect(authCreatedAt.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    });
  });

  describe('equals', () => {
    it('should return true for equal dates', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authCreatedAt1 = new AuthCreatedAtValueObject(date);
      const authCreatedAt2 = new AuthCreatedAtValueObject(date);

      expect(authCreatedAt1.equals(authCreatedAt2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-02T10:00:00Z');
      const authCreatedAt1 = new AuthCreatedAtValueObject(date1);
      const authCreatedAt2 = new AuthCreatedAtValueObject(date2);

      expect(authCreatedAt1.equals(authCreatedAt2)).toBe(false);
    });

    it('should return true when comparing with another AuthCreatedAtValueObject with same date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const authCreatedAt1 = new AuthCreatedAtValueObject(date);
      const authCreatedAt2 = new AuthCreatedAtValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );

      expect(authCreatedAt1.equals(authCreatedAt2)).toBe(true);
    });
  });
});
