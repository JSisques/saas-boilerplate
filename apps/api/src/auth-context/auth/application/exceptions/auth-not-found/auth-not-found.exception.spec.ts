import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';
import { AuthNotFoundException } from '@/auth-context/auth/application/exceptions/auth-not-found/auth-not-found.exception';

describe('AuthNotFoundException', () => {
  const authId = '123e4567-e89b-12d3-a456-426614174000';

  it('should be an instance of BaseApplicationException', () => {
    const exception = new AuthNotFoundException(authId);

    expect(exception).toBeInstanceOf(BaseApplicationException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the correct message', () => {
    const exception = new AuthNotFoundException(authId);

    expect(exception.message).toBe(`Auth with id ${authId} not found`);
  });

  it('should set the name to AuthNotFoundException', () => {
    const exception = new AuthNotFoundException(authId);

    expect(exception.name).toBe('AuthNotFoundException');
  });

  it('should set the domain to Application', () => {
    const exception = new AuthNotFoundException(authId);

    expect(exception.domain).toBe('Application');
  });

  it('should have a timestamp', () => {
    const before = new Date();
    const exception = new AuthNotFoundException(authId);
    const after = new Date();

    expect(exception.timestamp).toBeInstanceOf(Date);
    expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(
      before.getTime(),
    );
    expect(exception.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should return a detailed message', () => {
    const exception = new AuthNotFoundException(authId);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[Application] AuthNotFoundException: Auth with id ${authId} not found`,
    );
  });
});

