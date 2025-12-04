import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';

describe('SagaInstanceNameValueObject', () => {
  describe('constructor', () => {
    it('should create a valid saga instance name value object', () => {
      const name = 'Order Processing Saga';
      const valueObject = new SagaInstanceNameValueObject(name);

      expect(valueObject.value).toBe(name);
    });

    it('should create a saga instance name with special characters', () => {
      const name = 'Order-Processing_Saga_v1';
      const valueObject = new SagaInstanceNameValueObject(name);

      expect(valueObject.value).toBe(name);
    });

    it('should create a saga instance name with numbers', () => {
      const name = 'Saga123';
      const valueObject = new SagaInstanceNameValueObject(name);

      expect(valueObject.value).toBe(name);
    });

    it('should create a saga instance name with spaces', () => {
      const name = 'Order Processing Saga Instance';
      const valueObject = new SagaInstanceNameValueObject(name);

      expect(valueObject.value).toBe(name);
    });
  });

  describe('equals', () => {
    it('should return true when comparing two equal saga instance names', () => {
      const name = 'Order Processing Saga';
      const valueObject1 = new SagaInstanceNameValueObject(name);
      const valueObject2 = new SagaInstanceNameValueObject(name);

      expect(valueObject1.equals(valueObject2)).toBe(true);
    });

    it('should return false when comparing two different saga instance names', () => {
      const valueObject1 = new SagaInstanceNameValueObject(
        'Order Processing Saga',
      );
      const valueObject2 = new SagaInstanceNameValueObject(
        'Payment Processing Saga',
      );

      expect(valueObject1.equals(valueObject2)).toBe(false);
    });

    it('should return false when comparing with different type', () => {
      const valueObject1 = new SagaInstanceNameValueObject(
        'Order Processing Saga',
      );
      const valueObject2 = new SagaInstanceNameValueObject(
        'Payment Processing Saga',
      );

      expect(valueObject1.equals(valueObject2)).toBe(false);
    });
  });
});
