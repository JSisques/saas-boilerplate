import { UserCreatedEvent } from '@/shared/domain/events/users/user-created/user-created.event';
import { UserDeletedEvent } from '@/shared/domain/events/users/user-deleted/user-deleted.event';
import { UserUpdatedEvent } from '@/shared/domain/events/users/user-updated/user-updated.event';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { IUserCreateDto } from '@/user-context/users/domain/dtos/entities/user-create/user-create.dto';
import { IUserUpdateDto } from '@/user-context/users/domain/dtos/entities/user-update/user-update.dto';
import { UserPrimitives } from '@/user-context/users/domain/primitives/user.primitives';
import { UserAvatarUrlValueObject } from '@/user-context/users/domain/value-objects/user-avatar-url/user-avatar-url.vo';
import { UserBioValueObject } from '@/user-context/users/domain/value-objects/user-bio/user-bio.vo';
import { UserCreatedAtValueObject } from '@/user-context/users/domain/value-objects/user-created-at/user-created-at.vo';
import { UserLastNameValueObject } from '@/user-context/users/domain/value-objects/user-last-name/user-last-name.vo';
import { UserNameValueObject } from '@/user-context/users/domain/value-objects/user-name/user-name.vo';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUpdatedAtValueObject } from '@/user-context/users/domain/value-objects/user-updated-at/user-updated-at.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';
import { AggregateRoot } from '@nestjs/cqrs';

export class UserAggregate extends AggregateRoot {
  private readonly _id: UserUuidValueObject;
  private _avatarUrl: UserAvatarUrlValueObject | null;
  private _bio: UserBioValueObject | null;
  private _lastName: UserLastNameValueObject | null;
  private _name: UserNameValueObject | null;
  private _role: UserRoleValueObject;
  private _status: UserStatusValueObject;
  private _userName: UserUserNameValueObject | null;
  private _createdAt: UserCreatedAtValueObject;
  private _updatedAt: UserUpdatedAtValueObject;

  constructor(props: IUserCreateDto, generateEvent: boolean = true) {
    super();

    // 01: Set the properties
    this._id = props.id;
    this._avatarUrl = props.avatarUrl;
    this._bio = props.bio;
    this._lastName = props.lastName;
    this._name = props.name;
    this._role = props.role;
    this._status = props.status;
    this._userName = props.userName;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    // 02: Apply the creation event
    if (generateEvent) {
      this.apply(
        new UserCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: UserAggregate.name,
            eventType: UserCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Update the user.
   *
   * @param props - The properties to update the user.
   * @param props.name - The name of the user.
   * @param props.bio - The bio of the user.
   * @param props.avatar - The avatar of the user.
   */
  public update(props: IUserUpdateDto, generateEvent: boolean = true) {
    // 01: Update the properties
    // Use explicit null/undefined check: if value is explicitly passed (including null), update it
    this._avatarUrl =
      props.avatarUrl !== undefined ? props.avatarUrl : this._avatarUrl;
    this._bio = props.bio !== undefined ? props.bio : this._bio;
    this._lastName =
      props.lastName !== undefined ? props.lastName : this._lastName;
    this._name = props.name !== undefined ? props.name : this._name;
    this._role = props.role !== undefined ? props.role : this._role;
    this._status = props.status !== undefined ? props.status : this._status;
    this._userName =
      props.userName !== undefined ? props.userName : this._userName;

    this._updatedAt = new UserUpdatedAtValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new UserUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: UserAggregate.name,
            eventType: UserUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the user.
   *
   * @param generateEvent - Whether to generate the user deleted event. Default is true.
   */
  public delete(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new UserDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: UserAggregate.name,
            eventType: UserDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Get the id of the user.
   *
   * @returns The id of the user.
   */
  public get id(): UserUuidValueObject {
    return this._id;
  }

  /**
   * Get the user name of the user.
   *
   * @returns The user name of the user.
   */
  public get userName(): UserUserNameValueObject {
    return this._userName;
  }

  /**
   * Get the last name of the user.
   *
   * @returns The last name of the user.
   */
  public get lastName(): UserLastNameValueObject | null {
    return this._lastName;
  }
  /**
   * Get the name of the user.
   *
   * @returns The name of the user.
   */
  public get name(): UserNameValueObject | null {
    return this._name;
  }

  /**
   * Get the bio of the user.
   *
   * @returns The bio of the user.
   */
  public get bio(): UserBioValueObject | null {
    return this._bio;
  }

  /**
   * Get the avatar of the user.
   *
   * @returns The avatar of the user.
   */
  public get avatarUrl(): UserAvatarUrlValueObject | null {
    return this._avatarUrl;
  }

  /**
   * Get the role of the user.
   *
   * @returns The role of the user.
   */
  public get role(): UserRoleValueObject {
    return this._role;
  }

  /**
   * Get the status of the user.
   *
   * @returns The status of the user.
   */
  public get status(): UserStatusValueObject {
    return this._status;
  }

  /**
   * Get the created at of the user.
   *
   * @returns The created at of the user.
   */
  public get createdAt(): UserCreatedAtValueObject {
    return this._createdAt;
  }
  /**
   * Get the updated at of the user.
   *
   * @returns The updated at of the user.
   */
  public get updatedAt(): UserUpdatedAtValueObject {
    return this._updatedAt;
  }

  /**
   * Convert the user aggregate to primitives.
   *
   * @returns The primitives of the user.
   */
  public toPrimitives(): UserPrimitives {
    return {
      id: this._id.value,
      avatarUrl: this._avatarUrl ? this._avatarUrl.value : null,
      bio: this._bio ? this._bio.value : null,
      lastName: this._lastName ? this._lastName.value : null,
      name: this._name ? this._name.value : null,
      role: this._role.value,
      status: this._status.value,
      userName: this._userName ? this._userName.value : null,
      createdAt: this._createdAt.value,
      updatedAt: this._updatedAt.value,
    };
  }
}
