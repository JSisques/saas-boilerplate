import { AuthPasswordNotProvidedException } from '@/auth-context/auth/application/exceptions/auth-password-not-provided copy/auth-password-not-provided.exception';
import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

describe('AuthPasswordNotProvidedException', () => {
  it('should be an instance of BaseApplicationException', () => {
    const exception = new AuthPasswordNotProvidedException();

    expect(exception).toBeInstanceOf(BaseApplicationException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the correct message', () => {
    const exception = new AuthPasswordNotProvidedException();

    expect(exception.message).toBe('Auth password not provided');
  });

  it('should set the name to AuthPasswordNotProvidedException', () => {
    const exception = new AuthPasswordNotProvidedException();

    expect(exception.name).toBe('AuthPasswordNotProvidedException');
  });

  it('should set the domain to Application', () => {
    const exception = new AuthPasswordNotProvidedException();

    expect(exception.layer).toBe('Application');
  });

  it('should have a timestamp', () => {
    const before = new Date();
    const exception = new AuthPasswordNotProvidedException();
    const after = new Date();

    expect(exception.timestamp).toBeInstanceOf(Date);
    expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(
      before.getTime(),
    );
    expect(exception.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should return a detailed message', () => {
    const exception = new AuthPasswordNotProvidedException();
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      '[Application] AuthPasswordNotProvidedException: Auth password not provided',
    );
  });
});
