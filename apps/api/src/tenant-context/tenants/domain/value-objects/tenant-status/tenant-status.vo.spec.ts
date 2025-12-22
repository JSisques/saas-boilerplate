import { TenantStatusValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-status/tenant-status.vo';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

describe('TenantStatusValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantStatusValueObject with ACTIVE', () => {
      const status = new TenantStatusValueObject(TenantStatusEnum.ACTIVE);
      expect(status).toBeInstanceOf(TenantStatusValueObject);
      expect(status).toBeInstanceOf(EnumValueObject);
      expect(status.value).toBe(TenantStatusEnum.ACTIVE);
    });

    it('should create a valid TenantStatusValueObject with INACTIVE', () => {
      const status = new TenantStatusValueObject(TenantStatusEnum.INACTIVE);
      expect(status.value).toBe(TenantStatusEnum.INACTIVE);
    });

    it('should create a valid TenantStatusValueObject with BLOCKED', () => {
      const status = new TenantStatusValueObject(TenantStatusEnum.BLOCKED);
      expect(status.value).toBe(TenantStatusEnum.BLOCKED);
    });
  });

  describe('equals', () => {
    it('should return true for equal statuses', () => {
      const status1 = new TenantStatusValueObject(TenantStatusEnum.ACTIVE);
      const status2 = new TenantStatusValueObject(TenantStatusEnum.ACTIVE);
      expect(status1.equals(status2)).toBe(true);
    });

    it('should return false for different statuses', () => {
      const status1 = new TenantStatusValueObject(TenantStatusEnum.ACTIVE);
      const status2 = new TenantStatusValueObject(TenantStatusEnum.INACTIVE);
      expect(status1.equals(status2)).toBe(false);
    });
  });
});
