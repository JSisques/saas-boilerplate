import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';
import { InvalidStringException } from '@/shared/domain/exceptions/value-objects/invalid-string/invalid-string.exception';

describe('StringValueObject', () => {
  describe('constructor', () => {
    it('should create a string value object with a valid string', () => {
      const str = new StringValueObject('test');

      expect(str.value).toBe('test');
    });

    it('should trim whitespace by default', () => {
      const str = new StringValueObject('  test  ');

      expect(str.value).toBe('test');
    });

    it('should not trim when trim option is false', () => {
      const str = new StringValueObject('  test  ', { trim: false });

      expect(str.value).toBe('  test  ');
    });

    it('should throw InvalidStringException when string is empty and allowEmpty is false', () => {
      expect(() => new StringValueObject('', { allowEmpty: false })).toThrow(
        InvalidStringException,
      );
    });

    it('should throw InvalidStringException when string is below minLength', () => {
      expect(() => new StringValueObject('ab', { minLength: 5 })).toThrow(
        InvalidStringException,
      );
    });

    it('should throw InvalidStringException when string exceeds maxLength', () => {
      expect(() => new StringValueObject('abcdef', { maxLength: 5 })).toThrow(
        InvalidStringException,
      );
    });

    it('should throw InvalidStringException when string does not match pattern', () => {
      expect(() =>
        new StringValueObject('test', { pattern: /^[0-9]+$/ }),
      ).toThrow(InvalidStringException);
    });
  });

  describe('equals', () => {
    it('should return true for equal strings', () => {
      const str1 = new StringValueObject('test');
      const str2 = new StringValueObject('test');

      expect(str1.equals(str2)).toBe(true);
    });

    it('should return false for different strings', () => {
      const str1 = new StringValueObject('test1');
      const str2 = new StringValueObject('test2');

      expect(str1.equals(str2)).toBe(false);
    });

    it('should be case-insensitive when caseSensitive is false', () => {
      const str1 = new StringValueObject('TEST', { caseSensitive: false });
      const str2 = new StringValueObject('test', { caseSensitive: false });

      expect(str1.equals(str2)).toBe(true);
    });
  });

  describe('utility methods', () => {
    it('should check if string is empty', () => {
      expect(new StringValueObject('').isEmpty()).toBe(true);
      expect(new StringValueObject('test').isEmpty()).toBe(false);
    });

    it('should check if string is not empty', () => {
      expect(new StringValueObject('test').isNotEmpty()).toBe(true);
      expect(new StringValueObject('').isNotEmpty()).toBe(false);
    });

    it('should return string length', () => {
      expect(new StringValueObject('test').length()).toBe(4);
    });

    it('should check if string contains substring', () => {
      const str = new StringValueObject('hello world');

      expect(str.contains('world')).toBe(true);
      expect(str.contains('xyz')).toBe(false);
    });

    it('should check if string starts with prefix', () => {
      const str = new StringValueObject('hello world');

      expect(str.startsWith('hello')).toBe(true);
      expect(str.startsWith('world')).toBe(false);
    });

    it('should check if string ends with suffix', () => {
      const str = new StringValueObject('hello world');

      expect(str.endsWith('world')).toBe(true);
      expect(str.endsWith('hello')).toBe(false);
    });

    it('should convert to lowercase', () => {
      const str = new StringValueObject('TEST');
      const lower = str.toLowerCase();

      expect(lower.value).toBe('test');
    });

    it('should convert to uppercase', () => {
      const str = new StringValueObject('test');
      const upper = str.toUpperCase();

      expect(upper.value).toBe('TEST');
    });

    it('should capitalize first letter', () => {
      const str = new StringValueObject('test');
      const capitalized = str.capitalize();

      expect(capitalized.value).toBe('Test');
    });

    it('should replace substring', () => {
      const str = new StringValueObject('hello world');
      const replaced = str.replace('world', 'universe');

      expect(replaced.value).toBe('hello universe');
    });

    it('should split string', () => {
      const str = new StringValueObject('a,b,c');
      const parts = str.split(',');

      expect(parts).toHaveLength(3);
      expect(parts[0].value).toBe('a');
    });

    it('should check if matches pattern', () => {
      const str = new StringValueObject('123');

      expect(str.matches(/^[0-9]+$/)).toBe(true);
      expect(str.matches(/^[a-z]+$/)).toBe(false);
    });

    it('should check if string is email format', () => {
      expect(new StringValueObject('test@example.com').isEmail()).toBe(true);
      expect(new StringValueObject('invalid').isEmail()).toBe(false);
    });

    it('should check if string is URL format', () => {
      expect(new StringValueObject('https://example.com').isUrl()).toBe(true);
      expect(new StringValueObject('invalid').isUrl()).toBe(false);
    });

    it('should check if string is numeric', () => {
      expect(new StringValueObject('123').isNumeric()).toBe(true);
      expect(new StringValueObject('abc').isNumeric()).toBe(false);
    });

    it('should check if string is alphanumeric', () => {
      expect(new StringValueObject('abc123').isAlphanumeric()).toBe(true);
      expect(new StringValueObject('abc-123').isAlphanumeric()).toBe(false);
    });

    it('should check if string is alphabetic', () => {
      expect(new StringValueObject('abc').isAlphabetic()).toBe(true);
      expect(new StringValueObject('abc123').isAlphabetic()).toBe(false);
    });
  });
});

