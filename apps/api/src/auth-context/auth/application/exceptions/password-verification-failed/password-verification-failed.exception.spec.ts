import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';
import { PasswordVerificationFailedException } from '@/auth-context/auth/application/exceptions/password-verification-failed/password-verification-failed.exception';

describe('PasswordVerificationFailedException', () => {
  it('should be an instance of BaseApplicationException', () => {
    const exception = new PasswordVerificationFailedException();

    expect(exception).toBeInstanceOf(BaseApplicationException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the correct message', () => {
    const exception = new PasswordVerificationFailedException();

    expect(exception.message).toBe('Password verification failed');
  });

  it('should set the name to PasswordVerificationFailedException', () => {
    const exception = new PasswordVerificationFailedException();

    expect(exception.name).toBe('PasswordVerificationFailedException');
  });

  it('should set the domain to Application', () => {
    const exception = new PasswordVerificationFailedException();

    expect(exception.domain).toBe('Application');
  });

  it('should have a timestamp', () => {
    const before = new Date();
    const exception = new PasswordVerificationFailedException();
    const after = new Date();

    expect(exception.timestamp).toBeInstanceOf(Date);
    expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(
      before.getTime(),
    );
    expect(exception.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should return a detailed message', () => {
    const exception = new PasswordVerificationFailedException();
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      '[Application] PasswordVerificationFailedException: Password verification failed',
    );
  });
});

