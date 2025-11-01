import { IAuthCreateViewModelDto } from '@/auth-context/auth/domain/dtos/view-models/auth-create/auth-create-view-model.dto';
import { IAuthUpdateViewModelDto } from '@/auth-context/auth/domain/dtos/view-models/auth-update/auth-update-view-model.dto';

/**
 * This class is used to represent a user view model.
 */
export class AuthViewModel {
  private readonly _id: string;
  private readonly _userId: string;
  private _email: string | null;
  private _emailVerified: boolean;
  private _phoneNumber: string | null;
  private _lastLoginAt: Date | null;
  private _password: string | null;
  private _provider: string;
  private _providerId: string | null;
  private _twoFactorEnabled: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: IAuthCreateViewModelDto) {
    this._id = props.id;
    this._userId = props.userId;
    this._email = props.email;
    this._emailVerified = props.emailVerified;
    this._phoneNumber = props.phoneNumber;
    this._lastLoginAt = props.lastLoginAt;
    this._password = props.password;
    this._provider = props.provider;
    this._providerId = props.providerId;
    this._twoFactorEnabled = props.twoFactorEnabled;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public get id(): string {
    return this._id;
  }

  public get userId(): string {
    return this._userId;
  }

  public get email(): string | null {
    return this._email;
  }

  public get emailVerified(): boolean {
    return this._emailVerified;
  }

  public get phoneNumber(): string | null {
    return this._phoneNumber;
  }

  public get lastLoginAt(): Date | null {
    return this._lastLoginAt;
  }

  public get password(): string | null {
    return this._password;
  }

  public get provider(): string {
    return this._provider;
  }

  public get providerId(): string | null {
    return this._providerId;
  }

  public get twoFactorEnabled(): boolean {
    return this._twoFactorEnabled;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Updates the auth view model with new data
   *
   * @param updateData - The data to update
   * @returns A new AuthViewModel instance with updated data
   */
  public update(updateData: IAuthUpdateViewModelDto) {
    this._email =
      updateData.email !== undefined ? updateData.email : this._email;
    this._emailVerified =
      updateData.emailVerified !== undefined
        ? updateData.emailVerified
        : this._emailVerified;
    this._lastLoginAt =
      updateData.lastLoginAt !== undefined
        ? updateData.lastLoginAt
        : this._lastLoginAt;
    this._password =
      updateData.password !== undefined ? updateData.password : this._password;
    this._provider =
      updateData.provider !== undefined ? updateData.provider : this._provider;
    this._providerId =
      updateData.providerId !== undefined
        ? updateData.providerId
        : this._providerId;
    this._twoFactorEnabled =
      updateData.twoFactorEnabled !== undefined
        ? updateData.twoFactorEnabled
        : this._twoFactorEnabled;
    this._updatedAt = new Date();
  }
}
