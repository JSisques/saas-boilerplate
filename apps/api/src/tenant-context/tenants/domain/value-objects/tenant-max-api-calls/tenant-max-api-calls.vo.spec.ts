import { TenantMaxApiCallsValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-max-api-calls/tenant-max-api-calls.vo';
import { NumberValueObject } from '@/shared/domain/value-objects/number/number.vo';

describe('TenantMaxApiCallsValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantMaxApiCallsValueObject', () => {
      const maxApiCalls = new TenantMaxApiCallsValueObject(10000);
      expect(maxApiCalls).toBeInstanceOf(TenantMaxApiCallsValueObject);
      expect(maxApiCalls).toBeInstanceOf(NumberValueObject);
      expect(maxApiCalls.value).toBe(10000);
    });

    it('should create a TenantMaxApiCallsValueObject with minimum value', () => {
      const maxApiCalls = new TenantMaxApiCallsValueObject(0);
      expect(maxApiCalls.value).toBe(0);
    });

    it('should throw error for negative values', () => {
      expect(() => {
        new TenantMaxApiCallsValueObject(-1);
      }).toThrow();
    });

    it('should throw error for decimal values', () => {
      expect(() => {
        new TenantMaxApiCallsValueObject(10000.5);
      }).toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for equal values', () => {
      const maxApiCalls1 = new TenantMaxApiCallsValueObject(10000);
      const maxApiCalls2 = new TenantMaxApiCallsValueObject(10000);
      expect(maxApiCalls1.equals(maxApiCalls2)).toBe(true);
    });

    it('should return false for different values', () => {
      const maxApiCalls1 = new TenantMaxApiCallsValueObject(10000);
      const maxApiCalls2 = new TenantMaxApiCallsValueObject(20000);
      expect(maxApiCalls1.equals(maxApiCalls2)).toBe(false);
    });
  });
});
