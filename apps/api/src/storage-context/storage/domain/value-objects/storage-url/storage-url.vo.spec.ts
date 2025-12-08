import { StorageUrlValueObject } from '@/storage-context/storage/domain/value-objects/storage-url/storage-url.vo';

describe('StorageUrlValueObject', () => {
  describe('constructor', () => {
    it('should create a storage URL value object with a valid HTTP URL', () => {
      const url = new StorageUrlValueObject('http://example.com/file.pdf');

      expect(url.value).toBe('http://example.com/file.pdf');
    });

    it('should create a storage URL value object with a valid HTTPS URL', () => {
      const url = new StorageUrlValueObject('https://example.com/file.pdf');

      expect(url.value).toBe('https://example.com/file.pdf');
    });

    it('should not allow empty string', () => {
      expect(() => {
        new StorageUrlValueObject('');
      }).toThrow();
    });

    it('should not allow URLs that do not start with http', () => {
      expect(() => {
        new StorageUrlValueObject('ftp://example.com/file.pdf');
      }).toThrow();
    });

    it('should accept valid URLs with paths', () => {
      const validUrls = [
        'http://example.com/files/test.pdf',
        'https://example.com/uploads/2024/01/file.pdf',
        'http://localhost:3000/files/test.pdf',
      ];

      validUrls.forEach((url) => {
        expect(() => new StorageUrlValueObject(url)).not.toThrow();
      });
    });
  });

  describe('equals', () => {
    it('should return true for equal URLs', () => {
      const url1 = new StorageUrlValueObject('https://example.com/file.pdf');
      const url2 = new StorageUrlValueObject('https://example.com/file.pdf');

      expect(url1.equals(url2)).toBe(true);
    });

    it('should return false for different URLs', () => {
      const url1 = new StorageUrlValueObject('https://example.com/file.pdf');
      const url2 = new StorageUrlValueObject(
        'https://example.com/other-file.pdf',
      );

      expect(url1.equals(url2)).toBe(false);
    });

    it('should be case-sensitive for URLs', () => {
      const url1 = new StorageUrlValueObject('https://Example.com/file.pdf');
      const url2 = new StorageUrlValueObject('https://example.com/file.pdf');

      expect(url1.equals(url2)).toBe(false);
    });
  });
});
