import { JsonValueObject } from '@/shared/domain/value-objects/json/json.vo';
import { InvalidJsonException } from '@/shared/domain/exceptions/value-objects/invalid-json/invalid-json.exception';

describe('JsonValueObject', () => {
  describe('constructor', () => {
    it('should create a JSON value object with valid object', () => {
      const json = new JsonValueObject({ key: 'value' });

      expect(json.value).toEqual({ key: 'value' });
    });

    it('should create a JSON value object from JSON string', () => {
      const json = new JsonValueObject('{"key":"value"}');

      expect(json.value).toEqual({ key: 'value' });
    });

    it('should create empty object when no value provided', () => {
      const json = new JsonValueObject();

      expect(json.value).toEqual({});
    });

    it('should throw InvalidJsonException for invalid JSON string', () => {
      expect(() => new JsonValueObject('invalid json')).toThrow(
        InvalidJsonException,
      );
    });

    it('should throw InvalidJsonException for array', () => {
      expect(() => new JsonValueObject([1, 2, 3] as any)).toThrow(
        InvalidJsonException,
      );
    });

    it('should throw InvalidJsonException when empty and allowEmpty is false', () => {
      expect(() => new JsonValueObject({}, { allowEmpty: false })).toThrow(
        InvalidJsonException,
      );
    });

    it('should throw InvalidJsonException when missing required keys', () => {
      expect(
        () =>
          new JsonValueObject(
            { key1: 'value1' },
            { requiredKeys: ['key1', 'key2'] },
          ),
      ).toThrow(InvalidJsonException);
    });
  });

  describe('equals', () => {
    it('should return true for equal JSON objects', () => {
      const json1 = new JsonValueObject({ key: 'value' });
      const json2 = new JsonValueObject({ key: 'value' });

      expect(json1.equals(json2)).toBe(true);
    });

    it('should return false for different JSON objects', () => {
      const json1 = new JsonValueObject({ key: 'value1' });
      const json2 = new JsonValueObject({ key: 'value2' });

      expect(json1.equals(json2)).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should check if JSON is empty', () => {
      expect(new JsonValueObject({}).isEmpty()).toBe(true);
      expect(new JsonValueObject({ key: 'value' }).isEmpty()).toBe(false);
    });

    it('should get value by key', () => {
      const json = new JsonValueObject({ key: 'value' });

      expect(json.get('key')).toBe('value');
      expect(json.get('nonexistent')).toBeUndefined();
    });

    it('should get value with default', () => {
      const json = new JsonValueObject({ key: 'value' });

      expect(json.getOrDefault('key', 'default')).toBe('value');
      expect(json.getOrDefault('nonexistent', 'default')).toBe('default');
    });

    it('should get all keys', () => {
      const json = new JsonValueObject({ key1: 'value1', key2: 'value2' });

      expect(json.keys()).toEqual(['key1', 'key2']);
    });

    it('should merge JSON objects', () => {
      const json1 = new JsonValueObject({ key1: 'value1' });
      const json2 = new JsonValueObject({ key2: 'value2' });

      const merged = json1.merge(json2);
      expect(merged.value).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should pick specified keys', () => {
      const json = new JsonValueObject({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });

      const picked = json.pick(['key1', 'key3']);
      expect(picked.value).toEqual({ key1: 'value1', key3: 'value3' });
    });

    it('should omit specified keys', () => {
      const json = new JsonValueObject({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });

      const omitted = json.omit(['key2']);
      expect(omitted.value).toEqual({ key1: 'value1', key3: 'value3' });
    });
  });
});
