import { UserBioValueObject } from '@/user-context/users/domain/value-objects/user-bio/user-bio.vo';

describe('UserBioValueObject', () => {
  describe('constructor', () => {
    it('should create a valid UserBioValueObject with a valid bio', () => {
      const bio = new UserBioValueObject(
        'Software developer passionate about clean code',
      );
      expect(bio.value).toBe('Software developer passionate about clean code');
    });

    it('should trim whitespace from the bio', () => {
      const bio = new UserBioValueObject('  Software developer  ');
      expect(bio.value).toBe('Software developer');
    });

    it('should accept long bio text', () => {
      const longBio = 'A'.repeat(500);
      const bio = new UserBioValueObject(longBio);
      expect(bio.value).toBe(longBio);
    });

    it('should create a UserBioValueObject with empty string (default behavior)', () => {
      const bio = new UserBioValueObject('');
      expect(bio.value).toBe('');
    });

    it('should create a UserBioValueObject with only whitespace (trims to empty)', () => {
      const bio = new UserBioValueObject('   ');
      expect(bio.value).toBe('');
    });

    it('should create a UserBioValueObject with null value (converts to empty string)', () => {
      const bio = new UserBioValueObject(null as any);
      expect(bio.value).toBe('');
    });

    it('should create a UserBioValueObject with undefined value (converts to empty string)', () => {
      const bio = new UserBioValueObject(undefined as any);
      expect(bio.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal bios', () => {
      const bio1 = new UserBioValueObject('Software developer');
      const bio2 = new UserBioValueObject('Software developer');
      expect(bio1.equals(bio2)).toBe(true);
    });

    it('should return false for different bios', () => {
      const bio1 = new UserBioValueObject('Software developer');
      const bio2 = new UserBioValueObject('Designer');
      expect(bio1.equals(bio2)).toBe(false);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct length', () => {
      const bio = new UserBioValueObject('Software developer');
      expect(bio.length()).toBe(18);
    });

    it('should check if empty correctly', () => {
      const bio = new UserBioValueObject('Software developer');
      expect(bio.isEmpty()).toBe(false);
      expect(bio.isNotEmpty()).toBe(true);
    });

    it('should check if contains substring', () => {
      const bio = new UserBioValueObject(
        'Software developer passionate about clean code',
      );
      expect(bio.contains('clean code')).toBe(true);
      expect(bio.contains('design')).toBe(false);
    });
  });
});
