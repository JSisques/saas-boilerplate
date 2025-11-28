import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidLocaleException } from '@/shared/domain/exceptions/value-objects/invalid-locale/invalid-locale.exception';

describe('InvalidLocaleException', () => {
  const testMessage = 'Invalid locale value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidLocaleException(testMessage);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidLocaleException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidLocaleException', () => {
    const exception = new InvalidLocaleException(testMessage);

    expect(exception.name).toBe('InvalidLocaleException');
  });

  it('should set the domain to Domain (inherited from base)', () => {
    const exception = new InvalidLocaleException(testMessage);

    expect(exception.layer).toBe('Domain');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidLocaleException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Domain] InvalidLocaleException: ${testMessage}`,
    );
  });
});
