import { InvalidUrlException } from '@/shared/domain/exceptions/value-objects/invalid-url/invalid-url.exception';
import { UserAvatarUrlValueObject } from '@/user-context/users/domain/value-objects/user-avatar-url/user-avatar-url.vo';

describe('UserAvatarUrlValueObject', () => {
  describe('constructor', () => {
    it('should create a valid UserAvatarUrlValueObject with a valid HTTP URL', () => {
      const avatarUrl = new UserAvatarUrlValueObject(
        'http://example.com/avatar.jpg',
      );
      expect(avatarUrl.value).toBe('http://example.com/avatar.jpg');
    });

    it('should create a valid UserAvatarUrlValueObject with a valid HTTPS URL', () => {
      const avatarUrl = new UserAvatarUrlValueObject(
        'https://example.com/avatar.jpg',
      );
      expect(avatarUrl.value).toBe('https://example.com/avatar.jpg');
    });

    it('should throw InvalidUrlException for empty string', () => {
      expect(() => {
        new UserAvatarUrlValueObject('');
      }).toThrow(InvalidUrlException);
    });

    it('should throw InvalidUrlException for URL that does not start with http', () => {
      expect(() => {
        new UserAvatarUrlValueObject('ftp://example.com/avatar.jpg');
      }).toThrow(InvalidUrlException);
    });

    it('should throw InvalidUrlException for URL that does not start with http', () => {
      expect(() => {
        new UserAvatarUrlValueObject('example.com/avatar.jpg');
      }).toThrow(InvalidUrlException);
    });

    it('should throw InvalidUrlException for null value', () => {
      expect(() => {
        new UserAvatarUrlValueObject(null as any);
      }).toThrow(InvalidUrlException);
    });

    it('should throw InvalidUrlException for undefined value', () => {
      expect(() => {
        new UserAvatarUrlValueObject(undefined as any);
      }).toThrow(InvalidUrlException);
    });
  });

  describe('equals', () => {
    it('should return true for equal URLs', () => {
      const avatarUrl1 = new UserAvatarUrlValueObject(
        'https://example.com/avatar.jpg',
      );
      const avatarUrl2 = new UserAvatarUrlValueObject(
        'https://example.com/avatar.jpg',
      );
      expect(avatarUrl1.equals(avatarUrl2)).toBe(true);
    });

    it('should return false for different URLs', () => {
      const avatarUrl1 = new UserAvatarUrlValueObject(
        'https://example.com/avatar.jpg',
      );
      const avatarUrl2 = new UserAvatarUrlValueObject(
        'https://example.com/avatar2.jpg',
      );
      expect(avatarUrl1.equals(avatarUrl2)).toBe(false);
    });

    it('should return false for HTTP vs HTTPS URLs', () => {
      const avatarUrl1 = new UserAvatarUrlValueObject(
        'http://example.com/avatar.jpg',
      );
      const avatarUrl2 = new UserAvatarUrlValueObject(
        'https://example.com/avatar.jpg',
      );
      expect(avatarUrl1.equals(avatarUrl2)).toBe(false);
    });
  });
});
