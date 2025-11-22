import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';
import { PasswordHashingFailedException } from '@/auth-context/auth/application/exceptions/password-hashing-failed/password-hashing-failed.exception';

describe('PasswordHashingFailedException', () => {
  it('should be an instance of BaseApplicationException', () => {
    const exception = new PasswordHashingFailedException();

    expect(exception).toBeInstanceOf(BaseApplicationException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the correct message', () => {
    const exception = new PasswordHashingFailedException();

    expect(exception.message).toBe('Password hashing failed');
  });

  it('should set the name to PasswordHashingFailedException', () => {
    const exception = new PasswordHashingFailedException();

    expect(exception.name).toBe('PasswordHashingFailedException');
  });

  it('should set the domain to Application', () => {
    const exception = new PasswordHashingFailedException();

    expect(exception.domain).toBe('Application');
  });

  it('should have a timestamp', () => {
    const before = new Date();
    const exception = new PasswordHashingFailedException();
    const after = new Date();

    expect(exception.timestamp).toBeInstanceOf(Date);
    expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(
      before.getTime(),
    );
    expect(exception.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should return a detailed message', () => {
    const exception = new PasswordHashingFailedException();
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      '[Application] PasswordHashingFailedException: Password hashing failed',
    );
  });
});

