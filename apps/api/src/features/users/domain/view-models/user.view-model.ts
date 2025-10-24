import { IUserCreateViewModelDto } from '@/features/users/domain/dtos/view-models/user-create/user-create-view-model.dto';
import { IUserUpdateViewModelDto } from '@/features/users/domain/dtos/view-models/user-update/user-update-view-model.dto';

/**
 * This class is used to represent a user view model.
 */
export class UserViewModel {
  private readonly _id: string;
  private _name: string;
  private _bio: string | null;
  private _avatar: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: IUserCreateViewModelDto) {
    this._id = props.id;
    this._name = props.name;
    this._bio = props.bio;
    this._avatar = props.avatar;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string | null {
    return this._name;
  }

  public get bio(): string | null {
    return this._bio;
  }

  public get avatar(): string | null {
    return this._avatar;
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
    this._name = updateData.name ?? this._name;
    this._bio = updateData.bio ?? this._bio;
    this._avatar = updateData.avatar ?? this._avatar;
    this._updatedAt = new Date();
  }
}
