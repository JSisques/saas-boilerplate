import { TenantMemberUpdatedAtValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-updated-at/tenant-member-updated-at.vo';

describe('TenantMemberUpdatedAtValueObject', () => {
  describe('constructor', () => {
    it('should create a TenantMemberUpdatedAtValueObject with provided date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const tenantMemberUpdatedAt = new TenantMemberUpdatedAtValueObject(date);

      expect(tenantMemberUpdatedAt.value).toBe(date);
    });

    it('should create a TenantMemberUpdatedAtValueObject with current date when no date provided', () => {
      const beforeCreation = new Date();
      const tenantMemberUpdatedAt = new TenantMemberUpdatedAtValueObject();
      const afterCreation = new Date();

      expect(tenantMemberUpdatedAt.value).toBeInstanceOf(Date);
      expect(tenantMemberUpdatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(tenantMemberUpdatedAt.value.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  describe('value getter', () => {
    it('should return the date value', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const tenantMemberUpdatedAt = new TenantMemberUpdatedAtValueObject(date);

      expect(tenantMemberUpdatedAt.value).toBe(date);
    });
  });

  describe('toISOString', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const tenantMemberUpdatedAt = new TenantMemberUpdatedAtValueObject(date);

      expect(tenantMemberUpdatedAt.toISOString()).toBe(
        '2024-01-01T10:00:00.000Z',
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal dates', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const tenantMemberUpdatedAt1 = new TenantMemberUpdatedAtValueObject(date);
      const tenantMemberUpdatedAt2 = new TenantMemberUpdatedAtValueObject(date);

      expect(tenantMemberUpdatedAt1.equals(tenantMemberUpdatedAt2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-02T10:00:00Z');
      const tenantMemberUpdatedAt1 = new TenantMemberUpdatedAtValueObject(
        date1,
      );
      const tenantMemberUpdatedAt2 = new TenantMemberUpdatedAtValueObject(
        date2,
      );

      expect(tenantMemberUpdatedAt1.equals(tenantMemberUpdatedAt2)).toBe(false);
    });

    it('should return true when comparing with another TenantMemberUpdatedAtValueObject with same date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const tenantMemberUpdatedAt1 = new TenantMemberUpdatedAtValueObject(date);
      const tenantMemberUpdatedAt2 = new TenantMemberUpdatedAtValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );

      expect(tenantMemberUpdatedAt1.equals(tenantMemberUpdatedAt2)).toBe(true);
    });
  });
});
