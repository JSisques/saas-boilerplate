import { UserUuidValueObject } from "@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo";
import { IUserCreateDto } from "@/user-context/users/domain/dtos/entities/user-create/user-create.dto";
import { IUserUpdateDto } from "@/user-context/users/domain/dtos/entities/user-update/user-update.dto";
import { UserPrimitives } from "@/user-context/users/domain/primitives/user.primitives";
import { UserAvatarUrlValueObject } from "@/user-context/users/domain/value-objects/user-avatar-url/user-avatar-url.vo";
import { UserBioValueObject } from "@/user-context/users/domain/value-objects/user-bio/user-bio.vo";
import { UserLastNameValueObject } from "@/user-context/users/domain/value-objects/user-last-name/user-last-name.vo";
import { UserNameValueObject } from "@/user-context/users/domain/value-objects/user-name/user-name.vo";
import { UserRoleValueObject } from "@/user-context/users/domain/value-objects/user-role/user-role.vo";
import { UserStatusValueObject } from "@/user-context/users/domain/value-objects/user-status/user-status.vo";
import { UserUserNameValueObject } from "@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo";

/**
 * User Aggregate
 * Represents the user domain entity without event sourcing complexity
 */
export class UserAggregate {
  private readonly _id: UserUuidValueObject;
  private _avatarUrl: UserAvatarUrlValueObject | null;
  private _bio: UserBioValueObject | null;
  private _lastName: UserLastNameValueObject | null;
  private _name: UserNameValueObject | null;
  private _role: UserRoleValueObject;
  private _status: UserStatusValueObject;
  private _userName: UserUserNameValueObject | null;

  constructor(props: IUserCreateDto) {
    // Set the properties
    this._id = props.id;
    this._avatarUrl = props.avatarUrl ?? null;
    this._bio = props.bio ?? null;
    this._lastName = props.lastName ?? null;
    this._name = props.name ?? null;
    this._role = props.role ?? new UserRoleValueObject("USER");
    this._status = props.status ?? new UserStatusValueObject("ACTIVE");
    this._userName = props.userName ?? null;
  }

  /**
   * Update the user.
   *
   * @param props - The properties to update the user.
   */
  public update(props: IUserUpdateDto) {
    // Update the properties
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
  public get userName(): UserUserNameValueObject | null {
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
    };
  }
}
