import { SagaStepNameValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-name/saga-step-name.vo';

describe('SagaStepNameValueObject', () => {
  describe('constructor', () => {
    it('should create a saga step name value object with a valid string', () => {
      const name = new SagaStepNameValueObject('Process Payment');

      expect(name.value).toBe('Process Payment');
    });

    it('should trim whitespace by default', () => {
      const name = new SagaStepNameValueObject('  Process Payment  ');

      expect(name.value).toBe('Process Payment');
    });

    it('should allow empty string by default', () => {
      const name = new SagaStepNameValueObject('');

      expect(name.value).toBe('');
    });

    it('should allow whitespace-only string (trimmed to empty)', () => {
      const name = new SagaStepNameValueObject('   ');

      expect(name.value).toBe('');
    });

    it('should accept valid step names', () => {
      const validNames = [
        'Step 1',
        'Process Order',
        'Send Email Notification',
        'Validate Payment',
        'Update Inventory',
        'A', // Minimum length
      ];

      validNames.forEach((name) => {
        expect(() => new SagaStepNameValueObject(name)).not.toThrow();
      });
    });

    it('should handle special characters in names', () => {
      const name = new SagaStepNameValueObject('Step-1_Process');

      expect(name.value).toBe('Step-1_Process');
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const name1 = new SagaStepNameValueObject('Process Payment');
      const name2 = new SagaStepNameValueObject('Process Payment');

      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different names', () => {
      const name1 = new SagaStepNameValueObject('Process Payment');
      const name2 = new SagaStepNameValueObject('Process Order');

      expect(name1.equals(name2)).toBe(false);
    });

    it('should be case-sensitive', () => {
      const name1 = new SagaStepNameValueObject('Process Payment');
      const name2 = new SagaStepNameValueObject('process payment');

      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should check if name is empty', () => {
      const name = new SagaStepNameValueObject('Process Payment');

      expect(name.isEmpty()).toBe(false);
    });

    it('should check if name is not empty', () => {
      const name = new SagaStepNameValueObject('Process Payment');

      expect(name.isNotEmpty()).toBe(true);
    });

    it('should return name length', () => {
      const name = new SagaStepNameValueObject('Process Payment');

      expect(name.length()).toBe(15);
    });

    it('should check if name contains substring', () => {
      const name = new SagaStepNameValueObject('Process Payment');

      expect(name.contains('Payment')).toBe(true);
      expect(name.contains('Order')).toBe(false);
    });

    it('should check if name starts with prefix', () => {
      const name = new SagaStepNameValueObject('Process Payment');

      expect(name.startsWith('Process')).toBe(true);
      expect(name.startsWith('Payment')).toBe(false);
    });

    it('should check if name ends with suffix', () => {
      const name = new SagaStepNameValueObject('Process Payment');

      expect(name.endsWith('Payment')).toBe(true);
      expect(name.endsWith('Process')).toBe(false);
    });
  });
});
