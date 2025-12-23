import { TenantWebsiteUrlValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-website-url/tenant-website-url.vo';
import { UrlValueObject } from '@/shared/domain/value-objects/url/url.vo';

describe('TenantWebsiteUrlValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantWebsiteUrlValueObject', () => {
      const url = new TenantWebsiteUrlValueObject('https://example.com');
      expect(url).toBeInstanceOf(TenantWebsiteUrlValueObject);
      expect(url).toBeInstanceOf(UrlValueObject);
      expect(url.value).toBe('https://example.com');
    });

    it('should create a TenantWebsiteUrlValueObject with http protocol', () => {
      const url = new TenantWebsiteUrlValueObject('http://example.com');
      expect(url.value).toBe('http://example.com');
    });

    it('should create a TenantWebsiteUrlValueObject with path', () => {
      const url = new TenantWebsiteUrlValueObject('https://example.com/path');
      expect(url.value).toBe('https://example.com/path');
    });
  });

  describe('equals', () => {
    it('should return true for equal URLs', () => {
      const url1 = new TenantWebsiteUrlValueObject('https://example.com');
      const url2 = new TenantWebsiteUrlValueObject('https://example.com');
      expect(url1.equals(url2)).toBe(true);
    });

    it('should return false for different URLs', () => {
      const url1 = new TenantWebsiteUrlValueObject('https://example.com');
      const url2 = new TenantWebsiteUrlValueObject('https://another.com');
      expect(url1.equals(url2)).toBe(false);
    });
  });
});
