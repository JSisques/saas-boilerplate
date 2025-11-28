import { AuthAggregate } from '@/auth-context/auth/domain/aggregates/auth.aggregate';
import { IAuthCreateDto } from '@/auth-context/auth/domain/dtos/entities/auth-create/auth-create.dto';
import { AuthPrimitives } from '@/auth-context/auth/domain/primitives/auth.primitives';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthLastLoginAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { AuthPasswordValueObject } from '@/auth-context/auth/domain/value-objects/auth-password/auth-password.vo';
import { AuthPhoneNumberValueObject } from '@/auth-context/auth/domain/value-objects/auth-phone-number/auth-phone-number.vo';
import { AuthProviderIdValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider-id/auth-provider-id.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { IWriteFactory } from '@repo/shared/domain/interfaces/write-factory.interface';
import { AuthUuidValueObject } from '@repo/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@repo/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

/**
 * Factory class responsible for creating AuthAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate auth information.
 */
export class AuthAggregateFactory
  implements IWriteFactory<AuthAggregate, IAuthCreateDto>
{
  /**
   * Creates a new AuthAggregate entity using the provided properties.
   *
   * @param data - The auth create data.
   * @returns {AuthAggregate} - The created auth aggregate entity.
   */
  public create(data: IAuthCreateDto): AuthAggregate {
    return new AuthAggregate(data);
  }

  /**
   * Creates a new AuthAggregate entity from primitive data.
   *
   * @param data - The auth primitive data.
   * @returns The created auth aggregate entity.
   */
  public fromPrimitives(data: AuthPrimitives): AuthAggregate {
    return new AuthAggregate({
      id: new AuthUuidValueObject(data.id),
      userId: new UserUuidValueObject(data.userId),
      email: data.email ? new AuthEmailValueObject(data.email) : null,
      emailVerified: data.emailVerified
        ? new AuthEmailVerifiedValueObject(data.emailVerified)
        : new AuthEmailVerifiedValueObject(false),
      lastLoginAt: data.lastLoginAt
        ? new AuthLastLoginAtValueObject(data.lastLoginAt)
        : null,
      password: data.password
        ? new AuthPasswordValueObject(data.password)
        : null,
      provider: new AuthProviderValueObject(data.provider),
      providerId: data.providerId
        ? new AuthProviderIdValueObject(data.providerId)
        : null,
      twoFactorEnabled: data.twoFactorEnabled
        ? new AuthTwoFactorEnabledValueObject(data.twoFactorEnabled)
        : new AuthTwoFactorEnabledValueObject(false),
      phoneNumber: data.phoneNumber
        ? new AuthPhoneNumberValueObject(data.phoneNumber)
        : null,
    });
  }
}
