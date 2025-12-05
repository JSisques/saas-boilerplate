import { IAuthCreateCommandDto } from '@/auth-context/auth/application/dtos/commands/auth-create/auth-create-command.dto';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthLastLoginAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { AuthPasswordValueObject } from '@/auth-context/auth/domain/value-objects/auth-password/auth-password.vo';
import { AuthPhoneNumberValueObject } from '@/auth-context/auth/domain/value-objects/auth-phone-number/auth-phone-number.vo';
import { AuthProviderIdValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider-id/auth-provider-id.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

export class AuthCreateCommand {
  readonly id: AuthUuidValueObject;
  readonly userId: UserUuidValueObject;
  readonly email: AuthEmailValueObject | null;
  readonly emailVerified: AuthEmailVerifiedValueObject;
  readonly lastLoginAt: AuthLastLoginAtValueObject | null;
  readonly password: AuthPasswordValueObject | null;
  readonly phoneNumber: AuthPhoneNumberValueObject | null;
  readonly provider: AuthProviderValueObject;
  readonly providerId: AuthProviderIdValueObject | null;
  readonly twoFactorEnabled: AuthTwoFactorEnabledValueObject;

  constructor(props: IAuthCreateCommandDto) {
    this.id = props.id
      ? new AuthUuidValueObject(props.id)
      : new AuthUuidValueObject();
    this.userId = new UserUuidValueObject(props.userId);

    this.email = props.email ? new AuthEmailValueObject(props.email) : null;

    this.emailVerified = new AuthEmailVerifiedValueObject(
      props.emailVerified ?? false,
    );

    this.lastLoginAt = props.lastLoginAt
      ? new AuthLastLoginAtValueObject(props.lastLoginAt)
      : null;

    this.password = props.password
      ? new AuthPasswordValueObject(props.password)
      : null;

    this.phoneNumber = props.phoneNumber
      ? new AuthPhoneNumberValueObject(props.phoneNumber)
      : null;

    this.provider = new AuthProviderValueObject(props.provider);

    this.providerId = props.providerId
      ? new AuthProviderIdValueObject(props.providerId)
      : null;

    this.twoFactorEnabled = new AuthTwoFactorEnabledValueObject(
      props.twoFactorEnabled ?? false,
    );
  }
}
