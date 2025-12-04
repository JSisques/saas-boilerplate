import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('SagaInstanceStatusValueObject', () => {
  describe('constructor', () => {
    it('should create a valid saga instance status value object with PENDING', () => {
      const valueObject = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.PENDING,
      );

      expect(valueObject.value).toBe(SagaInstanceStatusEnum.PENDING);
    });

    it('should create a valid saga instance status value object with STARTED', () => {
      const valueObject = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.STARTED,
      );

      expect(valueObject.value).toBe(SagaInstanceStatusEnum.STARTED);
    });

    it('should create a valid saga instance status value object with RUNNING', () => {
      const valueObject = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.RUNNING,
      );

      expect(valueObject.value).toBe(SagaInstanceStatusEnum.RUNNING);
    });

    it('should create a valid saga instance status value object with COMPLETED', () => {
      const valueObject = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.COMPLETED,
      );

      expect(valueObject.value).toBe(SagaInstanceStatusEnum.COMPLETED);
    });

    it('should create a valid saga instance status value object with FAILED', () => {
      const valueObject = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.FAILED,
      );

      expect(valueObject.value).toBe(SagaInstanceStatusEnum.FAILED);
    });

    it('should create a valid saga instance status value object with COMPENSATING', () => {
      const valueObject = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.COMPENSATING,
      );

      expect(valueObject.value).toBe(SagaInstanceStatusEnum.COMPENSATING);
    });

    it('should create a valid saga instance status value object with COMPENSATED', () => {
      const valueObject = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.COMPENSATED,
      );

      expect(valueObject.value).toBe(SagaInstanceStatusEnum.COMPENSATED);
    });

    it('should throw InvalidEnumValueException for invalid status', () => {
      expect(() => {
        new SagaInstanceStatusValueObject('INVALID_STATUS' as any);
      }).toThrow(InvalidEnumValueException);
    });
  });

  describe('equals', () => {
    it('should return true when comparing two equal saga instance statuses', () => {
      const valueObject1 = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.PENDING,
      );
      const valueObject2 = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.PENDING,
      );

      expect(valueObject1.equals(valueObject2)).toBe(true);
    });

    it('should return false when comparing two different saga instance statuses', () => {
      const valueObject1 = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.PENDING,
      );
      const valueObject2 = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.COMPLETED,
      );

      expect(valueObject1.equals(valueObject2)).toBe(false);
    });

    it('should return false when comparing with different status', () => {
      const valueObject1 = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.PENDING,
      );
      const valueObject2 = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.COMPLETED,
      );

      expect(valueObject1.equals(valueObject2)).toBe(false);
    });
  });
});
