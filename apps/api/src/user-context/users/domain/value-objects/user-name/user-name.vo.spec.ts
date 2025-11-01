import { UserNameValueObject } from '@/user-context/users/domain/value-objects/user-name/user-name.vo';

describe('UserNameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid UserNameValueObject with a valid name', () => {
      const userName = new UserNameValueObject('John');
      expect(userName.value).toBe('John');
    });

    it('should trim whitespace from the name', () => {
      const userName = new UserNameValueObject('  John  ');
      expect(userName.value).toBe('John');
    });

    it('should create a UserNameValueObject with empty string (default behavior)', () => {
      const userName = new UserNameValueObject('');
      expect(userName.value).toBe('');
    });

    it('should create a UserNameValueObject with only whitespace (trims to empty)', () => {
      const userName = new UserNameValueObject('   ');
      expect(userName.value).toBe('');
    });

    it('should create a UserNameValueObject with null value (converts to empty string)', () => {
      const userName = new UserNameValueObject(null as any);
      expect(userName.value).toBe('');
    });

    it('should create a UserNameValueObject with undefined value (converts to empty string)', () => {
      const userName = new UserNameValueObject(undefined as any);
      expect(userName.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const userName1 = new UserNameValueObject('John');
      const userName2 = new UserNameValueObject('John');
      expect(userName1.equals(userName2)).toBe(true);
    });

    it('should return false for different names', () => {
      const userName1 = new UserNameValueObject('John');
      const userName2 = new UserNameValueObject('Jane');
      expect(userName1.equals(userName2)).toBe(false);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct length', () => {
      const userName = new UserNameValueObject('John');
      expect(userName.length()).toBe(4);
    });

    it('should check if empty correctly', () => {
      const userName = new UserNameValueObject('John');
      expect(userName.isEmpty()).toBe(false);
      expect(userName.isNotEmpty()).toBe(true);
    });

    it('should check if contains substring', () => {
      const userName = new UserNameValueObject('John Doe');
      expect(userName.contains('Doe')).toBe(true);
      expect(userName.contains('Jane')).toBe(false);
    });

    it('should check if starts with prefix', () => {
      const userName = new UserNameValueObject('John Doe');
      expect(userName.startsWith('John')).toBe(true);
      expect(userName.startsWith('Jane')).toBe(false);
    });

    it('should check if ends with suffix', () => {
      const userName = new UserNameValueObject('John Doe');
      expect(userName.endsWith('Doe')).toBe(true);
      expect(userName.endsWith('Smith')).toBe(false);
    });
  });
});
