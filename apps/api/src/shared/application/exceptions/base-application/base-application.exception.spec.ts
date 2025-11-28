import { BaseApplicationException } from './base-application.exception';

describe('BaseApplicationException', () => {
  it('should be defined', () => {
    expect(BaseApplicationException).toBeDefined();
  });

  describe('constructor', () => {
    it('should create an exception with message', () => {
      const exception = new BaseApplicationException('Test error message');

      expect(exception.message).toBe('Test error message');
      expect(exception.name).toBe('BaseApplicationException');
      expect(exception.layer).toBe('Application');
      expect(exception.timestamp).toBeInstanceOf(Date);
    });

    it('should set the name to the constructor name', () => {
      const exception = new BaseApplicationException('Error');

      expect(exception.name).toBe('BaseApplicationException');
    });

    it('should set the domain to Application', () => {
      const exception = new BaseApplicationException('Error');

      expect(exception.layer).toBe('Application');
    });

    it('should set the timestamp to current date', () => {
      const before = new Date();
      const exception = new BaseApplicationException('Error');
      const after = new Date();

      expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(exception.timestamp.getTime()).toBeLessThanOrEqual(
        after.getTime(),
      );
    });
  });

  describe('getDetailedMessage', () => {
    it('should return a detailed error message', () => {
      const exception = new BaseApplicationException('Test error');

      const detailedMessage = exception.getDetailedMessage();

      expect(detailedMessage).toBe(
        '[Application] BaseApplicationException: Test error',
      );
    });

    it('should include domain, name and message in detailed message', () => {
      const exception = new BaseApplicationException('Custom error message');

      const detailedMessage = exception.getDetailedMessage();

      expect(detailedMessage).toContain('Application');
      expect(detailedMessage).toContain('BaseApplicationException');
      expect(detailedMessage).toContain('Custom error message');
    });
  });

  describe('toJSON', () => {
    it('should convert exception to JSON', () => {
      const exception = new BaseApplicationException('Test error');

      const json = exception.toJSON();

      expect(json).toHaveProperty('name', 'BaseApplicationException');
      expect(json).toHaveProperty('message', 'Test error');
      expect(json).toHaveProperty('layer', 'Application');
      expect(json).toHaveProperty('timestamp');
      expect(json).toHaveProperty('stack');
    });

    it('should include timestamp as ISO string', () => {
      const exception = new BaseApplicationException('Error');

      const json = exception.toJSON() as any;

      expect(json.timestamp).toBe(exception.timestamp.toISOString());
      expect(typeof json.timestamp).toBe('string');
    });

    it('should include stack trace', () => {
      const exception = new BaseApplicationException('Error');

      const json = exception.toJSON() as any;

      expect(json.stack).toBeDefined();
      expect(typeof json.stack).toBe('string');
    });
  });

  describe('inheritance', () => {
    it('should extend Error', () => {
      const exception = new BaseApplicationException('Error');

      expect(exception).toBeInstanceOf(Error);
      expect(exception).toBeInstanceOf(BaseApplicationException);
    });

    it('should be throwable', () => {
      expect(() => {
        throw new BaseApplicationException('Test error');
      }).toThrow(BaseApplicationException);
    });
  });
});
