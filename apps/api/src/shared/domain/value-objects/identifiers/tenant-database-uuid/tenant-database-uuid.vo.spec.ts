import { InvalidUuidException } from '@/shared/domain/exceptions/value-objects/invalid-uuid/invalid-uuid.exception';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { UuidValueObject } from '@/shared/domain/value-objects/uuid/uuid.vo';

describe('TenantDatabaseUuidValueObject', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  it('should be an instance of UuidValueObject', () => {
    const tenantDatabaseUuid = new TenantDatabaseUuidValueObject(validUuid);

    expect(tenantDatabaseUuid).toBeInstanceOf(UuidValueObject);
  });

  it('should create a tenant UUID value object with valid UUID', () => {
    const tenantDatabaseUuid = new TenantDatabaseUuidValueObject(validUuid);

    expect(tenantDatabaseUuid.value).toBe(validUuid);
  });

  it('should generate a random UUID when no value is provided', () => {
    const tenantDatabaseUuid = new TenantDatabaseUuidValueObject();

    expect(tenantDatabaseUuid.value).toBeDefined();
    expect(tenantDatabaseUuid.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should throw InvalidUuidException for invalid UUID', () => {
    expect(() => new TenantDatabaseUuidValueObject('invalid')).toThrow(
      InvalidUuidException,
    );
  });

  it('should support equals method from UuidValueObject', () => {
    const tenantDatabaseUuid1 = new TenantDatabaseUuidValueObject(validUuid);
    const tenantDatabaseUuid2 = new TenantDatabaseUuidValueObject(validUuid);

    expect(tenantDatabaseUuid1.equals(tenantDatabaseUuid2)).toBe(true);
  });
});
