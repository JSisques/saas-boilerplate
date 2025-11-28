import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidTimezoneException } from '@/shared/domain/exceptions/value-objects/invalid-timezone/invalid-timezone.exception';

describe('InvalidTimezoneException', () => {
  const testMessage = 'Invalid timezone value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidTimezoneException(testMessage);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidTimezoneException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidTimezoneException', () => {
    const exception = new InvalidTimezoneException(testMessage);

    expect(exception.name).toBe('InvalidTimezoneException');
  });

  it('should set the domain to Domain (inherited from base)', () => {
    const exception = new InvalidTimezoneException(testMessage);

    expect(exception.layer).toBe('Domain');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidTimezoneException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Domain] InvalidTimezoneException: ${testMessage}`,
    );
  });
});
