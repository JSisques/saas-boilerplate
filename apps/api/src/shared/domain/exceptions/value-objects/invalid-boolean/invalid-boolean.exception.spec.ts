import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidBooleanException } from '@/shared/domain/exceptions/value-objects/invalid-boolean/invalid-boolean.exception';

describe('InvalidBooleanException', () => {
  const testMessage = 'Invalid boolean value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidBooleanException(testMessage);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidBooleanException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidBooleanException', () => {
    const exception = new InvalidBooleanException(testMessage);

    expect(exception.name).toBe('InvalidBooleanException');
  });

  it('should set the domain to ValueObject', () => {
    const exception = new InvalidBooleanException(testMessage);

    expect(exception.domain).toBe('ValueObject');
  });

  it('should create a timestamp when the exception is created', () => {
    const beforeCreation = new Date();
    const exception = new InvalidBooleanException(testMessage);
    const afterCreation = new Date();

    expect(exception.timestamp).toBeInstanceOf(Date);
    expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(
      beforeCreation.getTime(),
    );
    expect(exception.timestamp.getTime()).toBeLessThanOrEqual(
      afterCreation.getTime(),
    );
  });

  it('should return a detailed message', () => {
    const exception = new InvalidBooleanException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[ValueObject] InvalidBooleanException: ${testMessage}`,
    );
  });

  it('should convert to JSON correctly', () => {
    const exception = new InvalidBooleanException(testMessage);
    const json = exception.toJSON();

    expect(json).toHaveProperty('name', 'InvalidBooleanException');
    expect(json).toHaveProperty('message', testMessage);
    expect(json).toHaveProperty('domain', 'ValueObject');
    expect(json).toHaveProperty('timestamp');
    expect(json).toHaveProperty('stack');
  });
});
