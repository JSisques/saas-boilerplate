import { StorageFileSizeValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-size/storage-file-size.vo';

describe('StorageFileSizeValueObject', () => {
  describe('constructor', () => {
    it('should create a storage file size value object with a valid number', () => {
      const fileSize = new StorageFileSizeValueObject(1024);

      expect(fileSize.value).toBe(1024);
    });

    it('should accept zero as valid file size', () => {
      const fileSize = new StorageFileSizeValueObject(0);

      expect(fileSize.value).toBe(0);
    });

    it('should not allow negative numbers', () => {
      expect(() => {
        new StorageFileSizeValueObject(-1);
      }).toThrow();
    });

    it('should accept large file sizes', () => {
      const largeSize = 1024 * 1024 * 1024 * 10; // 10 GB
      const fileSize = new StorageFileSizeValueObject(largeSize);

      expect(fileSize.value).toBe(largeSize);
    });
  });

  describe('toKilobytes', () => {
    it('should convert bytes to kilobytes', () => {
      const fileSize = new StorageFileSizeValueObject(1024);

      expect(fileSize.toKilobytes()).toBe(1);
    });

    it('should convert 2048 bytes to 2 kilobytes', () => {
      const fileSize = new StorageFileSizeValueObject(2048);

      expect(fileSize.toKilobytes()).toBe(2);
    });

    it('should convert 512 bytes to 0.5 kilobytes', () => {
      const fileSize = new StorageFileSizeValueObject(512);

      expect(fileSize.toKilobytes()).toBe(0.5);
    });
  });

  describe('toMegabytes', () => {
    it('should convert bytes to megabytes', () => {
      const fileSize = new StorageFileSizeValueObject(1024 * 1024);

      expect(fileSize.toMegabytes()).toBe(1);
    });

    it('should convert 2MB to 2 megabytes', () => {
      const fileSize = new StorageFileSizeValueObject(2 * 1024 * 1024);

      expect(fileSize.toMegabytes()).toBe(2);
    });

    it('should convert 512KB to 0.5 megabytes', () => {
      const fileSize = new StorageFileSizeValueObject(512 * 1024);

      expect(fileSize.toMegabytes()).toBe(0.5);
    });
  });

  describe('toGigabytes', () => {
    it('should convert bytes to gigabytes', () => {
      const fileSize = new StorageFileSizeValueObject(1024 * 1024 * 1024);

      expect(fileSize.toGigabytes()).toBe(1);
    });

    it('should convert 2GB to 2 gigabytes', () => {
      const fileSize = new StorageFileSizeValueObject(2 * 1024 * 1024 * 1024);

      expect(fileSize.toGigabytes()).toBe(2);
    });

    it('should convert 512MB to 0.5 gigabytes', () => {
      const fileSize = new StorageFileSizeValueObject(512 * 1024 * 1024);

      expect(fileSize.toGigabytes()).toBe(0.5);
    });
  });

  describe('toHumanReadable', () => {
    it('should return "0 Bytes" for zero size', () => {
      const fileSize = new StorageFileSizeValueObject(0);

      expect(fileSize.toHumanReadable()).toBe('0 Bytes');
    });

    it('should format bytes correctly', () => {
      const fileSize = new StorageFileSizeValueObject(500);

      expect(fileSize.toHumanReadable()).toBe('500 Bytes');
    });

    it('should format kilobytes correctly', () => {
      const fileSize = new StorageFileSizeValueObject(1024);

      expect(fileSize.toHumanReadable()).toContain('KB');
    });

    it('should format megabytes correctly', () => {
      const fileSize = new StorageFileSizeValueObject(1024 * 1024);

      expect(fileSize.toHumanReadable()).toContain('MB');
    });

    it('should format gigabytes correctly', () => {
      const fileSize = new StorageFileSizeValueObject(1024 * 1024 * 1024);

      expect(fileSize.toHumanReadable()).toContain('GB');
    });

    it('should format terabytes correctly', () => {
      const fileSize = new StorageFileSizeValueObject(
        1024 * 1024 * 1024 * 1024,
      );

      expect(fileSize.toHumanReadable()).toContain('TB');
    });
  });

  describe('equals', () => {
    it('should return true for equal file sizes', () => {
      const fileSize1 = new StorageFileSizeValueObject(1024);
      const fileSize2 = new StorageFileSizeValueObject(1024);

      expect(fileSize1.equals(fileSize2)).toBe(true);
    });

    it('should return false for different file sizes', () => {
      const fileSize1 = new StorageFileSizeValueObject(1024);
      const fileSize2 = new StorageFileSizeValueObject(2048);

      expect(fileSize1.equals(fileSize2)).toBe(false);
    });
  });
});
