import { SagaStepStatusValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-status/saga-step-status.vo';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('SagaStepStatusValueObject', () => {
  describe('constructor', () => {
    it('should create a saga step status value object with PENDING', () => {
      const status = new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING);

      expect(status.value).toBe(SagaStepStatusEnum.PENDING);
    });

    it('should create a saga step status value object with STARTED', () => {
      const status = new SagaStepStatusValueObject(SagaStepStatusEnum.STARTED);

      expect(status.value).toBe(SagaStepStatusEnum.STARTED);
    });

    it('should create a saga step status value object with RUNNING', () => {
      const status = new SagaStepStatusValueObject(SagaStepStatusEnum.RUNNING);

      expect(status.value).toBe(SagaStepStatusEnum.RUNNING);
    });

    it('should create a saga step status value object with COMPLETED', () => {
      const status = new SagaStepStatusValueObject(
        SagaStepStatusEnum.COMPLETED,
      );

      expect(status.value).toBe(SagaStepStatusEnum.COMPLETED);
    });

    it('should create a saga step status value object with FAILED', () => {
      const status = new SagaStepStatusValueObject(SagaStepStatusEnum.FAILED);

      expect(status.value).toBe(SagaStepStatusEnum.FAILED);
    });

    it('should throw InvalidEnumValueException for invalid status', () => {
      expect(() => new SagaStepStatusValueObject('INVALID' as any)).toThrow(
        InvalidEnumValueException,
      );
    });

    it('should throw InvalidEnumValueException for empty string', () => {
      expect(() => new SagaStepStatusValueObject('' as any)).toThrow(
        InvalidEnumValueException,
      );
    });

    it('should throw InvalidEnumValueException for whitespace only', () => {
      expect(() => new SagaStepStatusValueObject('   ' as any)).toThrow(
        InvalidEnumValueException,
      );
    });

    it('should throw InvalidEnumValueException for null', () => {
      expect(() => new SagaStepStatusValueObject(null as any)).toThrow(
        InvalidEnumValueException,
      );
    });

    it('should throw InvalidEnumValueException for undefined', () => {
      expect(() => new SagaStepStatusValueObject(undefined as any)).toThrow(
        InvalidEnumValueException,
      );
    });

    it('should accept all valid enum values', () => {
      const validStatuses = Object.values(SagaStepStatusEnum);

      validStatuses.forEach((statusValue) => {
        expect(() => new SagaStepStatusValueObject(statusValue)).not.toThrow();
        expect(new SagaStepStatusValueObject(statusValue).value).toBe(
          statusValue,
        );
      });
    });
  });

  describe('equals', () => {
    it('should return true for equal statuses', () => {
      const status1 = new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING);
      const status2 = new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING);

      expect(status1.equals(status2)).toBe(true);
    });

    it('should return false for different statuses', () => {
      const status1 = new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING);
      const status2 = new SagaStepStatusValueObject(SagaStepStatusEnum.STARTED);

      expect(status1.equals(status2)).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should check if value equals specific status', () => {
      const status = new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING);

      expect(status.is(SagaStepStatusEnum.PENDING)).toBe(true);
      expect(status.is(SagaStepStatusEnum.STARTED)).toBe(false);
    });

    it('should check if value is one of specified statuses', () => {
      const status = new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING);

      expect(
        status.isOneOf([
          SagaStepStatusEnum.PENDING,
          SagaStepStatusEnum.STARTED,
        ]),
      ).toBe(true);
      expect(
        status.isOneOf([
          SagaStepStatusEnum.STARTED,
          SagaStepStatusEnum.RUNNING,
        ]),
      ).toBe(false);
    });

    it('should get enum key', () => {
      const status = new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING);

      expect(status.getKey()).toBe('PENDING');
    });

    it('should get all enum values', () => {
      const status = new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING);

      const values = status.getAllValues();
      expect(values).toContain(SagaStepStatusEnum.PENDING);
      expect(values).toContain(SagaStepStatusEnum.STARTED);
      expect(values).toContain(SagaStepStatusEnum.RUNNING);
      expect(values).toContain(SagaStepStatusEnum.COMPLETED);
      expect(values).toContain(SagaStepStatusEnum.FAILED);
    });

    it('should check if value is valid', () => {
      const status = new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING);

      expect(status.isValidValue(SagaStepStatusEnum.PENDING)).toBe(true);
      expect(status.isValidValue('INVALID')).toBe(false);
    });
  });
});
