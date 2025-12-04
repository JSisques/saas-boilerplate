import { SagaStepResultValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-result/saga-step-result.vo';
import { InvalidJsonException } from '@/shared/domain/exceptions/value-objects/invalid-json/invalid-json.exception';

describe('SagaStepResultValueObject', () => {
  describe('constructor', () => {
    it('should create a saga step result value object with valid object', () => {
      const result = new SagaStepResultValueObject({ success: true });

      expect(result.value).toEqual({ success: true });
    });

    it('should create empty object when no value provided', () => {
      const result = new SagaStepResultValueObject();

      expect(result.value).toEqual({});
    });

    it('should create from JSON string', () => {
      const result = new SagaStepResultValueObject('{"success":true}');

      expect(result.value).toEqual({ success: true });
    });

    it('should create from complex JSON object', () => {
      const complexResult = {
        success: true,
        data: {
          orderId: '12345',
          transactionId: 'tx-67890',
        },
        metadata: {
          processingTime: 150,
          timestamp: '2024-01-01T10:00:00Z',
        },
      };
      const result = new SagaStepResultValueObject(complexResult);

      expect(result.value).toEqual(complexResult);
    });

    it('should allow empty object', () => {
      const result = new SagaStepResultValueObject({});

      expect(result.value).toEqual({});
    });

    it('should throw InvalidJsonException for invalid JSON string', () => {
      expect(() => new SagaStepResultValueObject('invalid json')).toThrow(
        InvalidJsonException,
      );
      expect(() => new SagaStepResultValueObject('{success: true}')).toThrow(
        InvalidJsonException,
      );
    });

    it('should throw InvalidJsonException for array', () => {
      expect(() => new SagaStepResultValueObject([1, 2, 3] as any)).toThrow(
        InvalidJsonException,
      );
    });

    it('should create empty object when null is provided', () => {
      const result = new SagaStepResultValueObject(null as any);

      expect(result.value).toEqual({});
    });

    it('should throw InvalidJsonException for primitive values', () => {
      expect(() => new SagaStepResultValueObject('string' as any)).toThrow(
        InvalidJsonException,
      );
      expect(() => new SagaStepResultValueObject(123 as any)).toThrow(
        InvalidJsonException,
      );
      expect(() => new SagaStepResultValueObject(true as any)).toThrow(
        InvalidJsonException,
      );
    });

    it('should handle nested objects', () => {
      const nestedResult = {
        response: {
          data: {
            result: {
              value: 'deep',
            },
          },
        },
      };
      const result = new SagaStepResultValueObject(nestedResult);

      expect(result.value).toEqual(nestedResult);
    });

    it('should handle arrays within objects', () => {
      const resultWithArray = {
        items: [1, 2, 3],
        errors: ['error1', 'error2'],
      };
      const result = new SagaStepResultValueObject(resultWithArray);

      expect(result.value).toEqual(resultWithArray);
    });

    it('should handle success results', () => {
      const successResult = {
        success: true,
        message: 'Operation completed successfully',
        data: { id: '123' },
      };
      const result = new SagaStepResultValueObject(successResult);

      expect(result.value).toEqual(successResult);
    });

    it('should handle error results', () => {
      const errorResult = {
        success: false,
        error: 'Operation failed',
        errorCode: 'ERR_001',
      };
      const result = new SagaStepResultValueObject(errorResult);

      expect(result.value).toEqual(errorResult);
    });
  });

  describe('equals', () => {
    it('should return true for equal results', () => {
      const result1 = new SagaStepResultValueObject({ success: true });
      const result2 = new SagaStepResultValueObject({ success: true });

      expect(result1.equals(result2)).toBe(true);
    });

    it('should return false for different results', () => {
      const result1 = new SagaStepResultValueObject({ success: true });
      const result2 = new SagaStepResultValueObject({ success: false });

      expect(result1.equals(result2)).toBe(false);
    });

    it('should return true for empty objects', () => {
      const result1 = new SagaStepResultValueObject({});
      const result2 = new SagaStepResultValueObject({});

      expect(result1.equals(result2)).toBe(true);
    });

    it('should return true when comparing object and JSON string with same content', () => {
      const result1 = new SagaStepResultValueObject({ success: true });
      const result2 = new SagaStepResultValueObject('{"success":true}');

      expect(result1.equals(result2)).toBe(true);
    });
  });

  describe('utility methods', () => {
    it('should check if result is empty', () => {
      expect(new SagaStepResultValueObject({}).isEmpty()).toBe(true);
      expect(new SagaStepResultValueObject({ success: true }).isEmpty()).toBe(
        false,
      );
    });

    it('should get value by key', () => {
      const result = new SagaStepResultValueObject({
        success: true,
        data: { id: '123' },
      });

      expect(result.get('success')).toBe(true);
      expect(result.get('data')).toEqual({ id: '123' });
      expect(result.get('nonexistent')).toBeUndefined();
    });

    it('should get value with default', () => {
      const result = new SagaStepResultValueObject({ success: true });

      expect(result.getOrDefault('success', false)).toBe(true);
      expect(result.getOrDefault('nonexistent', 'default')).toBe('default');
    });

    it('should get all keys', () => {
      const result = new SagaStepResultValueObject({
        success: true,
        data: {},
        message: 'Done',
      });

      const keys = result.keys();
      expect(keys).toContain('success');
      expect(keys).toContain('data');
      expect(keys).toContain('message');
      expect(keys.length).toBe(3);
    });

    it('should merge result objects', () => {
      const result1 = new SagaStepResultValueObject({ success: true });
      const result2 = new SagaStepResultValueObject({ data: { id: '123' } });

      const merged = result1.merge(result2);
      expect(merged.value).toEqual({ success: true, data: { id: '123' } });
    });

    it('should pick specified keys', () => {
      const result = new SagaStepResultValueObject({
        success: true,
        data: { id: '123' },
        message: 'Done',
      });

      const picked = result.pick(['success', 'message']);
      expect(picked.value).toEqual({ success: true, message: 'Done' });
    });

    it('should omit specified keys', () => {
      const result = new SagaStepResultValueObject({
        success: true,
        data: { id: '123' },
        message: 'Done',
      });

      const omitted = result.omit(['data']);
      expect(omitted.value).toEqual({ success: true, message: 'Done' });
    });
  });
});
