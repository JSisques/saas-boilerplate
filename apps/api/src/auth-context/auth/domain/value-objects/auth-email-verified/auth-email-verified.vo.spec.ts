import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { BooleanValueObject } from '@/shared/domain/value-objects/boolean/boolean.vo';

describe('AuthEmailVerifiedValueObject', () => {
  it('should be an instance of BooleanValueObject', () => {
    const authEmailVerified = new AuthEmailVerifiedValueObject(true);

    expect(authEmailVerified).toBeInstanceOf(BooleanValueObject);
  });

  it('should create an auth email verified value object with true', () => {
    const authEmailVerified = new AuthEmailVerifiedValueObject(true);

    expect(authEmailVerified.value).toBe(true);
  });

  it('should create an auth email verified value object with false', () => {
    const authEmailVerified = new AuthEmailVerifiedValueObject(false);

    expect(authEmailVerified.value).toBe(false);
  });

  it('should parse string "true" to boolean true', () => {
    const authEmailVerified = new AuthEmailVerifiedValueObject('true');

    expect(authEmailVerified.value).toBe(true);
  });

  it('should parse string "false" to boolean false', () => {
    const authEmailVerified = new AuthEmailVerifiedValueObject('false');

    expect(authEmailVerified.value).toBe(false);
  });

  it('should support equals method from BooleanValueObject', () => {
    const authEmailVerified1 = new AuthEmailVerifiedValueObject(true);
    const authEmailVerified2 = new AuthEmailVerifiedValueObject(true);

    expect(authEmailVerified1.equals(authEmailVerified2)).toBe(true);
  });

  it('should return false for different boolean values', () => {
    const authEmailVerified1 = new AuthEmailVerifiedValueObject(true);
    const authEmailVerified2 = new AuthEmailVerifiedValueObject(false);

    expect(authEmailVerified1.equals(authEmailVerified2)).toBe(false);
  });

  it('should support isTrue method from BooleanValueObject', () => {
    const authEmailVerified = new AuthEmailVerifiedValueObject(true);

    expect(authEmailVerified.isTrue()).toBe(true);
  });

  it('should support isFalse method from BooleanValueObject', () => {
    const authEmailVerified = new AuthEmailVerifiedValueObject(false);

    expect(authEmailVerified.isFalse()).toBe(true);
  });
});

