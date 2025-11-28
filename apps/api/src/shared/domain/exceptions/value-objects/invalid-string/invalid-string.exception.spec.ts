import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidStringException } from '@/shared/domain/exceptions/value-objects/invalid-string/invalid-string.exception';

describe('InvalidStringException', () => {
  const testMessage = 'Invalid string value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidStringException(testMessage);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidStringException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidStringException', () => {
    const exception = new InvalidStringException(testMessage);

    expect(exception.name).toBe('InvalidStringException');
  });

  it('should set the domain to ValueObject', () => {
    const exception = new InvalidStringException(testMessage);

    expect(exception.layer).toBe('Domain');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidStringException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Domain] InvalidStringException: ${testMessage}`,
    );
  });
});
