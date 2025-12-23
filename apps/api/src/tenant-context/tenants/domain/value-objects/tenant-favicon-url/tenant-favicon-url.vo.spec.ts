import { TenantFaviconUrlValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-favicon-url/tenant-favicon-url.vo';
import { UrlValueObject } from '@/shared/domain/value-objects/url/url.vo';

describe('TenantFaviconUrlValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantFaviconUrlValueObject', () => {
      const faviconUrl = new TenantFaviconUrlValueObject(
        'https://example.com/favicon.ico',
      );
      expect(faviconUrl).toBeInstanceOf(TenantFaviconUrlValueObject);
      expect(faviconUrl).toBeInstanceOf(UrlValueObject);
      expect(faviconUrl.value).toBe('https://example.com/favicon.ico');
    });

    it('should create a TenantFaviconUrlValueObject with http protocol', () => {
      const faviconUrl = new TenantFaviconUrlValueObject(
        'http://example.com/favicon.ico',
      );
      expect(faviconUrl.value).toBe('http://example.com/favicon.ico');
    });
  });

  describe('equals', () => {
    it('should return true for equal URLs', () => {
      const faviconUrl1 = new TenantFaviconUrlValueObject(
        'https://example.com/favicon.ico',
      );
      const faviconUrl2 = new TenantFaviconUrlValueObject(
        'https://example.com/favicon.ico',
      );
      expect(faviconUrl1.equals(faviconUrl2)).toBe(true);
    });

    it('should return false for different URLs', () => {
      const faviconUrl1 = new TenantFaviconUrlValueObject(
        'https://example.com/favicon.ico',
      );
      const faviconUrl2 = new TenantFaviconUrlValueObject(
        'https://example.com/icon.ico',
      );
      expect(faviconUrl1.equals(faviconUrl2)).toBe(false);
    });
  });
});
