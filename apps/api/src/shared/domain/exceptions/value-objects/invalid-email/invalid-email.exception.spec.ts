import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidEmailException } from '@/shared/domain/exceptions/value-objects/invalid-email/invalid-email.exception';

describe('InvalidEmailException', () => {
  const testMessage = 'Invalid email value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidEmailException(testMessage);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidEmailException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidEmailException', () => {
    const exception = new InvalidEmailException(testMessage);

    expect(exception.name).toBe('InvalidEmailException');
  });

  it('should set the domain to ValueObject', () => {
    const exception = new InvalidEmailException(testMessage);

    expect(exception.layer).toBe('Domain');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidEmailException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Domain] InvalidEmailException: ${testMessage}`,
    );
  });
});
