import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';
import { InvalidSaltRoundsException } from '@/auth-context/auth/application/exceptions/auth-invalid-salt-rounds/auth-invalid-salt-rounds.exception';

describe('InvalidSaltRoundsException', () => {
  const invalidRounds = 35;

  it('should be an instance of BaseDomainException', () => {
    const exception = new InvalidSaltRoundsException(invalidRounds);

    expect(exception).toBeInstanceOf(BaseDomainException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('should create an exception with the correct message', () => {
    const exception = new InvalidSaltRoundsException(invalidRounds);

    expect(exception.message).toBe(
      `Invalid salt rounds: ${invalidRounds}. Salt rounds must be between 4 and 31`,
    );
  });

  it('should set the name to InvalidSaltRoundsException', () => {
    const exception = new InvalidSaltRoundsException(invalidRounds);

    expect(exception.name).toBe('InvalidSaltRoundsException');
  });

  it('should set the domain to PasswordHashing', () => {
    const exception = new InvalidSaltRoundsException(invalidRounds);

    expect(exception.domain).toBe('PasswordHashing');
  });

  it('should have a timestamp', () => {
    const before = new Date();
    const exception = new InvalidSaltRoundsException(invalidRounds);
    const after = new Date();

    expect(exception.timestamp).toBeInstanceOf(Date);
    expect(exception.timestamp.getTime()).toBeGreaterThanOrEqual(
      before.getTime(),
    );
    expect(exception.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should return a detailed message', () => {
    const exception = new InvalidSaltRoundsException(invalidRounds);
    const detailedMessage = exception.getDetailedMessage();

    expect(detailedMessage).toBe(
      `[PasswordHashing] InvalidSaltRoundsException: Invalid salt rounds: ${invalidRounds}. Salt rounds must be between 4 and 31`,
    );
  });

  it('should work with different invalid round values', () => {
    const lowRounds = 3;
    const highRounds = 32;

    const exceptionLow = new InvalidSaltRoundsException(lowRounds);
    const exceptionHigh = new InvalidSaltRoundsException(highRounds);

    expect(exceptionLow.message).toContain(`${lowRounds}`);
    expect(exceptionHigh.message).toContain(`${highRounds}`);
  });
});
