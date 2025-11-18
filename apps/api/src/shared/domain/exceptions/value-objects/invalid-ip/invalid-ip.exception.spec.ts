import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidIpException } from '@/shared/domain/exceptions/value-objects/invalid-ip/invalid-ip.exception';

describe('InvalidIpException', () => {
  const testMessage = 'Invalid IP address value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidIpException(testMessage);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidIpException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidIpException', () => {
    const exception = new InvalidIpException(testMessage);

    expect(exception.name).toBe('InvalidIpException');
  });

  it('should set the domain to ValueObject', () => {
    const exception = new InvalidIpException(testMessage);

    expect(exception.domain).toBe('ValueObject');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidIpException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[ValueObject] InvalidIpException: ${testMessage}`,
    );
  });
});
