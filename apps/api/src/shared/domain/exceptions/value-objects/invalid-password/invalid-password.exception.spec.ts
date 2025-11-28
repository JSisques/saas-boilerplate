import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidPasswordException } from '@/shared/domain/exceptions/value-objects/invalid-password/invalid-password.exception';

describe('InvalidPasswordException', () => {
  const testMessage = 'Invalid password value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidPasswordException(testMessage);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidPasswordException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidPasswordException', () => {
    const exception = new InvalidPasswordException(testMessage);

    expect(exception.name).toBe('InvalidPasswordException');
  });

  it('should set the domain to ValueObject', () => {
    const exception = new InvalidPasswordException(testMessage);

    expect(exception.layer).toBe('Domain');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidPasswordException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Domain] InvalidPasswordException: ${testMessage}`,
    );
  });
});
