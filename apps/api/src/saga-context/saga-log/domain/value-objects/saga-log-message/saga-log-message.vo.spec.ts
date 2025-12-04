import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { InvalidStringException } from '@/shared/domain/exceptions/value-objects/invalid-string/invalid-string.exception';

describe('SagaLogMessageValueObject', () => {
  describe('constructor', () => {
    it('should create a saga log message value object with valid message', () => {
      const message = new SagaLogMessageValueObject('Test message');

      expect(message.value).toBe('Test message');
    });

    it('should create a saga log message value object with long message', () => {
      const longMessage = 'A'.repeat(1000);
      const message = new SagaLogMessageValueObject(longMessage);

      expect(message.value).toBe(longMessage);
    });

    it('should throw InvalidStringException for empty string', () => {
      expect(() => new SagaLogMessageValueObject('')).toThrow(
        InvalidStringException,
      );
    });

    it('should throw InvalidStringException for whitespace only', () => {
      expect(() => new SagaLogMessageValueObject('   ')).toThrow(
        InvalidStringException,
      );
    });

    it('should throw InvalidStringException for null', () => {
      expect(() => new SagaLogMessageValueObject(null as any)).toThrow(
        InvalidStringException,
      );
    });

    it('should throw InvalidStringException for undefined', () => {
      expect(() => new SagaLogMessageValueObject(undefined as any)).toThrow(
        InvalidStringException,
      );
    });
  });

  describe('equals', () => {
    it('should return true for equal messages', () => {
      const message1 = new SagaLogMessageValueObject('Test message');
      const message2 = new SagaLogMessageValueObject('Test message');

      expect(message1.equals(message2)).toBe(true);
    });

    it('should return false for different messages', () => {
      const message1 = new SagaLogMessageValueObject('Test message 1');
      const message2 = new SagaLogMessageValueObject('Test message 2');

      expect(message1.equals(message2)).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should check if message is empty', () => {
      const message = new SagaLogMessageValueObject('Test message');

      expect(message.isEmpty()).toBe(false);
    });

    it('should get message length', () => {
      const message = new SagaLogMessageValueObject('Test message');

      expect(message.length()).toBe(12);
    });

    it('should check if message contains substring', () => {
      const message = new SagaLogMessageValueObject('Test message');

      expect(message.contains('Test')).toBe(true);
      expect(message.contains('Invalid')).toBe(false);
    });

    it('should check if message starts with prefix', () => {
      const message = new SagaLogMessageValueObject('Test message');

      expect(message.startsWith('Test')).toBe(true);
      expect(message.startsWith('Invalid')).toBe(false);
    });

    it('should check if message ends with suffix', () => {
      const message = new SagaLogMessageValueObject('Test message');

      expect(message.endsWith('message')).toBe(true);
      expect(message.endsWith('Invalid')).toBe(false);
    });
  });
});
