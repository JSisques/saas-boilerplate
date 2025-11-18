import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { UuidValueObject } from '@/shared/domain/value-objects/uuid/uuid.vo';
import { InvalidUuidException } from '@/shared/domain/exceptions/value-objects/invalid-uuid/invalid-uuid.exception';

describe('UserUuidValueObject', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  it('should be an instance of UuidValueObject', () => {
    const userUuid = new UserUuidValueObject(validUuid);

    expect(userUuid).toBeInstanceOf(UuidValueObject);
  });

  it('should create a user UUID value object with valid UUID', () => {
    const userUuid = new UserUuidValueObject(validUuid);

    expect(userUuid.value).toBe(validUuid);
  });

  it('should generate a random UUID when no value is provided', () => {
    const userUuid = new UserUuidValueObject();

    expect(userUuid.value).toBeDefined();
    expect(userUuid.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should throw InvalidUuidException for invalid UUID', () => {
    expect(() => new UserUuidValueObject('invalid')).toThrow(
      InvalidUuidException,
    );
  });

  it('should support equals method from UuidValueObject', () => {
    const userUuid1 = new UserUuidValueObject(validUuid);
    const userUuid2 = new UserUuidValueObject(validUuid);

    expect(userUuid1.equals(userUuid2)).toBe(true);
  });

  it('should support all UuidValueObject methods', () => {
    const userUuid = new UserUuidValueObject(validUuid);

    expect(userUuid.getVersion()).toBeDefined();
    expect(typeof userUuid.isNil()).toBe('boolean');
  });
});

