import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('SagaLogTypeValueObject', () => {
  describe('constructor', () => {
    it('should create a saga log type value object with INFO', () => {
      const type = new SagaLogTypeValueObject(SagaLogTypeEnum.INFO);

      expect(type.value).toBe(SagaLogTypeEnum.INFO);
    });

    it('should create a saga log type value object with WARNING', () => {
      const type = new SagaLogTypeValueObject(SagaLogTypeEnum.WARNING);

      expect(type.value).toBe(SagaLogTypeEnum.WARNING);
    });

    it('should create a saga log type value object with ERROR', () => {
      const type = new SagaLogTypeValueObject(SagaLogTypeEnum.ERROR);

      expect(type.value).toBe(SagaLogTypeEnum.ERROR);
    });

    it('should create a saga log type value object with DEBUG', () => {
      const type = new SagaLogTypeValueObject(SagaLogTypeEnum.DEBUG);

      expect(type.value).toBe(SagaLogTypeEnum.DEBUG);
    });

    it('should throw InvalidEnumValueException for invalid type', () => {
      expect(() => new SagaLogTypeValueObject('INVALID' as any)).toThrow(
        InvalidEnumValueException,
      );
    });

    it('should throw InvalidEnumValueException for empty string', () => {
      expect(() => new SagaLogTypeValueObject('' as any)).toThrow(
        InvalidEnumValueException,
      );
    });

    it('should throw InvalidEnumValueException for whitespace only', () => {
      expect(() => new SagaLogTypeValueObject('   ' as any)).toThrow(
        InvalidEnumValueException,
      );
    });

    it('should throw InvalidEnumValueException for null', () => {
      expect(() => new SagaLogTypeValueObject(null as any)).toThrow(
        InvalidEnumValueException,
      );
    });

    it('should throw InvalidEnumValueException for undefined', () => {
      expect(() => new SagaLogTypeValueObject(undefined as any)).toThrow(
        InvalidEnumValueException,
      );
    });

    it('should accept all valid enum values', () => {
      const validTypes = Object.values(SagaLogTypeEnum);

      validTypes.forEach((typeValue) => {
        expect(() => new SagaLogTypeValueObject(typeValue)).not.toThrow();
        expect(new SagaLogTypeValueObject(typeValue).value).toBe(typeValue);
      });
    });
  });

  describe('equals', () => {
    it('should return true for equal types', () => {
      const type1 = new SagaLogTypeValueObject(SagaLogTypeEnum.INFO);
      const type2 = new SagaLogTypeValueObject(SagaLogTypeEnum.INFO);

      expect(type1.equals(type2)).toBe(true);
    });

    it('should return false for different types', () => {
      const type1 = new SagaLogTypeValueObject(SagaLogTypeEnum.INFO);
      const type2 = new SagaLogTypeValueObject(SagaLogTypeEnum.ERROR);

      expect(type1.equals(type2)).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should check if value equals specific type', () => {
      const type = new SagaLogTypeValueObject(SagaLogTypeEnum.INFO);

      expect(type.is(SagaLogTypeEnum.INFO)).toBe(true);
      expect(type.is(SagaLogTypeEnum.ERROR)).toBe(false);
    });

    it('should check if value is one of specified types', () => {
      const type = new SagaLogTypeValueObject(SagaLogTypeEnum.INFO);

      expect(
        type.isOneOf([SagaLogTypeEnum.INFO, SagaLogTypeEnum.WARNING]),
      ).toBe(true);
      expect(type.isOneOf([SagaLogTypeEnum.ERROR, SagaLogTypeEnum.DEBUG])).toBe(
        false,
      );
    });

    it('should get enum key', () => {
      const type = new SagaLogTypeValueObject(SagaLogTypeEnum.INFO);

      expect(type.getKey()).toBe('INFO');
    });

    it('should get all enum values', () => {
      const type = new SagaLogTypeValueObject(SagaLogTypeEnum.INFO);

      const values = type.getAllValues();
      expect(values).toContain(SagaLogTypeEnum.INFO);
      expect(values).toContain(SagaLogTypeEnum.WARNING);
      expect(values).toContain(SagaLogTypeEnum.ERROR);
      expect(values).toContain(SagaLogTypeEnum.DEBUG);
    });

    it('should check if value is valid', () => {
      const type = new SagaLogTypeValueObject(SagaLogTypeEnum.INFO);

      expect(type.isValidValue(SagaLogTypeEnum.INFO)).toBe(true);
      expect(type.isValidValue('INVALID')).toBe(false);
    });
  });
});
