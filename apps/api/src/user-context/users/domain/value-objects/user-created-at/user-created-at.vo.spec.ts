import { UserCreatedAtValueObject } from '@/user-context/users/domain/value-objects/user-created-at/user-created-at.vo';

describe('UserCreatedAtValueObject', () => {
  describe('constructor', () => {
    it('should create a UserCreatedAtValueObject with provided date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const userCreatedAt = new UserCreatedAtValueObject(date);

      expect(userCreatedAt.value).toBe(date);
    });

    it('should create a UserCreatedAtValueObject with current date when no date provided', () => {
      const beforeCreation = new Date();
      const userCreatedAt = new UserCreatedAtValueObject();
      const afterCreation = new Date();

      expect(userCreatedAt.value).toBeInstanceOf(Date);
      expect(userCreatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(userCreatedAt.value.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  describe('value getter', () => {
    it('should return the date value', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const userCreatedAt = new UserCreatedAtValueObject(date);

      expect(userCreatedAt.value).toBe(date);
    });
  });

  describe('toISOString', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const userCreatedAt = new UserCreatedAtValueObject(date);

      expect(userCreatedAt.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    });
  });

  describe('equals', () => {
    it('should return true for equal dates', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const userCreatedAt1 = new UserCreatedAtValueObject(date);
      const userCreatedAt2 = new UserCreatedAtValueObject(date);

      expect(userCreatedAt1.equals(userCreatedAt2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-02T10:00:00Z');
      const userCreatedAt1 = new UserCreatedAtValueObject(date1);
      const userCreatedAt2 = new UserCreatedAtValueObject(date2);

      expect(userCreatedAt1.equals(userCreatedAt2)).toBe(false);
    });

    it('should return true when comparing with another UserCreatedAtValueObject with same date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const userCreatedAt1 = new UserCreatedAtValueObject(date);
      const userCreatedAt2 = new UserCreatedAtValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );

      expect(userCreatedAt1.equals(userCreatedAt2)).toBe(true);
    });
  });
});
