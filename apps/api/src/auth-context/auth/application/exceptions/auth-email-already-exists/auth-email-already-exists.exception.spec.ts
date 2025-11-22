import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';
import { AuthEmailAlreadyExistsException } from '@/auth-context/auth/application/exceptions/auth-email-already-exists/auth-email-already-exists.exception';

describe('AuthEmailAlreadyExistsException', () => {
  const email = 'test@example.com';

  it('should be an instance of BaseApplicationException', () => {
    const exception = new AuthEmailAlreadyExistsException(email);

    expect(exception).toBeInstanceOf(BaseApplicationException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the correct message', () => {
    const exception = new AuthEmailAlreadyExistsException(email);

    expect(exception.message).toBe(`Auth email ${email} already exists`);
  });

  it('should set the name to AuthEmailAlreadyExistsException', () => {
    const exception = new AuthEmailAlreadyExistsException(email);

    expect(exception.name).toBe('AuthEmailAlreadyExistsException');
  });

  it('should set the domain to Application', () => {
    const exception = new AuthEmailAlreadyExistsException(email);

    expect(exception.domain).toBe('Application');
  });

  it('should have a timestamp', () => {
    const before = new Date();
    const exception = new AuthEmailAlreadyExistsException(email);
    const after = new Date();

    expect(exception.timestamp).toBeInstanceOf(Date);
    expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(
      before.getTime(),
    );
    expect(exception.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should return a detailed message', () => {
    const exception = new AuthEmailAlreadyExistsException(email);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Application] AuthEmailAlreadyExistsException: Auth email ${email} already exists`,
    );
  });
});

