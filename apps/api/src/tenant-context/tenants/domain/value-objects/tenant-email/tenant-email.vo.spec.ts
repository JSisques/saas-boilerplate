import { TenantEmailValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-email/tenant-email.vo';
import { EmailValueObject } from '@/shared/domain/value-objects/email/email.vo';

describe('TenantEmailValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantEmailValueObject', () => {
      const email = new TenantEmailValueObject('test@example.com');
      expect(email).toBeInstanceOf(TenantEmailValueObject);
      expect(email).toBeInstanceOf(EmailValueObject);
      expect(email.value).toBe('test@example.com');
    });

    it('should create a TenantEmailValueObject with valid email format', () => {
      const email = new TenantEmailValueObject('user.name+tag@example.co.uk');
      expect(email.value).toBe('user.name+tag@example.co.uk');
    });
  });

  describe('equals', () => {
    it('should return true for equal emails', () => {
      const email1 = new TenantEmailValueObject('test@example.com');
      const email2 = new TenantEmailValueObject('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = new TenantEmailValueObject('test@example.com');
      const email2 = new TenantEmailValueObject('another@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe('inherited methods from EmailValueObject', () => {
    it('should return correct email value', () => {
      const email = new TenantEmailValueObject('test@example.com');
      expect(email.value).toBe('test@example.com');
    });
  });
});
