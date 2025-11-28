import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidUuidException } from '@/shared/domain/exceptions/value-objects/invalid-uuid/invalid-uuid.exception';

describe('InvalidUuidException', () => {
  const testMessage = 'Invalid UUID value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidUuidException(testMessage);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidUuidException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidUuidException', () => {
    const exception = new InvalidUuidException(testMessage);

    expect(exception.name).toBe('InvalidUuidException');
  });

  it('should set the domain to ValueObject', () => {
    const exception = new InvalidUuidException(testMessage);

    expect(exception.layer).toBe('Domain');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidUuidException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Domain] InvalidUuidException: ${testMessage}`,
    );
  });
});
