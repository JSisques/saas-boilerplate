import { AuthAggregate } from '@/auth-context/auth/domain/aggregate/auth.aggregate';
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
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { Injectable } from '@nestjs/common';

/**
 * Factory class responsible for creating AuthAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate auth information.
 */
@Injectable()
export class AuthAggregateFactory
  implements IWriteFactory<AuthAggregate, IAuthCreateDto, AuthPrimitives>
{
  /**
   * Creates a new AuthAggregate entity using the provided create data.
   *
   * @param data - The auth create data.
   * @param data.id - The auth id.
   * @param data.userId - The user id.
   * @param data.email - The email of the auth.
   * @param data.emailVerified - The email verified of the auth.
   * @param data.lastLoginAt - The last login at of the auth.
   * @param data.password - The password of the auth.
   * @param data.provider - The provider of the auth.
   * @param data.providerId - The provider id of the auth.
   * @param data.twoFactorEnabled - The two factor enabled of the auth.
   * @param data.createdAt - The created at of the auth.
   * @param data.updatedAt - The updated at of the auth.
   * @param generateEvent - Whether to generate a creation event (default: true).
   * @returns {AuthAggregate} - The created auth aggregate entity.
   */
  public create(
    data: IAuthCreateDto,
    generateEvent: boolean = true,
  ): AuthAggregate {
    return new AuthAggregate(data, generateEvent);
  }

  /**
   * Creates a new AuthAggregate entity from primitive data.
   *
   * @param data - The auth primitive data.
   * @param data.id - The auth id.
   * @param data.userId - The user id.
   * @param data.email - The email of the auth.
   * @param data.emailVerified - The email verified of the auth.
   * @param data.lastLoginAt - The last login at of the auth.
   * @param data.password - The password of the auth.
   * @param data.provider - The provider of the auth.
   * @param data.providerId - The provider id of the auth.
   * @param data.twoFactorEnabled - The two factor enabled of the auth.
   * @param data.createdAt - The created at of the auth.
   * @param data.updatedAt - The updated at of the auth.
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
      createdAt: new DateValueObject(data.createdAt),
      updatedAt: new DateValueObject(data.updatedAt),
    });
  }
}
