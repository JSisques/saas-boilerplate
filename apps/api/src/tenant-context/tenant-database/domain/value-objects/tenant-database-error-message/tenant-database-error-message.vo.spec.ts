import { TenantDatabaseErrorMessageValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-error-message/tenant-database-error-message.vo';

describe('TenantDatabaseErrorMessageValueObject', () => {
  describe('constructor', () => {
    it('should create a valid TenantDatabaseErrorMessageValueObject with a valid error message', () => {
      const errorMessage = new TenantDatabaseErrorMessageValueObject(
        'Connection failed',
      );
      expect(errorMessage.value).toBe('Connection failed');
    });

    it('should trim whitespace from the error message', () => {
      const errorMessage = new TenantDatabaseErrorMessageValueObject(
        '  Connection failed  ',
      );
      expect(errorMessage.value).toBe('Connection failed');
    });

    it('should create a TenantDatabaseErrorMessageValueObject with empty string (default behavior)', () => {
      const errorMessage = new TenantDatabaseErrorMessageValueObject('');
      expect(errorMessage.value).toBe('');
    });

    it('should create a TenantDatabaseErrorMessageValueObject with only whitespace (trims to empty)', () => {
      const errorMessage = new TenantDatabaseErrorMessageValueObject('   ');
      expect(errorMessage.value).toBe('');
    });

    it('should create a TenantDatabaseErrorMessageValueObject with null value (converts to empty string)', () => {
      const errorMessage = new TenantDatabaseErrorMessageValueObject(
        null as any,
      );
      expect(errorMessage.value).toBe('');
    });

    it('should create a TenantDatabaseErrorMessageValueObject with undefined value (converts to empty string)', () => {
      const errorMessage = new TenantDatabaseErrorMessageValueObject(
        undefined as any,
      );
      expect(errorMessage.value).toBe('');
    });

    it('should handle long error messages', () => {
      const longMessage =
        'This is a very long error message that describes in detail what went wrong during the database migration process';
      const errorMessage = new TenantDatabaseErrorMessageValueObject(
        longMessage,
      );
      expect(errorMessage.value).toBe(longMessage);
    });

    it('should handle error messages with special characters', () => {
      const messageWithSpecialChars =
        'Error: Connection timeout (30s) - Retry failed!';
      const errorMessage = new TenantDatabaseErrorMessageValueObject(
        messageWithSpecialChars,
      );
      expect(errorMessage.value).toBe(messageWithSpecialChars);
    });

    it('should handle multi-line error messages', () => {
      const multiLineMessage =
        'Error occurred:\nLine 1: Connection failed\nLine 2: Timeout exceeded';
      const errorMessage = new TenantDatabaseErrorMessageValueObject(
        multiLineMessage,
      );
      expect(errorMessage.value).toBe(multiLineMessage);
    });
  });

  describe('equals', () => {
    it('should return true for equal error messages', () => {
      const errorMessage1 = new TenantDatabaseErrorMessageValueObject(
        'Connection failed',
      );
      const errorMessage2 = new TenantDatabaseErrorMessageValueObject(
        'Connection failed',
      );
      expect(errorMessage1.equals(errorMessage2)).toBe(true);
    });

    it('should return false for different error messages', () => {
      const errorMessage1 = new TenantDatabaseErrorMessageValueObject(
        'Connection failed',
      );
      const errorMessage2 = new TenantDatabaseErrorMessageValueObject(
        'Migration failed',
      );
      expect(errorMessage1.equals(errorMessage2)).toBe(false);
    });

    it('should return true for error messages with different whitespace (after trim)', () => {
      const errorMessage1 = new TenantDatabaseErrorMessageValueObject(
        'Connection failed',
      );
      const errorMessage2 = new TenantDatabaseErrorMessageValueObject(
        '  Connection failed  ',
      );
      expect(errorMessage1.equals(errorMessage2)).toBe(true);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return correct length', () => {
      const errorMessage = new TenantDatabaseErrorMessageValueObject(
        'Connection failed',
      );
      expect(errorMessage.length()).toBe(17);
    });

    it('should check if empty correctly', () => {
      const errorMessage = new TenantDatabaseErrorMessageValueObject(
        'Connection failed',
      );
      expect(errorMessage.isEmpty()).toBe(false);
      expect(errorMessage.isNotEmpty()).toBe(true);
    });

    it('should check if contains substring', () => {
      const errorMessage = new TenantDatabaseErrorMessageValueObject(
        'Connection failed',
      );
      expect(errorMessage.contains('Connection')).toBe(true);
      expect(errorMessage.contains('Timeout')).toBe(false);
    });

    it('should check if starts with prefix', () => {
      const errorMessage = new TenantDatabaseErrorMessageValueObject(
        'Connection failed',
      );
      expect(errorMessage.startsWith('Connection')).toBe(true);
      expect(errorMessage.startsWith('Timeout')).toBe(false);
    });

    it('should check if ends with suffix', () => {
      const errorMessage = new TenantDatabaseErrorMessageValueObject(
        'Connection failed',
      );
      expect(errorMessage.endsWith('failed')).toBe(true);
      expect(errorMessage.endsWith('succeeded')).toBe(false);
    });
  });
});
