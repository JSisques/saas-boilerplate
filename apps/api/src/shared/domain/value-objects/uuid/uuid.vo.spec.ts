import { InvalidUuidException } from '@/shared/domain/exceptions/value-objects/invalid-uuid/invalid-uuid.exception';
import { UuidValueObject } from '@/shared/domain/value-objects/uuid/uuid.vo';

describe('UuidValueObject', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';
  const validUuidV4 = '550e8400-e29b-41d4-a716-446655440000';
  const nilUuid = '00000000-0000-0000-0000-000000000000';

  describe('constructor', () => {
    it('should create a UUID value object with a valid UUID', () => {
      const uuid = new UuidValueObject(validUuid);

      expect(uuid.value).toBe(validUuid);
    });

    it('should generate a random UUID when no value is provided', () => {
      const uuid1 = new UuidValueObject();
      const uuid2 = new UuidValueObject();

      expect(uuid1.value).toBeDefined();
      expect(uuid2.value).toBeDefined();
      expect(uuid1.value).not.toBe(uuid2.value);
      expect(uuid1.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should throw InvalidUuidException for empty string', () => {
      expect(() => new UuidValueObject('')).toThrow(InvalidUuidException);
      expect(() => new UuidValueObject('   ')).toThrow(InvalidUuidException);
    });

    it('should throw InvalidUuidException for invalid UUID format', () => {
      expect(() => new UuidValueObject('invalid-uuid')).toThrow(
        InvalidUuidException,
      );
      expect(() => new UuidValueObject('123')).toThrow(InvalidUuidException);
      expect(() => new UuidValueObject('123e4567-e89b-12d3-a456')).toThrow(
        InvalidUuidException,
      );
    });

    it('should throw InvalidUuidException for UUID with invalid version', () => {
      expect(
        () => new UuidValueObject('123e4567-e89b-62d3-a456-426614174000'),
      ).toThrow(InvalidUuidException);
    });

    it('should throw InvalidUuidException for UUID with invalid variant', () => {
      expect(
        () => new UuidValueObject('123e4567-e89b-12d3-c456-426614174000'),
      ).toThrow(InvalidUuidException);
    });
  });

  describe('value getter', () => {
    it('should return the UUID string', () => {
      const uuid = new UuidValueObject(validUuid);

      expect(uuid.value).toBe(validUuid);
    });
  });

  describe('equals', () => {
    it('should return true for equal UUIDs', () => {
      const uuid1 = new UuidValueObject(validUuid);
      const uuid2 = new UuidValueObject(validUuid);

      expect(uuid1.equals(uuid2)).toBe(true);
    });

    it('should return false for different UUIDs', () => {
      const uuid1 = new UuidValueObject(validUuid);
      const uuid2 = new UuidValueObject(validUuidV4);

      expect(uuid1.equals(uuid2)).toBe(false);
    });
  });

  describe('getVersion', () => {
    it('should return the version number for valid UUIDs', () => {
      const uuid = new UuidValueObject(validUuid);

      const version = uuid.getVersion();
      expect(version).toBeGreaterThanOrEqual(1);
      expect(version).toBeLessThanOrEqual(5);
    });
  });

  describe('isNil', () => {
    it('should return false for non-nil UUID', () => {
      const uuid = new UuidValueObject(validUuid);

      expect(uuid.isNil()).toBe(false);
    });
  });

  describe('generate', () => {
    it('should generate a new random UUID', () => {
      const uuid1 = UuidValueObject.generate();
      const uuid2 = UuidValueObject.generate();

      expect(uuid1).toBeInstanceOf(UuidValueObject);
      expect(uuid2).toBeInstanceOf(UuidValueObject);
      expect(uuid1.value).not.toBe(uuid2.value);
      expect(uuid1.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });
});
