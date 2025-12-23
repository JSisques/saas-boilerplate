import { TenantLogoUrlValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-logo-url/tenant-logo-url.vo';
import { UrlValueObject } from '@/shared/domain/value-objects/url/url.vo';

describe('TenantLogoUrlValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantLogoUrlValueObject', () => {
      const logoUrl = new TenantLogoUrlValueObject(
        'https://example.com/logo.png',
      );
      expect(logoUrl).toBeInstanceOf(TenantLogoUrlValueObject);
      expect(logoUrl).toBeInstanceOf(UrlValueObject);
      expect(logoUrl.value).toBe('https://example.com/logo.png');
    });

    it('should create a TenantLogoUrlValueObject with http protocol', () => {
      const logoUrl = new TenantLogoUrlValueObject(
        'http://example.com/logo.png',
      );
      expect(logoUrl.value).toBe('http://example.com/logo.png');
    });
  });

  describe('equals', () => {
    it('should return true for equal URLs', () => {
      const logoUrl1 = new TenantLogoUrlValueObject(
        'https://example.com/logo.png',
      );
      const logoUrl2 = new TenantLogoUrlValueObject(
        'https://example.com/logo.png',
      );
      expect(logoUrl1.equals(logoUrl2)).toBe(true);
    });

    it('should return false for different URLs', () => {
      const logoUrl1 = new TenantLogoUrlValueObject(
        'https://example.com/logo.png',
      );
      const logoUrl2 = new TenantLogoUrlValueObject(
        'https://example.com/icon.png',
      );
      expect(logoUrl1.equals(logoUrl2)).toBe(false);
    });
  });
});
