import { SagaStepPayloadValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-payload/saga-step-payload.vo';
import { InvalidJsonException } from '@/shared/domain/exceptions/value-objects/invalid-json/invalid-json.exception';

describe('SagaStepPayloadValueObject', () => {
  describe('constructor', () => {
    it('should create a saga step payload value object with valid object', () => {
      const payload = new SagaStepPayloadValueObject({ key: 'value' });

      expect(payload.value).toEqual({ key: 'value' });
    });

    it('should create empty object when no value provided', () => {
      const payload = new SagaStepPayloadValueObject();

      expect(payload.value).toEqual({});
    });

    it('should create from JSON string', () => {
      const payload = new SagaStepPayloadValueObject('{"key":"value"}');

      expect(payload.value).toEqual({ key: 'value' });
    });

    it('should create from complex JSON object', () => {
      const complexPayload = {
        orderId: '12345',
        userId: '67890',
        items: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 },
        ],
        metadata: {
          source: 'web',
          timestamp: '2024-01-01T10:00:00Z',
        },
      };
      const payload = new SagaStepPayloadValueObject(complexPayload);

      expect(payload.value).toEqual(complexPayload);
    });

    it('should allow empty object', () => {
      const payload = new SagaStepPayloadValueObject({});

      expect(payload.value).toEqual({});
    });

    it('should throw InvalidJsonException for invalid JSON string', () => {
      expect(() => new SagaStepPayloadValueObject('invalid json')).toThrow(
        InvalidJsonException,
      );
      expect(() => new SagaStepPayloadValueObject('{key: value}')).toThrow(
        InvalidJsonException,
      );
    });

    it('should throw InvalidJsonException for array', () => {
      expect(() => new SagaStepPayloadValueObject([1, 2, 3] as any)).toThrow(
        InvalidJsonException,
      );
    });

    it('should create empty object when null is provided', () => {
      const payload = new SagaStepPayloadValueObject(null as any);

      expect(payload.value).toEqual({});
    });

    it('should throw InvalidJsonException for primitive values', () => {
      expect(() => new SagaStepPayloadValueObject('string' as any)).toThrow(
        InvalidJsonException,
      );
      expect(() => new SagaStepPayloadValueObject(123 as any)).toThrow(
        InvalidJsonException,
      );
      expect(() => new SagaStepPayloadValueObject(true as any)).toThrow(
        InvalidJsonException,
      );
    });

    it('should handle nested objects', () => {
      const nestedPayload = {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      };
      const payload = new SagaStepPayloadValueObject(nestedPayload);

      expect(payload.value).toEqual(nestedPayload);
    });

    it('should handle arrays within objects', () => {
      const payloadWithArray = {
        items: [1, 2, 3],
        tags: ['tag1', 'tag2'],
      };
      const payload = new SagaStepPayloadValueObject(payloadWithArray);

      expect(payload.value).toEqual(payloadWithArray);
    });
  });

  describe('equals', () => {
    it('should return true for equal payloads', () => {
      const payload1 = new SagaStepPayloadValueObject({ key: 'value' });
      const payload2 = new SagaStepPayloadValueObject({ key: 'value' });

      expect(payload1.equals(payload2)).toBe(true);
    });

    it('should return false for different payloads', () => {
      const payload1 = new SagaStepPayloadValueObject({ key: 'value1' });
      const payload2 = new SagaStepPayloadValueObject({ key: 'value2' });

      expect(payload1.equals(payload2)).toBe(false);
    });

    it('should return true for empty objects', () => {
      const payload1 = new SagaStepPayloadValueObject({});
      const payload2 = new SagaStepPayloadValueObject({});

      expect(payload1.equals(payload2)).toBe(true);
    });

    it('should return true when comparing object and JSON string with same content', () => {
      const payload1 = new SagaStepPayloadValueObject({ key: 'value' });
      const payload2 = new SagaStepPayloadValueObject('{"key":"value"}');

      expect(payload1.equals(payload2)).toBe(true);
    });
  });

  describe('utility methods', () => {
    it('should check if payload is empty', () => {
      expect(new SagaStepPayloadValueObject({}).isEmpty()).toBe(true);
      expect(new SagaStepPayloadValueObject({ key: 'value' }).isEmpty()).toBe(
        false,
      );
    });

    it('should get value by key', () => {
      const payload = new SagaStepPayloadValueObject({
        orderId: '12345',
        userId: '67890',
      });

      expect(payload.get('orderId')).toBe('12345');
      expect(payload.get('userId')).toBe('67890');
      expect(payload.get('nonexistent')).toBeUndefined();
    });

    it('should get value with default', () => {
      const payload = new SagaStepPayloadValueObject({ key: 'value' });

      expect(payload.getOrDefault('key', 'default')).toBe('value');
      expect(payload.getOrDefault('nonexistent', 'default')).toBe('default');
    });

    it('should get all keys', () => {
      const payload = new SagaStepPayloadValueObject({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });

      const keys = payload.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
      expect(keys.length).toBe(3);
    });

    it('should merge payload objects', () => {
      const payload1 = new SagaStepPayloadValueObject({ key1: 'value1' });
      const payload2 = new SagaStepPayloadValueObject({ key2: 'value2' });

      const merged = payload1.merge(payload2);
      expect(merged.value).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should pick specified keys', () => {
      const payload = new SagaStepPayloadValueObject({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });

      const picked = payload.pick(['key1', 'key3']);
      expect(picked.value).toEqual({ key1: 'value1', key3: 'value3' });
    });

    it('should omit specified keys', () => {
      const payload = new SagaStepPayloadValueObject({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });

      const omitted = payload.omit(['key2']);
      expect(omitted.value).toEqual({ key1: 'value1', key3: 'value3' });
    });
  });
});
