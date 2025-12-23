import { TenantDescriptionValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-description/tenant-description.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('TenantDescriptionValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantDescriptionValueObject', () => {
      const description = new TenantDescriptionValueObject('Test description');
      expect(description).toBeInstanceOf(TenantDescriptionValueObject);
      expect(description).toBeInstanceOf(StringValueObject);
      expect(description.value).toBe('Test description');
    });

    it('should create a TenantDescriptionValueObject with empty string', () => {
      const description = new TenantDescriptionValueObject('');
      expect(description.value).toBe('');
    });

    it('should create a TenantDescriptionValueObject with long description', () => {
      const longDescription = 'A'.repeat(500);
      const description = new TenantDescriptionValueObject(longDescription);
      expect(description.value).toBe(longDescription);
    });
  });

  describe('equals', () => {
    it('should return true for equal descriptions', () => {
      const desc1 = new TenantDescriptionValueObject('Test description');
      const desc2 = new TenantDescriptionValueObject('Test description');
      expect(desc1.equals(desc2)).toBe(true);
    });

    it('should return false for different descriptions', () => {
      const desc1 = new TenantDescriptionValueObject('Test description');
      const desc2 = new TenantDescriptionValueObject('Another description');
      expect(desc1.equals(desc2)).toBe(false);
    });
  });
});
