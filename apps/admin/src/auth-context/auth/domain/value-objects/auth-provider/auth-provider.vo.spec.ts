import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';
import { InvalidEnumValueException } from '@/shared/domain/exceptions/value-objects/invalid-enum-value/invalid-enum-value.exception';

describe('AuthProviderValueObject', () => {
  it('should be an instance of EnumValueObject', () => {
    const authProvider = new AuthProviderValueObject(AuthProviderEnum.LOCAL);

    expect(authProvider).toBeInstanceOf(EnumValueObject);
  });

  it('should create an auth provider value object with valid LOCAL value', () => {
    const authProvider = new AuthProviderValueObject(AuthProviderEnum.LOCAL);

    expect(authProvider.value).toBe(AuthProviderEnum.LOCAL);
  });

  it('should create an auth provider value object with valid GOOGLE value', () => {
    const authProvider = new AuthProviderValueObject(AuthProviderEnum.GOOGLE);

    expect(authProvider.value).toBe(AuthProviderEnum.GOOGLE);
  });

  it('should create an auth provider value object with valid APPLE value', () => {
    const authProvider = new AuthProviderValueObject(AuthProviderEnum.APPLE);

    expect(authProvider.value).toBe(AuthProviderEnum.APPLE);
  });

  it('should throw InvalidEnumValueException for empty string', () => {
    expect(() => new AuthProviderValueObject('' as any)).toThrow(
      InvalidEnumValueException,
    );
  });

  it('should throw InvalidEnumValueException for invalid enum value', () => {
    expect(() => new AuthProviderValueObject('INVALID' as any)).toThrow(
      InvalidEnumValueException,
    );
  });

  it('should support equals method from EnumValueObject', () => {
    const authProvider1 = new AuthProviderValueObject(AuthProviderEnum.LOCAL);
    const authProvider2 = new AuthProviderValueObject(AuthProviderEnum.LOCAL);

    expect(authProvider1.equals(authProvider2)).toBe(true);
  });

  it('should return false for different provider values', () => {
    const authProvider1 = new AuthProviderValueObject(AuthProviderEnum.LOCAL);
    const authProvider2 = new AuthProviderValueObject(AuthProviderEnum.GOOGLE);

    expect(authProvider1.equals(authProvider2)).toBe(false);
  });

  it('should handle all valid provider enum values', () => {
    const providers = [
      AuthProviderEnum.LOCAL,
      AuthProviderEnum.GOOGLE,
      AuthProviderEnum.APPLE,
    ];

    providers.forEach((provider) => {
      const authProvider = new AuthProviderValueObject(provider);
      expect(authProvider.value).toBe(provider);
    });
  });
});
