import { UrlValueObject } from '@/shared/domain/value-objects/url/url.vo';
import { InvalidUrlException } from '@/shared/domain/exceptions/value-objects/invalid-url/invalid-url.exception';

describe('UrlValueObject', () => {
  describe('constructor', () => {
    it('should create a URL value object with valid HTTP URL', () => {
      const url = new UrlValueObject('http://example.com');

      expect(url.value).toBe('http://example.com');
    });

    it('should create a URL value object with valid HTTPS URL', () => {
      const url = new UrlValueObject('https://example.com');

      expect(url.value).toBe('https://example.com');
    });

    it('should throw InvalidUrlException for empty string', () => {
      expect(() => new UrlValueObject('')).toThrow(InvalidUrlException);
    });

    it('should throw InvalidUrlException for URL not starting with http', () => {
      expect(() => new UrlValueObject('ftp://example.com')).toThrow(
        InvalidUrlException,
      );
      expect(() => new UrlValueObject('example.com')).toThrow(
        InvalidUrlException,
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal URLs', () => {
      const url1 = new UrlValueObject('http://example.com');
      const url2 = new UrlValueObject('http://example.com');

      expect(url1.equals(url2)).toBe(true);
    });

    it('should return false for different URLs', () => {
      const url1 = new UrlValueObject('http://example.com');
      const url2 = new UrlValueObject('http://other.com');

      expect(url1.equals(url2)).toBe(false);
    });
  });
});
