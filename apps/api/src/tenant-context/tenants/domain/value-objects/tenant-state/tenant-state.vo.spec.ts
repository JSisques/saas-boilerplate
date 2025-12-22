import { TenantStateValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-state/tenant-state.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('TenantStateValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantStateValueObject', () => {
      const state = new TenantStateValueObject('NY');
      expect(state).toBeInstanceOf(TenantStateValueObject);
      expect(state).toBeInstanceOf(StringValueObject);
      expect(state.value).toBe('NY');
    });

    it('should create a TenantStateValueObject with empty string', () => {
      const state = new TenantStateValueObject('');
      expect(state.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal states', () => {
      const state1 = new TenantStateValueObject('NY');
      const state2 = new TenantStateValueObject('NY');
      expect(state1.equals(state2)).toBe(true);
    });

    it('should return false for different states', () => {
      const state1 = new TenantStateValueObject('NY');
      const state2 = new TenantStateValueObject('CA');
      expect(state1.equals(state2)).toBe(false);
    });
  });
});
