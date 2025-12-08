import { StorageProviderValueObject } from '@/storage-context/storage/domain/value-objects/storage-provider/storage-provider.vo';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';

describe('StorageProviderValueObject', () => {
  describe('constructor', () => {
    it('should create a storage provider value object with S3', () => {
      const provider = new StorageProviderValueObject(StorageProviderEnum.S3);

      expect(provider.value).toBe(StorageProviderEnum.S3);
    });

    it('should create a storage provider value object with SUPABASE', () => {
      const provider = new StorageProviderValueObject(
        StorageProviderEnum.SUPABASE,
      );

      expect(provider.value).toBe(StorageProviderEnum.SUPABASE);
    });

    it('should create a storage provider value object with SERVER_ROUTE', () => {
      const provider = new StorageProviderValueObject(
        StorageProviderEnum.SERVER_ROUTE,
      );

      expect(provider.value).toBe(StorageProviderEnum.SERVER_ROUTE);
    });

    it('should not allow invalid enum values', () => {
      expect(() => {
        new StorageProviderValueObject('INVALID' as StorageProviderEnum);
      }).toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for equal providers', () => {
      const provider1 = new StorageProviderValueObject(StorageProviderEnum.S3);
      const provider2 = new StorageProviderValueObject(StorageProviderEnum.S3);

      expect(provider1.equals(provider2)).toBe(true);
    });

    it('should return false for different providers', () => {
      const provider1 = new StorageProviderValueObject(StorageProviderEnum.S3);
      const provider2 = new StorageProviderValueObject(
        StorageProviderEnum.SUPABASE,
      );

      expect(provider1.equals(provider2)).toBe(false);
    });
  });

  describe('all enum values', () => {
    it('should accept all valid enum values', () => {
      const enumValues = Object.values(StorageProviderEnum);

      enumValues.forEach((value) => {
        expect(() => {
          new StorageProviderValueObject(value);
        }).not.toThrow();
      });
    });
  });
});
