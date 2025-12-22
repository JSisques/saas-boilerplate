import { TenantPhoneNumberValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-phone-number/tenant-phone-number.vo';
import { PhoneValueObject } from '@/shared/domain/value-objects/phone/phone.vo';

describe('TenantPhoneNumberValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantPhoneNumberValueObject', () => {
      const phoneNumber = new TenantPhoneNumberValueObject('1234567890');
      expect(phoneNumber).toBeInstanceOf(TenantPhoneNumberValueObject);
      expect(phoneNumber).toBeInstanceOf(PhoneValueObject);
      expect(phoneNumber.value).toBe('1234567890');
    });
  });

  describe('equals', () => {
    it('should return true for equal phone numbers', () => {
      const phone1 = new TenantPhoneNumberValueObject('1234567890');
      const phone2 = new TenantPhoneNumberValueObject('1234567890');
      expect(phone1.equals(phone2)).toBe(true);
    });

    it('should return false for different phone numbers', () => {
      const phone1 = new TenantPhoneNumberValueObject('1234567890');
      const phone2 = new TenantPhoneNumberValueObject('0987654321');
      expect(phone1.equals(phone2)).toBe(false);
    });
  });
});
