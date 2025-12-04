import { SagaStepErrorMessageValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-error-message/saga-step-error-message.vo';

describe('SagaStepErrorMessageValueObject', () => {
  describe('constructor', () => {
    it('should create a saga step error message value object with a valid string', () => {
      const errorMessage = new SagaStepErrorMessageValueObject(
        'Payment processing failed',
      );

      expect(errorMessage.value).toBe('Payment processing failed');
    });

    it('should allow empty string', () => {
      const errorMessage = new SagaStepErrorMessageValueObject('');

      expect(errorMessage.value).toBe('');
    });

    it('should trim whitespace by default', () => {
      const errorMessage = new SagaStepErrorMessageValueObject(
        '  Payment processing failed  ',
      );

      expect(errorMessage.value).toBe('Payment processing failed');
    });

    it('should accept various error message formats', () => {
      const errorMessages = [
        'Error: Payment failed',
        'Timeout after 30 seconds',
        'Database connection error',
        'Validation failed: Invalid input',
        'Network error: Connection refused',
      ];

      errorMessages.forEach((message) => {
        expect(
          () => new SagaStepErrorMessageValueObject(message),
        ).not.toThrow();
        expect(new SagaStepErrorMessageValueObject(message).value).toBe(
          message.trim(),
        );
      });
    });

    it('should handle long error messages', () => {
      const longMessage =
        'This is a very long error message that describes in detail what went wrong during the saga step execution. It may contain multiple sentences and detailed information about the failure.';
      const errorMessage = new SagaStepErrorMessageValueObject(longMessage);

      expect(errorMessage.value).toBe(longMessage.trim());
    });

    it('should handle special characters in error messages', () => {
      const specialChars = 'Error: Payment failed (code: 500) - Retry?';
      const errorMessage = new SagaStepErrorMessageValueObject(specialChars);

      expect(errorMessage.value).toBe(specialChars.trim());
    });

    it('should handle error messages with newlines', () => {
      const multilineMessage = 'Error occurred:\nLine 1\nLine 2';
      const errorMessage = new SagaStepErrorMessageValueObject(
        multilineMessage,
      );

      expect(errorMessage.value).toBe(multilineMessage.trim());
    });
  });

  describe('equals', () => {
    it('should return true for equal error messages', () => {
      const errorMessage1 = new SagaStepErrorMessageValueObject(
        'Payment processing failed',
      );
      const errorMessage2 = new SagaStepErrorMessageValueObject(
        'Payment processing failed',
      );

      expect(errorMessage1.equals(errorMessage2)).toBe(true);
    });

    it('should return false for different error messages', () => {
      const errorMessage1 = new SagaStepErrorMessageValueObject(
        'Payment processing failed',
      );
      const errorMessage2 = new SagaStepErrorMessageValueObject(
        'Order processing failed',
      );

      expect(errorMessage1.equals(errorMessage2)).toBe(false);
    });

    it('should return true for empty strings', () => {
      const errorMessage1 = new SagaStepErrorMessageValueObject('');
      const errorMessage2 = new SagaStepErrorMessageValueObject('');

      expect(errorMessage1.equals(errorMessage2)).toBe(true);
    });
  });

  describe('utility methods', () => {
    it('should check if error message is empty', () => {
      expect(new SagaStepErrorMessageValueObject('').isEmpty()).toBe(true);
      expect(
        new SagaStepErrorMessageValueObject('Error occurred').isEmpty(),
      ).toBe(false);
    });

    it('should check if error message is not empty', () => {
      expect(
        new SagaStepErrorMessageValueObject('Error occurred').isNotEmpty(),
      ).toBe(true);
      expect(new SagaStepErrorMessageValueObject('').isNotEmpty()).toBe(false);
    });

    it('should return error message length', () => {
      const errorMessage = new SagaStepErrorMessageValueObject(
        'Payment failed',
      );

      expect(errorMessage.length()).toBe(14);
    });

    it('should check if error message contains substring', () => {
      const errorMessage = new SagaStepErrorMessageValueObject(
        'Payment processing failed',
      );

      expect(errorMessage.contains('Payment')).toBe(true);
      expect(errorMessage.contains('failed')).toBe(true);
      expect(errorMessage.contains('Order')).toBe(false);
    });

    it('should check if error message starts with prefix', () => {
      const errorMessage = new SagaStepErrorMessageValueObject(
        'Payment processing failed',
      );

      expect(errorMessage.startsWith('Payment')).toBe(true);
      expect(errorMessage.startsWith('failed')).toBe(false);
    });

    it('should check if error message ends with suffix', () => {
      const errorMessage = new SagaStepErrorMessageValueObject(
        'Payment processing failed',
      );

      expect(errorMessage.endsWith('failed')).toBe(true);
      expect(errorMessage.endsWith('Payment')).toBe(false);
    });
  });
});
