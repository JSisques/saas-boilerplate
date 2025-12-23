import { TenantSlugValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-slug/tenant-slug.vo';
import { SlugValueObject } from '@/shared/domain/value-objects/slug/slug.vo';

describe('TenantSlugValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantSlugValueObject', () => {
      const slug = new TenantSlugValueObject('test-tenant');
      expect(slug).toBeInstanceOf(TenantSlugValueObject);
      expect(slug).toBeInstanceOf(SlugValueObject);
      expect(slug.value).toBe('test-tenant');
    });

    it('should create a TenantSlugValueObject with lowercase slug', () => {
      // SlugValueObject normalizes to lowercase when using generateFromString
      const slug = new TenantSlugValueObject('test-tenant');
      expect(slug.value).toBe('test-tenant');
    });

    it('should create a TenantSlugValueObject with hyphens', () => {
      const slug = new TenantSlugValueObject('my-test-tenant');
      expect(slug.value).toBe('my-test-tenant');
    });
  });

  describe('equals', () => {
    it('should return true for equal slugs', () => {
      const slug1 = new TenantSlugValueObject('test-tenant');
      const slug2 = new TenantSlugValueObject('test-tenant');
      expect(slug1.equals(slug2)).toBe(true);
    });

    it('should return false for different slugs', () => {
      const slug1 = new TenantSlugValueObject('test-tenant');
      const slug2 = new TenantSlugValueObject('another-tenant');
      expect(slug1.equals(slug2)).toBe(false);
    });
  });

  describe('inherited methods from SlugValueObject', () => {
    it('should return correct slug value', () => {
      const slug = new TenantSlugValueObject('test-tenant');
      expect(slug.value).toBe('test-tenant');
    });
  });
});
