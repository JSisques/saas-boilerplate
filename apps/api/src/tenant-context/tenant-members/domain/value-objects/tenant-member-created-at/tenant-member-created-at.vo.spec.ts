import { TenantMemberCreatedAtValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-created-at/tenant-member-created-at.vo';

describe('TenantMemberCreatedAtValueObject', () => {
  describe('constructor', () => {
    it('should create a TenantMemberCreatedAtValueObject with provided date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const tenantMemberCreatedAt = new TenantMemberCreatedAtValueObject(date);

      expect(tenantMemberCreatedAt.value).toBe(date);
    });

    it('should create a TenantMemberCreatedAtValueObject with current date when no date provided', () => {
      const beforeCreation = new Date();
      const tenantMemberCreatedAt = new TenantMemberCreatedAtValueObject();
      const afterCreation = new Date();

      expect(tenantMemberCreatedAt.value).toBeInstanceOf(Date);
      expect(tenantMemberCreatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(tenantMemberCreatedAt.value.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  describe('value getter', () => {
    it('should return the date value', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const tenantMemberCreatedAt = new TenantMemberCreatedAtValueObject(date);

      expect(tenantMemberCreatedAt.value).toBe(date);
    });
  });

  describe('toISOString', () => {
    it('should convert date to ISO string', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const tenantMemberCreatedAt = new TenantMemberCreatedAtValueObject(date);

      expect(tenantMemberCreatedAt.toISOString()).toBe(
        '2024-01-01T10:00:00.000Z',
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal dates', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const tenantMemberCreatedAt1 = new TenantMemberCreatedAtValueObject(date);
      const tenantMemberCreatedAt2 = new TenantMemberCreatedAtValueObject(date);

      expect(tenantMemberCreatedAt1.equals(tenantMemberCreatedAt2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2024-01-01T10:00:00Z');
      const date2 = new Date('2024-01-02T10:00:00Z');
      const tenantMemberCreatedAt1 = new TenantMemberCreatedAtValueObject(
        date1,
      );
      const tenantMemberCreatedAt2 = new TenantMemberCreatedAtValueObject(
        date2,
      );

      expect(tenantMemberCreatedAt1.equals(tenantMemberCreatedAt2)).toBe(
        false,
      );
    });

    it('should return true when comparing with another TenantMemberCreatedAtValueObject with same date', () => {
      const date = new Date('2024-01-01T10:00:00Z');
      const tenantMemberCreatedAt1 = new TenantMemberCreatedAtValueObject(date);
      const tenantMemberCreatedAt2 = new TenantMemberCreatedAtValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );

      expect(tenantMemberCreatedAt1.equals(tenantMemberCreatedAt2)).toBe(true);
    });
  });
});

