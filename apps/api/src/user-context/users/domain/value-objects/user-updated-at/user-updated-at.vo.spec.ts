import { UserUpdatedAtValueObject } from '@/user-context/users/domain/value-objects/user-updated-at/user-updated-at.vo';

describe('UserUpdatedAtValueObject', () => {
  describe('constructor', () => {
    it('should create a UserUpdatedAtValueObject with provided date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const userUpdatedAt = new UserUpdatedAtValueObject(date);

      expect(userUpdatedAt.value).toBe(date);
    });

    it('should create a UserUpdatedAtValueObject with current date when no date provided', () => {
      const beforeCreation = new Date();
      const userUpdatedAt = new UserUpdatedAtValueObject();
      const afterCreation = new Date();

      expect(userUpdatedAt.value).toBeInstanceOf(Date);
      expect(userUpdatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(userUpdatedAt.value.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  describe('value getter', () => {
    it('should return the date value', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const userUpdatedAt = new UserUpdatedAtValueObject(date);

      expect(userUpdatedAt.value).toBe(date);
    });
  });

  describe('toISOString', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const userUpdatedAt = new UserUpdatedAtValueObject(date);

      expect(userUpdatedAt.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    });
  });

  describe('equals', () => {
    it('should return true for equal dates', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const userUpdatedAt1 = new UserUpdatedAtValueObject(date);
      const userUpdatedAt2 = new UserUpdatedAtValueObject(date);

      expect(userUpdatedAt1.equals(userUpdatedAt2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-02T10:00:00Z');
      const userUpdatedAt1 = new UserUpdatedAtValueObject(date1);
      const userUpdatedAt2 = new UserUpdatedAtValueObject(date2);

      expect(userUpdatedAt1.equals(userUpdatedAt2)).toBe(false);
    });

    it('should return true when comparing with another UserUpdatedAtValueObject with same date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const userUpdatedAt1 = new UserUpdatedAtValueObject(date);
      const userUpdatedAt2 = new UserUpdatedAtValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );

      expect(userUpdatedAt1.equals(userUpdatedAt2)).toBe(true);
    });
  });
});
