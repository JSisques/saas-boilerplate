import { IAuthCreateDto } from '@/auth-context/auth/domain/dtos/entities/auth-create/auth-create.dto';
import { IAuthUpdateDto } from '@/auth-context/auth/domain/dtos/entities/auth-update/auth-update.dto';
import { AuthPrimitives } from '@/auth-context/auth/domain/primitives/auth.primitives';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthLastLoginAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { AuthPasswordValueObject } from '@/auth-context/auth/domain/value-objects/auth-password/auth-password.vo';
import { AuthPhoneNumberValueObject } from '@/auth-context/auth/domain/value-objects/auth-phone-number/auth-phone-number.vo';
import { AuthProviderIdValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider-id/auth-provider-id.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { AuthUuidValueObject } from '@repo/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@repo/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

export class AuthAggregate {
  private readonly _id: AuthUuidValueObject;
  private readonly _userId: UserUuidValueObject;
  private _email: AuthEmailValueObject | null;
  private _phoneNumber: AuthPhoneNumberValueObject | null;
  private _emailVerified: AuthEmailVerifiedValueObject;
  private _lastLoginAt: AuthLastLoginAtValueObject | null;
  private _password: AuthPasswordValueObject | null;
  private _provider: AuthProviderValueObject;
  private _providerId: AuthProviderIdValueObject | null;
  private _twoFactorEnabled: AuthTwoFactorEnabledValueObject;

  constructor(props: IAuthCreateDto, generateEvent: boolean = true) {
    // 01: Set the properties
    this._id = props.id;
    this._userId = props.userId;
    this._email = props.email;
    this._phoneNumber = props.phoneNumber;
    this._emailVerified = props.emailVerified;
    this._lastLoginAt = props.lastLoginAt;
    this._password = props.password;
    this._provider = props.provider;
    this._providerId = props.providerId;
    this._twoFactorEnabled = props.twoFactorEnabled;
  }

  /**
   * Update the auth.
   *
   * @param props - The properties to update the auth.
   * @param props.email - The email of the auth.
   * @param props.emailVerified - The email verified of the auth.
   * @param props.lastLoginAt - The last login at of the auth.
   * @param props.password - The password of the auth.
   * @param props.provider - The provider of the auth.
   * @param props.providerId - The provider id of the auth.
   * @param props.twoFactorEnabled - The two factor enabled of the auth.
   * @param generateEvent - Whether to generate the auth updated event. Default is true.
   */
  public update(props: IAuthUpdateDto, generateEvent: boolean = true) {
    this._email = props.email !== undefined ? props.email : this._email;
    this._phoneNumber =
      props.phoneNumber !== undefined ? props.phoneNumber : this._phoneNumber;
    this._emailVerified =
      props.emailVerified !== undefined
        ? props.emailVerified
        : this._emailVerified;
    this._lastLoginAt =
      props.lastLoginAt !== undefined ? props.lastLoginAt : this._lastLoginAt;
    this._password =
      props.password !== undefined ? props.password : this._password;
    this._provider =
      props.provider !== undefined ? props.provider : this._provider;
    this._providerId =
      props.providerId !== undefined ? props.providerId : this._providerId;
    this._twoFactorEnabled =
      props.twoFactorEnabled !== undefined
        ? props.twoFactorEnabled
        : this._twoFactorEnabled;
  }

  public updateLastLoginAt(lastLoginAt: AuthLastLoginAtValueObject) {
    this._lastLoginAt = lastLoginAt;
  }

  /**
   * Delete the auth.
   *
   * @param generateEvent - Whether to generate the auth deleted event. Default is true.
   */
  public delete() {}

  public get id(): AuthUuidValueObject {
    return this._id;
  }

  public get userId(): UserUuidValueObject {
    return this._userId;
  }

  public get email(): AuthEmailValueObject | null {
    return this._email;
  }

  public get emailVerified(): AuthEmailVerifiedValueObject {
    return this._emailVerified;
  }

  public get phoneNumber(): AuthPhoneNumberValueObject | null {
    return this._phoneNumber;
  }

  public get lastLoginAt(): AuthLastLoginAtValueObject | null {
    return this._lastLoginAt;
  }

  public get password(): AuthPasswordValueObject | null {
    return this._password;
  }

  public get provider(): AuthProviderValueObject {
    return this._provider;
  }

  public get providerId(): AuthProviderIdValueObject | null {
    return this._providerId;
  }

  public get twoFactorEnabled(): AuthTwoFactorEnabledValueObject {
    return this._twoFactorEnabled;
  }

  /**
   * Convert the auth aggregate to primitives.
   *
   * @returns The primitives of the auth.
   */
  public toPrimitives(): AuthPrimitives {
    return {
      id: this._id.value,
      userId: this._userId.value,
      email: this._email ? this._email.value : null,
      emailVerified: this._emailVerified.value,
      lastLoginAt: this._lastLoginAt ? this._lastLoginAt.value : null,
      password: this._password ? this._password.value : null,
      phoneNumber: this._phoneNumber ? this._phoneNumber.value : null,
      provider: this._provider.value,
      providerId: this._providerId ? this._providerId.value : null,
      twoFactorEnabled: this._twoFactorEnabled.value,
    };
  }
}
