import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UuidValueObject } from '@/shared/domain/value-objects/uuid/uuid.vo';
import { InvalidUuidException } from '@/shared/domain/exceptions/value-objects/invalid-uuid/invalid-uuid.exception';

describe('AuthUuidValueObject', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  it('should be an instance of UuidValueObject', () => {
    const authUuid = new AuthUuidValueObject(validUuid);

    expect(authUuid).toBeInstanceOf(UuidValueObject);
  });

  it('should create an auth UUID value object with valid UUID', () => {
    const authUuid = new AuthUuidValueObject(validUuid);

    expect(authUuid.value).toBe(validUuid);
  });

  it('should generate a random UUID when no value is provided', () => {
    const authUuid = new AuthUuidValueObject();

    expect(authUuid.value).toBeDefined();
    expect(authUuid.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should throw InvalidUuidException for invalid UUID', () => {
    expect(() => new AuthUuidValueObject('invalid')).toThrow(
      InvalidUuidException,
    );
  });

  it('should support equals method from UuidValueObject', () => {
    const authUuid1 = new AuthUuidValueObject(validUuid);
    const authUuid2 = new AuthUuidValueObject(validUuid);

    expect(authUuid1.equals(authUuid2)).toBe(true);
  });
});
