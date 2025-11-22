import { IAuthCreateDto } from '@/auth-context/auth/domain/dtos/entities/auth-create/auth-create.dto';
import { IAuthUpdateDto } from '@/auth-context/auth/domain/dtos/entities/auth-update/auth-update.dto';
import { AuthPrimitives } from '@/auth-context/auth/domain/primitives/auth.primitives';
import { AuthCreatedAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-created-at/auth-created-at.vo';
import { AuthEmailVerifiedValueObject } from '@/auth-context/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthEmailValueObject } from '@/auth-context/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthLastLoginAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { AuthPasswordValueObject } from '@/auth-context/auth/domain/value-objects/auth-password/auth-password.vo';
import { AuthPhoneNumberValueObject } from '@/auth-context/auth/domain/value-objects/auth-phone-number/auth-phone-number.vo';
import { AuthProviderIdValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider-id/auth-provider-id.vo';
import { AuthProviderValueObject } from '@/auth-context/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthTwoFactorEnabledValueObject } from '@/auth-context/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { AuthUpdatedAtValueObject } from '@/auth-context/auth/domain/value-objects/auth-updated-at/auth-updated-at.vo';
import { AuthCreatedEvent } from '@/shared/domain/events/auth/auth-created/auth-created.event';
import { AuthDeletedEvent } from '@/shared/domain/events/auth/auth-deleted/auth-deleted.event';
import { AuthUpdatedLastLoginAtEvent } from '@/shared/domain/events/auth/auth-updated-last-login-at/auth-updated-last-login-at.event';
import { AuthUpdatedEvent } from '@/shared/domain/events/auth/auth-updated/auth-updated.event';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { AggregateRoot } from '@nestjs/cqrs';

export class AuthAggregate extends AggregateRoot {
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
  private _createdAt: AuthCreatedAtValueObject;
  private _updatedAt: AuthUpdatedAtValueObject;

  constructor(props: IAuthCreateDto, generateEvent: boolean = true) {
    super();

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
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    // 02: Apply the creation event
    if (generateEvent) {
      this.apply(
        new AuthCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: AuthAggregate.name,
            eventType: AuthCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
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

    this._updatedAt = new AuthUpdatedAtValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new AuthUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: AuthAggregate.name,
            eventType: AuthUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  public updateLastLoginAt(
    lastLoginAt: AuthLastLoginAtValueObject,
    generateEvent: boolean = true,
  ) {
    this._lastLoginAt = lastLoginAt;

    if (generateEvent) {
      this.apply(
        new AuthUpdatedLastLoginAtEvent(
          {
            aggregateId: this._id.value,
            aggregateType: AuthAggregate.name,
            eventType: AuthUpdatedLastLoginAtEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the auth.
   *
   * @param generateEvent - Whether to generate the auth deleted event. Default is true.
   */
  public delete(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new AuthDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: AuthAggregate.name,
            eventType: AuthDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

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

  public get createdAt(): AuthCreatedAtValueObject {
    return this._createdAt;
  }

  public get updatedAt(): AuthUpdatedAtValueObject {
    return this._updatedAt;
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
      phoneNumber: this._phoneNumber ? this._phoneNumber.value : null,
      lastLoginAt: this._lastLoginAt ? this._lastLoginAt.value : null,
      password: this._password ? this._password.value : null,
      provider: this._provider.value,
      providerId: this._providerId ? this._providerId.value : null,
      twoFactorEnabled: this._twoFactorEnabled.value,
      createdAt: this._createdAt.value,
      updatedAt: this._updatedAt.value,
    };
  }
}
