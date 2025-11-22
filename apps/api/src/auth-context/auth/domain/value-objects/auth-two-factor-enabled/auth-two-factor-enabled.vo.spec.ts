import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { BooleanValueObject } from '@/shared/domain/value-objects/boolean/boolean.vo';

describe('AuthTwoFactorEnabledValueObject', () => {
  it('should be an instance of BooleanValueObject', () => {
    const authTwoFactorEnabled = new AuthTwoFactorEnabledValueObject(true);

    expect(authTwoFactorEnabled).toBeInstanceOf(BooleanValueObject);
  });

  it('should create an auth two factor enabled value object with true', () => {
    const authTwoFactorEnabled = new AuthTwoFactorEnabledValueObject(true);

    expect(authTwoFactorEnabled.value).toBe(true);
  });

  it('should create an auth two factor enabled value object with false', () => {
    const authTwoFactorEnabled = new AuthTwoFactorEnabledValueObject(false);

    expect(authTwoFactorEnabled.value).toBe(false);
  });

  it('should parse string "true" to boolean true', () => {
    const authTwoFactorEnabled = new AuthTwoFactorEnabledValueObject('true');

    expect(authTwoFactorEnabled.value).toBe(true);
  });

  it('should parse string "false" to boolean false', () => {
    const authTwoFactorEnabled = new AuthTwoFactorEnabledValueObject('false');

    expect(authTwoFactorEnabled.value).toBe(false);
  });

  it('should support equals method from BooleanValueObject', () => {
    const authTwoFactorEnabled1 = new AuthTwoFactorEnabledValueObject(true);
    const authTwoFactorEnabled2 = new AuthTwoFactorEnabledValueObject(true);

    expect(authTwoFactorEnabled1.equals(authTwoFactorEnabled2)).toBe(true);
  });

  it('should return false for different boolean values', () => {
    const authTwoFactorEnabled1 = new AuthTwoFactorEnabledValueObject(true);
    const authTwoFactorEnabled2 = new AuthTwoFactorEnabledValueObject(false);

    expect(authTwoFactorEnabled1.equals(authTwoFactorEnabled2)).toBe(false);
  });

  it('should support isTrue method from BooleanValueObject', () => {
    const authTwoFactorEnabled = new AuthTwoFactorEnabledValueObject(true);

    expect(authTwoFactorEnabled.isTrue()).toBe(true);
  });

  it('should support isFalse method from BooleanValueObject', () => {
    const authTwoFactorEnabled = new AuthTwoFactorEnabledValueObject(false);

    expect(authTwoFactorEnabled.isFalse()).toBe(true);
  });
});

