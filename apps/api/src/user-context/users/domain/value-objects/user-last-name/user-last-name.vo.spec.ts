import { UserLastNameValueObject } from '@/user-context/users/domain/value-objects/user-last-name/user-last-name.vo';

describe('UserLastNameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid UserLastNameValueObject with a valid last name', () => {
      const lastName = new UserLastNameValueObject('Doe');
      expect(lastName.value).toBe('Doe');
    });

    it('should trim whitespace from the last name', () => {
      const lastName = new UserLastNameValueObject('  Doe  ');
      expect(lastName.value).toBe('Doe');
    });

    it('should create a UserLastNameValueObject with empty string (default behavior)', () => {
      const lastName = new UserLastNameValueObject('');
      expect(lastName.value).toBe('');
    });

    it('should create a UserLastNameValueObject with only whitespace (trims to empty)', () => {
      const lastName = new UserLastNameValueObject('   ');
      expect(lastName.value).toBe('');
    });

    it('should create a UserLastNameValueObject with null value (converts to empty string)', () => {
      const lastName = new UserLastNameValueObject(null as any);
      expect(lastName.value).toBe('');
    });

    it('should create a UserLastNameValueObject with undefined value (converts to empty string)', () => {
      const lastName = new UserLastNameValueObject(undefined as any);
      expect(lastName.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal last names', () => {
      const lastName1 = new UserLastNameValueObject('Doe');
      const lastName2 = new UserLastNameValueObject('Doe');
      expect(lastName1.equals(lastName2)).toBe(true);
    });

    it('should return false for different last names', () => {
      const lastName1 = new UserLastNameValueObject('Doe');
      const lastName2 = new UserLastNameValueObject('Smith');
      expect(lastName1.equals(lastName2)).toBe(false);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct length', () => {
      const lastName = new UserLastNameValueObject('Doe');
      expect(lastName.length()).toBe(3);
    });

    it('should check if empty correctly', () => {
      const lastName = new UserLastNameValueObject('Doe');
      expect(lastName.isEmpty()).toBe(false);
      expect(lastName.isNotEmpty()).toBe(true);
    });

    it('should check if contains substring', () => {
      const lastName = new UserLastNameValueObject('McDonald');
      expect(lastName.contains('Donald')).toBe(true);
      expect(lastName.contains('Smith')).toBe(false);
    });
  });
});
