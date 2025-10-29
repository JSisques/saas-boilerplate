import { IAuthUpdateCommandDto } from '@/auth-context/auth/application/dtos/commands/auth-update/auth-update-command.dto';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthLastLoginAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { AuthPasswordHashValueObject } from '@/auth-context/auth/domain/value-objects/auth-password-hash/auth-password-hash.vo';
import { AuthProviderIdValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider-id/auth-provider-id.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';

export class AuthUpdateCommand {
  readonly id: AuthUuidValueObject;
  readonly email?: AuthEmailValueObject | null;
  readonly emailVerified?: AuthEmailVerifiedValueObject;
  readonly lastLoginAt: AuthLastLoginAtValueObject | null;
  readonly passwordHash?: AuthPasswordHashValueObject | null;
  readonly provider?: AuthProviderValueObject;
  readonly providerId?: AuthProviderIdValueObject | null;
  readonly twoFactorEnabled?: AuthTwoFactorEnabledValueObject;

  constructor(props: IAuthUpdateCommandDto) {
    this.id = new AuthUuidValueObject(props.id);

    if (props.email !== undefined) {
      this.email = props.email ? new AuthEmailValueObject(props.email) : null;
    }

    if (props.emailVerified !== undefined) {
      this.emailVerified = new AuthEmailVerifiedValueObject(
        props.emailVerified,
      );
    }

    if (props.lastLoginAt !== undefined) {
      this.lastLoginAt = props.lastLoginAt
        ? new AuthLastLoginAtValueObject(props.lastLoginAt)
        : null;
    }

    if (props.passwordHash !== undefined) {
      this.passwordHash = props.passwordHash
        ? new AuthPasswordHashValueObject(props.passwordHash)
        : null;
    }

    if (props.provider !== undefined) {
      this.provider = new AuthProviderValueObject(props.provider);
    }

    if (props.providerId !== undefined) {
      this.providerId = props.providerId
        ? new AuthProviderIdValueObject(props.providerId)
        : null;
    }

    if (props.twoFactorEnabled !== undefined) {
      this.twoFactorEnabled = new AuthTwoFactorEnabledValueObject(
        props.twoFactorEnabled,
      );
    }
  }
}
