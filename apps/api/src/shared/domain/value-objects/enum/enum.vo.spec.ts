import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

// Test enum for testing EnumValueObject
enum TestEnum {
  VALUE1 = 'value1',
  VALUE2 = 'value2',
  VALUE3 = 'value3',
}

class TestEnumValueObject extends EnumValueObject<typeof TestEnum> {
  protected get enumObject(): typeof TestEnum {
    return TestEnum;
  }
}

describe('EnumValueObject', () => {
  describe('constructor', () => {
    it('should create an enum value object with valid enum value', () => {
      const enumVO = new TestEnumValueObject('value1');

      expect(enumVO.value).toBe('value1');
    });

    it('should throw InvalidEnumValueException for empty string', () => {
      expect(() => new TestEnumValueObject('')).toThrow(
        InvalidEnumValueException,
      );
    });

    it('should throw InvalidEnumValueException for invalid enum value', () => {
      expect(() => new TestEnumValueObject('invalid')).toThrow(
        InvalidEnumValueException,
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal enum values', () => {
      const enum1 = new TestEnumValueObject('value1');
      const enum2 = new TestEnumValueObject('value1');

      expect(enum1.equals(enum2)).toBe(true);
    });

    it('should return false for different enum values', () => {
      const enum1 = new TestEnumValueObject('value1');
      const enum2 = new TestEnumValueObject('value2');

      expect(enum1.equals(enum2)).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should check if value equals specific enum value', () => {
      const enumVO = new TestEnumValueObject('value1');

      expect(enumVO.is('value1')).toBe(true);
      expect(enumVO.is('value2')).toBe(false);
    });

    it('should check if value is one of specified enum values', () => {
      const enumVO = new TestEnumValueObject('value1');

      expect(enumVO.isOneOf(['value1', 'value2'])).toBe(true);
      expect(enumVO.isOneOf(['value2', 'value3'])).toBe(false);
    });

    it('should get enum key', () => {
      const enumVO = new TestEnumValueObject('value1');

      expect(enumVO.getKey()).toBe('VALUE1');
    });

    it('should get all enum values', () => {
      const enumVO = new TestEnumValueObject('value1');

      const values = enumVO.getAllValues();
      expect(values).toContain('value1');
      expect(values).toContain('value2');
      expect(values).toContain('value3');
    });

    it('should check if value is valid', () => {
      const enumVO = new TestEnumValueObject('value1');

      expect(enumVO.isValidValue('value1')).toBe(true);
      expect(enumVO.isValidValue('invalid')).toBe(false);
    });
  });
});

