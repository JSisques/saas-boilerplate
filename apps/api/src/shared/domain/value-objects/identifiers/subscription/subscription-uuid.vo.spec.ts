import { SubscriptionUuidValueObject } from '@/shared/domain/value-objects/identifiers/subscription/subscription-uuid.vo';
import { UuidValueObject } from '@/shared/domain/value-objects/uuid/uuid.vo';
import { InvalidUuidException } from '@/shared/domain/exceptions/value-objects/invalid-uuid/invalid-uuid.exception';

describe('SubscriptionUuidValueObject', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  it('should be an instance of UuidValueObject', () => {
    const subscriptionUuid = new SubscriptionUuidValueObject(validUuid);

    expect(subscriptionUuid).toBeInstanceOf(UuidValueObject);
  });

  it('should create a subscription UUID value object with valid UUID', () => {
    const subscriptionUuid = new SubscriptionUuidValueObject(validUuid);

    expect(subscriptionUuid.value).toBe(validUuid);
  });

  it('should generate a random UUID when no value is provided', () => {
    const subscriptionUuid = new SubscriptionUuidValueObject();

    expect(subscriptionUuid.value).toBeDefined();
    expect(subscriptionUuid.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should throw InvalidUuidException for invalid UUID', () => {
    expect(() => new SubscriptionUuidValueObject('invalid')).toThrow(
      InvalidUuidException,
    );
  });

  it('should support equals method from UuidValueObject', () => {
    const subscriptionUuid1 = new SubscriptionUuidValueObject(validUuid);
    const subscriptionUuid2 = new SubscriptionUuidValueObject(validUuid);

    expect(subscriptionUuid1.equals(subscriptionUuid2)).toBe(true);
  });
});

