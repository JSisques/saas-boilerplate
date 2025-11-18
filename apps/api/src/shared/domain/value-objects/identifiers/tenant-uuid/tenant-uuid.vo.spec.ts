import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UuidValueObject } from '@/shared/domain/value-objects/uuid/uuid.vo';
import { InvalidUuidException } from '@/shared/domain/exceptions/value-objects/invalid-uuid/invalid-uuid.exception';

describe('TenantUuidValueObject', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  it('should be an instance of UuidValueObject', () => {
    const tenantUuid = new TenantUuidValueObject(validUuid);

    expect(tenantUuid).toBeInstanceOf(UuidValueObject);
  });

  it('should create a tenant UUID value object with valid UUID', () => {
    const tenantUuid = new TenantUuidValueObject(validUuid);

    expect(tenantUuid.value).toBe(validUuid);
  });

  it('should generate a random UUID when no value is provided', () => {
    const tenantUuid = new TenantUuidValueObject();

    expect(tenantUuid.value).toBeDefined();
    expect(tenantUuid.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should throw InvalidUuidException for invalid UUID', () => {
    expect(() => new TenantUuidValueObject('invalid')).toThrow(
      InvalidUuidException,
    );
  });

  it('should support equals method from UuidValueObject', () => {
    const tenantUuid1 = new TenantUuidValueObject(validUuid);
    const tenantUuid2 = new TenantUuidValueObject(validUuid);

    expect(tenantUuid1.equals(tenantUuid2)).toBe(true);
  });
});

