import { TenantPhoneCodeValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-phone-code/tenant-phone-code.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

describe('TenantPhoneCodeValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantPhoneCodeValueObject', () => {
      const phoneCode = new TenantPhoneCodeValueObject('+1');
      expect(phoneCode).toBeInstanceOf(TenantPhoneCodeValueObject);
      expect(phoneCode).toBeInstanceOf(StringValueObject);
      expect(phoneCode.value).toBe('+1');
    });

    it('should create a TenantPhoneCodeValueObject with empty string when allowEmpty is true', () => {
      const phoneCode = new TenantPhoneCodeValueObject('', {
        allowEmpty: true,
        validateExistence: false,
      });
      expect(phoneCode.value).toBe('');
    });
  });

  describe('equals', () => {
    it('should return true for equal phone codes', () => {
      const phoneCode1 = new TenantPhoneCodeValueObject('+1');
      const phoneCode2 = new TenantPhoneCodeValueObject('+1');
      expect(phoneCode1.equals(phoneCode2)).toBe(true);
    });

    it('should return false for different phone codes', () => {
      const phoneCode1 = new TenantPhoneCodeValueObject('+1');
      const phoneCode2 = new TenantPhoneCodeValueObject('+44');
      expect(phoneCode1.equals(phoneCode2)).toBe(false);
    });
  });
});
