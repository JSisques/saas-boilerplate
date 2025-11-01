import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';

describe('UserUserNameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid UserUserNameValueObject with a valid username', () => {
      const userName = new UserUserNameValueObject('johndoe');
      expect(userName.value).toBe('johndoe');
    });

    it('should trim whitespace from the username', () => {
      const userName = new UserUserNameValueObject('  johndoe  ');
      expect(userName.value).toBe('johndoe');
    });

    it('should accept usernames with numbers', () => {
      const userName = new UserUserNameValueObject('john123');
      expect(userName.value).toBe('john123');
    });

    it('should accept usernames with special characters', () => {
      const userName = new UserUserNameValueObject('john_doe');
      expect(userName.value).toBe('john_doe');
    });

    it('should create a UserUserNameValueObject with empty string (default behavior)', () => {
      const userName = new UserUserNameValueObject('');
      expect(userName.value).toBe('');
    });

    it('should create a UserUserNameValueObject with only whitespace (trims to empty)', () => {
      const userName = new UserUserNameValueObject('   ');
      expect(userName.value).toBe('');
    });

    it('should create a UserUserNameValueObject with null value (converts to empty string)', () => {
      const userName = new UserUserNameValueObject(null as any);
      expect(userName.value).toBe('');
    });

    it('should create a UserUserNameValueObject with undefined value (converts to empty string)', () => {
      const userName = new UserUserNameValueObject(undefined as any);
      expect(userName.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal usernames', () => {
      const userName1 = new UserUserNameValueObject('johndoe');
      const userName2 = new UserUserNameValueObject('johndoe');
      expect(userName1.equals(userName2)).toBe(true);
    });

    it('should return false for different usernames', () => {
      const userName1 = new UserUserNameValueObject('johndoe');
      const userName2 = new UserUserNameValueObject('janedoe');
      expect(userName1.equals(userName2)).toBe(false);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct length', () => {
      const userName = new UserUserNameValueObject('johndoe');
      expect(userName.length()).toBe(7);
    });

    it('should check if empty correctly', () => {
      const userName = new UserUserNameValueObject('johndoe');
      expect(userName.isEmpty()).toBe(false);
      expect(userName.isNotEmpty()).toBe(true);
    });

    it('should check if contains substring', () => {
      const userName = new UserUserNameValueObject('johndoe123');
      expect(userName.contains('doe')).toBe(true);
      expect(userName.contains('smith')).toBe(false);
    });
  });
});
