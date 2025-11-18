import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidHexException } from '@/shared/domain/exceptions/value-objects/invalid-hex/invalid-hex.exception';

describe('InvalidHexException', () => {
  const testMessage = 'Invalid hex value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidHexException(testMessage);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidHexException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidHexException', () => {
    const exception = new InvalidHexException(testMessage);

    expect(exception.name).toBe('InvalidHexException');
  });

  it('should set the domain to ValueObject', () => {
    const exception = new InvalidHexException(testMessage);

    expect(exception.domain).toBe('ValueObject');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidHexException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[ValueObject] InvalidHexException: ${testMessage}`,
    );
  });
});
