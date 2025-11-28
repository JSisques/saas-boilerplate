import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidUrlException } from '@/shared/domain/exceptions/value-objects/invalid-url/invalid-url.exception';

describe('InvalidUrlException', () => {
  const testMessage = 'Invalid URL value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidUrlException(testMessage);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidUrlException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidUrlException', () => {
    const exception = new InvalidUrlException(testMessage);

    expect(exception.name).toBe('InvalidUrlException');
  });

  it('should set the domain to ValueObject', () => {
    const exception = new InvalidUrlException(testMessage);

    expect(exception.layer).toBe('Domain');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidUrlException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Domain] InvalidUrlException: ${testMessage}`,
    );
  });
});
