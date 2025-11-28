import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidJsonException } from '@/shared/domain/exceptions/value-objects/invalid-json/invalid-json.exception';

describe('InvalidJsonException', () => {
  const testMessage = 'Invalid JSON value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidJsonException(testMessage);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidJsonException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidJsonException', () => {
    const exception = new InvalidJsonException(testMessage);

    expect(exception.name).toBe('InvalidJsonException');
  });

  it('should set the domain to ValueObject', () => {
    const exception = new InvalidJsonException(testMessage);

    expect(exception.layer).toBe('Domain');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidJsonException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Domain] InvalidJsonException: ${testMessage}`,
    );
  });
});
