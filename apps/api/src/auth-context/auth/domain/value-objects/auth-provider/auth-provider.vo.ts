import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

/**
 * AuthProviderValueObject represents the provider of the authentication.
 * It extends the EnumValueObject to leverage common enum functionalities.
 */
export class AuthProviderValueObject extends EnumValueObject<
  typeof AuthProviderEnum
> {
  protected get enumObject(): typeof AuthProviderEnum {
    return AuthProviderEnum;
  }
}
