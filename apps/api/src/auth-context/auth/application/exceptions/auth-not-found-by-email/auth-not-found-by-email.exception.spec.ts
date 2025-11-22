import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';
import { AuthNotFoundByEmailException } from '@/auth-context/auth/application/exceptions/auth-not-found-by-email/auth-not-found-by-email.exception';

describe('AuthNotFoundByEmailException', () => {
  const email = 'test@example.com';

  it('should be an instance of BaseApplicationException', () => {
    const exception = new AuthNotFoundByEmailException(email);

    expect(exception).toBeInstanceOf(BaseApplicationException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the correct message', () => {
    const exception = new AuthNotFoundByEmailException(email);

    expect(exception.message).toBe(`Auth with email ${email} not found`);
  });

  it('should set the name to AuthNotFoundByEmailException', () => {
    const exception = new AuthNotFoundByEmailException(email);

    expect(exception.name).toBe('AuthNotFoundByEmailException');
  });

  it('should set the domain to Application', () => {
    const exception = new AuthNotFoundByEmailException(email);

    expect(exception.domain).toBe('Application');
  });

  it('should have a timestamp', () => {
    const before = new Date();
    const exception = new AuthNotFoundByEmailException(email);
    const after = new Date();

    expect(exception.timestamp).toBeInstanceOf(Date);
    expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(
      before.getTime(),
    );
    expect(exception.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should return a detailed message', () => {
    const exception = new AuthNotFoundByEmailException(email);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Application] AuthNotFoundByEmailException: Auth with email ${email} not found`,
    );
  });
});

