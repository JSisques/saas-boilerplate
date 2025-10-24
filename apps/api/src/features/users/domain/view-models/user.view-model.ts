import { IUserCreateViewModelDto } from '@/features/users/domain/dtos/view-models/user-create/user-create-view-model.dto';
import { IUserUpdateViewModelDto } from '@/features/users/domain/dtos/view-models/user-update/user-update-view-model.dto';

/**
 * This class is used to represent a user view model.
 */
export class UserViewModel {
  private readonly _id: string;
  private _avatarUrl: string | null;
  private _bio: string | null;
  private _lastName: string | null;
  private _name: string | null;
  private _role: string;
  private _status: string;
  private _userName: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: IUserCreateViewModelDto) {
    this._id = props.id;
    this._userName = props.userName;
    this._name = props.name;
    this._lastName = props.lastName;
    this._bio = props.bio;
    this._avatarUrl = props.avatarUrl;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public get id(): string {
    return this._id;
  }

  public get userName(): string | null {
    return this._userName;
  }

  public get lastName(): string | null {
    return this._lastName;
  }

  public get name(): string | null {
    return this._name;
  }

  public get role(): string {
    return this._role;
  }

  public get status(): string {
    return this._status;
  }

  public get bio(): string | null {
    return this._bio;
  }

  public get avatarUrl(): string | null {
    return this._avatarUrl;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Updates the user view model with new data
   *
   * @param updateData - The data to update
   * @returns A new UserViewModel instance with updated data
   */
  public update(updateData: IUserUpdateViewModelDto) {
    this._userName = updateData.userName ?? this._userName;
    this._name = updateData.name ?? this._name;
    this._lastName = updateData.lastName ?? this._lastName;
    this._bio = updateData.bio ?? this._bio;
    this._avatarUrl = updateData.avatarUrl ?? this._avatarUrl;
    this._role = updateData.role ?? this._role;
    this._status = updateData.status ?? this._status;
    this._updatedAt = new Date();
  }
}
