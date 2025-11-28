import { AuthProviderIdValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider-id/auth-provider-id.vo';
import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';
import { InvalidStringException } from '@/shared/domain/exceptions/value-objects/invalid-string/invalid-string.exception';

describe('AuthProviderIdValueObject', () => {
  const validProviderId = 'google-123456789';

  it('should be an instance of StringValueObject', () => {
    const authProviderId = new AuthProviderIdValueObject(validProviderId);

    expect(authProviderId).toBeInstanceOf(StringValueObject);
  });

  it('should create an auth provider id value object with valid string', () => {
    const authProviderId = new AuthProviderIdValueObject(validProviderId);

    expect(authProviderId.value).toBe(validProviderId);
  });

  it('should trim whitespace by default', () => {
    const authProviderId = new AuthProviderIdValueObject('  google-123  ');

    expect(authProviderId.value).toBe('google-123');
  });

  it('should throw InvalidStringException when string is empty and allowEmpty is false', () => {
    expect(
      () => new AuthProviderIdValueObject('', { allowEmpty: false }),
    ).toThrow(InvalidStringException);
  });

  it('should support equals method from StringValueObject', () => {
    const authProviderId1 = new AuthProviderIdValueObject(validProviderId);
    const authProviderId2 = new AuthProviderIdValueObject(validProviderId);

    expect(authProviderId1.equals(authProviderId2)).toBe(true);
  });

  it('should return false for different provider ids', () => {
    const authProviderId1 = new AuthProviderIdValueObject('google-123');
    const authProviderId2 = new AuthProviderIdValueObject('apple-456');

    expect(authProviderId1.equals(authProviderId2)).toBe(false);
  });

  it('should handle different provider id formats', () => {
    const providerIds = [
      'google-123456789',
      'apple-abc123def',
      'facebook-user123',
    ];

    providerIds.forEach((providerId) => {
      const authProviderId = new AuthProviderIdValueObject(providerId);
      expect(authProviderId.value).toBe(providerId.trim());
    });
  });
});
