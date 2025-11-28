import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidColorException } from '@/shared/domain/exceptions/value-objects/invalid-color/invalid-color.exception';

describe('InvalidColorException', () => {
  const testMessage = 'Invalid color value';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidColorException(testMessage);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the provided message', () => {
    const exception = new InvalidColorException(testMessage);

    expect(exception.message).toBe(testMessage);
  });

  it('should set the name to InvalidColorException', () => {
    const exception = new InvalidColorException(testMessage);

    expect(exception.name).toBe('InvalidColorException');
  });

  it('should set the domain to ValueObject', () => {
    const exception = new InvalidColorException(testMessage);

    expect(exception.layer).toBe('Domain');
  });

  it('should return a detailed message', () => {
    const exception = new InvalidColorException(testMessage);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Domain] InvalidColorException: ${testMessage}`,
    );
  });
});
