import { InvalidHashFormatException } from '@/auth-context/auth/application/exceptions/auth-invalid-hash-format/auth-invalid-hash-format.exception';
import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

describe('InvalidHashFormatException', () => {
  const testHash = '$2b$12$invalidhashformat';

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidHashFormatException(testHash);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with hash in message when hash is provided', () => {
    const exception = new InvalidHashFormatException(testHash);

    expect(exception.message).toBe(`Invalid hash format: ${testHash}`);
  });

  it('should create an exception with default message when hash is not provided', () => {
    const exception = new InvalidHashFormatException();

    expect(exception.message).toBe('Invalid hash format provided');
  });

  it('should set the name to InvalidHashFormatException', () => {
    const exception = new InvalidHashFormatException(testHash);

    expect(exception.name).toBe('InvalidHashFormatException');
  });

  it('should set the layer to Domain', () => {
    const exception = new InvalidHashFormatException(testHash);

    expect(exception.layer).toBe('Domain');
  });

  it('should have a timestamp', () => {
    const before = new Date();
    const exception = new InvalidHashFormatException(testHash);
    const after = new Date();

    expect(exception.timestamp).toBeInstanceOf(Date);
    expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(
      before.getTime(),
    );
    expect(exception.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should return a detailed message', () => {
    const exception = new InvalidHashFormatException(testHash);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Domain] InvalidHashFormatException: Invalid hash format: ${testHash}`,
    );
  });
});
