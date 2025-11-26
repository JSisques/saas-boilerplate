import { IUserCreateViewModelDto } from "@/user-context/users/domain/dtos/view-models/user-create/user-create-view-model.dto";
import { IUserUpdateViewModelDto } from "@/user-context/users/domain/dtos/view-models/user-update/user-update-view-model.dto";

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
    this._avatarUrl = props.avatarUrl;
    this._bio = props.bio;
    this._lastName = props.lastName;
    this._name = props.name;
    this._role = props.role;
    this._status = props.status;
    this._userName = props.userName;
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
   */
  public update(updateData: IUserUpdateViewModelDto) {
    this._avatarUrl =
      updateData.avatarUrl !== undefined
        ? updateData.avatarUrl
        : this._avatarUrl;
    this._bio = updateData.bio !== undefined ? updateData.bio : this._bio;
    this._lastName =
      updateData.lastName !== undefined ? updateData.lastName : this._lastName;
    this._name = updateData.name !== undefined ? updateData.name : this._name;
    this._role = updateData.role !== undefined ? updateData.role : this._role;
    this._status =
      updateData.status !== undefined ? updateData.status : this._status;
    this._userName =
      updateData.userName !== undefined ? updateData.userName : this._userName;
    this._updatedAt = new Date();
  }
}
