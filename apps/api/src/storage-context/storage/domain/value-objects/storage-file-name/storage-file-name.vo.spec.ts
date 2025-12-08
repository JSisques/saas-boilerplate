import { StorageFileNameValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-name/storage-file-name.vo';

describe('StorageFileNameValueObject', () => {
  describe('constructor', () => {
    it('should create a storage file name value object with a valid string', () => {
      const fileName = new StorageFileNameValueObject('test-file.pdf');

      expect(fileName.value).toBe('test-file.pdf');
    });

    it('should trim whitespace by default', () => {
      const fileName = new StorageFileNameValueObject('  test-file.pdf  ');

      expect(fileName.value).toBe('test-file.pdf');
    });

    it('should not allow empty string', () => {
      expect(() => {
        new StorageFileNameValueObject('');
      }).toThrow();
    });

    it('should accept valid file names', () => {
      const validNames = [
        'document.pdf',
        'image.png',
        'video.mp4',
        'file-name_with-dots.123.ext',
        'A', // Minimum length
      ];

      validNames.forEach((name) => {
        expect(() => new StorageFileNameValueObject(name)).not.toThrow();
      });
    });

    it('should handle special characters in file names', () => {
      const fileName = new StorageFileNameValueObject('file-name_123.pdf');

      expect(fileName.value).toBe('file-name_123.pdf');
    });
  });

  describe('equals', () => {
    it('should return true for equal file names', () => {
      const fileName1 = new StorageFileNameValueObject('test-file.pdf');
      const fileName2 = new StorageFileNameValueObject('test-file.pdf');

      expect(fileName1.equals(fileName2)).toBe(true);
    });

    it('should return false for different file names', () => {
      const fileName1 = new StorageFileNameValueObject('test-file.pdf');
      const fileName2 = new StorageFileNameValueObject('other-file.pdf');

      expect(fileName1.equals(fileName2)).toBe(false);
    });

    it('should be case-sensitive', () => {
      const fileName1 = new StorageFileNameValueObject('Test-File.pdf');
      const fileName2 = new StorageFileNameValueObject('test-file.pdf');

      expect(fileName1.equals(fileName2)).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should check if file name is not empty', () => {
      const fileName = new StorageFileNameValueObject('test-file.pdf');

      expect(fileName.isNotEmpty()).toBe(true);
    });

    it('should return file name length', () => {
      const fileName = new StorageFileNameValueObject('test-file.pdf');

      expect(fileName.length()).toBe(13);
    });

    it('should check if file name contains substring', () => {
      const fileName = new StorageFileNameValueObject('test-file.pdf');

      expect(fileName.contains('test')).toBe(true);
      expect(fileName.contains('other')).toBe(false);
    });

    it('should check if file name starts with prefix', () => {
      const fileName = new StorageFileNameValueObject('test-file.pdf');

      expect(fileName.startsWith('test')).toBe(true);
      expect(fileName.startsWith('file')).toBe(false);
    });

    it('should check if file name ends with suffix', () => {
      const fileName = new StorageFileNameValueObject('test-file.pdf');

      expect(fileName.endsWith('.pdf')).toBe(true);
      expect(fileName.endsWith('.png')).toBe(false);
    });
  });
});
