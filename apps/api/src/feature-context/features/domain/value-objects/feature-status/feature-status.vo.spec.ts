import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('FeatureStatusValueObject', () => {
  describe('constructor', () => {
    it('should create a FeatureStatusValueObject with valid ACTIVE status', () => {
      const status = new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE);
      expect(status.value).toBe(FeatureStatusEnum.ACTIVE);
    });

    it('should create a FeatureStatusValueObject with valid INACTIVE status', () => {
      const status = new FeatureStatusValueObject(FeatureStatusEnum.INACTIVE);
      expect(status.value).toBe(FeatureStatusEnum.INACTIVE);
    });

    it('should create a FeatureStatusValueObject with valid DEPRECATED status', () => {
      const status = new FeatureStatusValueObject(FeatureStatusEnum.DEPRECATED);
      expect(status.value).toBe(FeatureStatusEnum.DEPRECATED);
    });

    it('should throw InvalidEnumValueException for empty string', () => {
      expect(() => new FeatureStatusValueObject('' as any)).toThrow(
        InvalidEnumValueException,
      );
    });

    it('should throw InvalidEnumValueException for invalid enum value', () => {
      expect(() => new FeatureStatusValueObject('INVALID' as any)).toThrow(
        InvalidEnumValueException,
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal status values', () => {
      const status1 = new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE);
      const status2 = new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE);
      expect(status1.equals(status2)).toBe(true);
    });

    it('should return false for different status values', () => {
      const status1 = new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE);
      const status2 = new FeatureStatusValueObject(FeatureStatusEnum.INACTIVE);
      expect(status1.equals(status2)).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should check if value equals specific enum value', () => {
      const status = new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE);
      expect(status.is(FeatureStatusEnum.ACTIVE)).toBe(true);
      expect(status.is(FeatureStatusEnum.INACTIVE)).toBe(false);
    });

    it('should check if value is one of specified enum values', () => {
      const status = new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE);
      expect(
        status.isOneOf([FeatureStatusEnum.ACTIVE, FeatureStatusEnum.INACTIVE]),
      ).toBe(true);
      expect(
        status.isOneOf([
          FeatureStatusEnum.INACTIVE,
          FeatureStatusEnum.DEPRECATED,
        ]),
      ).toBe(false);
    });

    it('should get enum key', () => {
      const status = new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE);
      expect(status.getKey()).toBe('ACTIVE');
    });

    it('should get all enum values', () => {
      const status = new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE);
      const values = status.getAllValues();
      expect(values).toContain(FeatureStatusEnum.ACTIVE);
      expect(values).toContain(FeatureStatusEnum.INACTIVE);
      expect(values).toContain(FeatureStatusEnum.DEPRECATED);
    });

    it('should check if value is valid', () => {
      const status = new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE);
      expect(status.isValidValue(FeatureStatusEnum.ACTIVE)).toBe(true);
      expect(status.isValidValue('INVALID' as any)).toBe(false);
    });
  });
});
