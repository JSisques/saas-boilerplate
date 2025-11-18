import { HexValueObject } from '@/shared/domain/value-objects/hex/hex.vo';
import { InvalidHexException } from '@/shared/domain/exceptions/value-objects/invalid-hex/invalid-hex.exception';

describe('HexValueObject', () => {
  describe('constructor', () => {
    it('should create a hex value object with valid hex string', () => {
      const hex = new HexValueObject('ff00ff');

      expect(hex.value).toBe('ff00ff');
    });

    it('should normalize hex to lowercase', () => {
      const hex = new HexValueObject('FF00FF');

      expect(hex.value).toBe('ff00ff');
    });

    it('should throw InvalidHexException for empty string', () => {
      expect(() => new HexValueObject('')).toThrow(InvalidHexException);
    });

    it('should throw InvalidHexException for invalid hex characters', () => {
      expect(() => new HexValueObject('gg00ff')).toThrow(InvalidHexException);
      expect(() => new HexValueObject('xyz')).toThrow(InvalidHexException);
    });
  });

  describe('equals', () => {
    it('should return true for equal hex values', () => {
      const hex1 = new HexValueObject('ff00ff');
      const hex2 = new HexValueObject('ff00ff');

      expect(hex1.equals(hex2)).toBe(true);
    });

    it('should return false for different hex values', () => {
      const hex1 = new HexValueObject('ff00ff');
      const hex2 = new HexValueObject('00ff00');

      expect(hex1.equals(hex2)).toBe(false);
    });
  });

  describe('conversion methods', () => {
    it('should convert hex to number', () => {
      const hex = new HexValueObject('ff');

      expect(hex.toNumber()).toBe(255);
    });

    it('should convert hex to buffer', () => {
      const hex = new HexValueObject('ff00ff');

      const buffer = hex.toBuffer();
      expect(buffer).toBeInstanceOf(Buffer);
    });
  });
});
