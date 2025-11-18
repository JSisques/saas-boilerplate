import { PromptTagUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-tag-uuid/prompt-tag-uuid.vo';
import { UuidValueObject } from '@/shared/domain/value-objects/uuid/uuid.vo';
import { InvalidUuidException } from '@/shared/domain/exceptions/value-objects/invalid-uuid/invalid-uuid.exception';

describe('PromptTagUuidValueObject', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  it('should be an instance of UuidValueObject', () => {
    const uuid = new PromptTagUuidValueObject(validUuid);
    expect(uuid).toBeInstanceOf(UuidValueObject);
  });

  it('should create with valid UUID', () => {
    const uuid = new PromptTagUuidValueObject(validUuid);
    expect(uuid.value).toBe(validUuid);
  });

  it('should generate random UUID when no value provided', () => {
    const uuid = new PromptTagUuidValueObject();
    expect(uuid.value).toBeDefined();
    expect(uuid.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should throw InvalidUuidException for invalid UUID', () => {
    expect(() => new PromptTagUuidValueObject('invalid')).toThrow(
      InvalidUuidException,
    );
  });

  it('should support equals method', () => {
    const uuid1 = new PromptTagUuidValueObject(validUuid);
    const uuid2 = new PromptTagUuidValueObject(validUuid);
    expect(uuid1.equals(uuid2)).toBe(true);
  });
});

