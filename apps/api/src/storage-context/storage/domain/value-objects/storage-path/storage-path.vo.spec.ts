import { StoragePathValueObject } from '@/storage-context/storage/domain/value-objects/storage-path/storage-path.vo';

describe('StoragePathValueObject', () => {
  describe('constructor', () => {
    it('should create a storage path value object with a valid path', () => {
      const path = new StoragePathValueObject('files/test-file.pdf');

      expect(path.value).toBe('files/test-file.pdf');
    });

    it('should trim whitespace by default', () => {
      const path = new StoragePathValueObject('  files/test-file.pdf  ');

      expect(path.value).toBe('files/test-file.pdf');
    });

    it('should not allow empty string', () => {
      expect(() => {
        new StoragePathValueObject('');
      }).toThrow();
    });

    it('should accept valid paths', () => {
      const validPaths = [
        'file.pdf',
        'files/document.pdf',
        'uploads/2024/01/file.pdf',
        'a/b/c/d/e/f.pdf',
      ];

      validPaths.forEach((path) => {
        expect(() => new StoragePathValueObject(path)).not.toThrow();
      });
    });

    it('should enforce max length of 1000 characters', () => {
      const longPath = 'a'.repeat(1001);
      expect(() => {
        new StoragePathValueObject(longPath);
      }).toThrow();
    });
  });

  describe('getDirectory', () => {
    it('should return the directory path without filename', () => {
      const path = new StoragePathValueObject('files/test-file.pdf');

      expect(path.getDirectory()).toBe('files');
    });

    it('should return nested directory path', () => {
      const path = new StoragePathValueObject('uploads/2024/01/file.pdf');

      expect(path.getDirectory()).toBe('uploads/2024/01');
    });

    it('should return empty string when there is no directory', () => {
      const path = new StoragePathValueObject('file.pdf');

      expect(path.getDirectory()).toBe('');
    });

    it('should handle paths with multiple slashes', () => {
      const path = new StoragePathValueObject('a/b/c/file.pdf');

      expect(path.getDirectory()).toBe('a/b/c');
    });
  });

  describe('getFilename', () => {
    it('should return the filename from the path', () => {
      const path = new StoragePathValueObject('files/test-file.pdf');

      expect(path.getFilename()).toBe('test-file.pdf');
    });

    it('should return the filename from nested path', () => {
      const path = new StoragePathValueObject('uploads/2024/01/file.pdf');

      expect(path.getFilename()).toBe('file.pdf');
    });

    it('should return the full path when there is no directory', () => {
      const path = new StoragePathValueObject('file.pdf');

      expect(path.getFilename()).toBe('file.pdf');
    });

    it('should handle paths with multiple slashes', () => {
      const path = new StoragePathValueObject('a/b/c/file.pdf');

      expect(path.getFilename()).toBe('file.pdf');
    });
  });

  describe('getExtension', () => {
    it('should return the file extension without dot', () => {
      const path = new StoragePathValueObject('files/test-file.pdf');

      expect(path.getExtension()).toBe('pdf');
    });

    it('should return empty string when there is no extension', () => {
      const path = new StoragePathValueObject('files/test-file');

      expect(path.getExtension()).toBe('');
    });

    it('should return the extension from nested path', () => {
      const path = new StoragePathValueObject('uploads/2024/01/file.png');

      expect(path.getExtension()).toBe('png');
    });

    it('should handle files with multiple dots correctly', () => {
      const path = new StoragePathValueObject('files/test.file.backup.pdf');

      expect(path.getExtension()).toBe('pdf');
    });
  });

  describe('join', () => {
    it('should join path with additional segments', () => {
      const path = new StoragePathValueObject('files');
      const joined = path.join('test-file.pdf');

      expect(joined.value).toBe('files/test-file.pdf');
    });

    it('should join path with multiple segments', () => {
      const path = new StoragePathValueObject('files');
      const joined = path.join('2024', '01', 'test-file.pdf');

      expect(joined.value).toBe('files/2024/01/test-file.pdf');
    });

    it('should filter out empty segments', () => {
      const path = new StoragePathValueObject('files');
      const joined = path.join('', 'test-file.pdf', '');

      expect(joined.value).toBe('files/test-file.pdf');
    });

    it('should create a new StoragePathValueObject instance', () => {
      const path = new StoragePathValueObject('files');
      const joined = path.join('test-file.pdf');

      expect(joined).toBeInstanceOf(StoragePathValueObject);
      expect(joined).not.toBe(path);
    });
  });

  describe('equals', () => {
    it('should return true for equal paths', () => {
      const path1 = new StoragePathValueObject('files/test-file.pdf');
      const path2 = new StoragePathValueObject('files/test-file.pdf');

      expect(path1.equals(path2)).toBe(true);
    });

    it('should return false for different paths', () => {
      const path1 = new StoragePathValueObject('files/test-file.pdf');
      const path2 = new StoragePathValueObject('files/other-file.pdf');

      expect(path1.equals(path2)).toBe(false);
    });
  });
});
