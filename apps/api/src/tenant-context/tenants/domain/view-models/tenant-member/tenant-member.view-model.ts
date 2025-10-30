import { ITenantMemberCreateViewModelDto } from '@/tenant-context/tenants/domain/dtos/view-models/tenant-members/tenant-member-create/tenant-member-create-view-model.dto';
import { ITenantMemberUpdateViewModelDto } from '@/tenant-context/tenants/domain/dtos/view-models/tenant-members/tenant-member-update/tenant-member-update-view-model.dto';

/**
 * This class is used to represent a tenant view model.
 */
export class TenantMemberViewModel {
  private readonly _id: string;
  private _userId: string;
  private _role: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ITenantMemberCreateViewModelDto) {
    this._id = props.id;
    this._userId = props.userId;
    this._role = props.role;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Updates the tenant view model with new data
   *
   * @param updateData - The data to update
   * @returns A new TenantViewModel instance with updated data
   */
  public update(updateData: ITenantMemberUpdateViewModelDto) {
    this._role = updateData.role !== undefined ? updateData.role : this._role;
    this._updatedAt = new Date();
  }

  /**
   * Gets the unique identifier of the tenant.
   * @returns {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Gets the user id of the tenant member.
   * @returns {string}
   */
  get userId(): string {
    return this._userId;
  }
  /**
   * Gets the role of the tenant member.
   * @returns {string}
   */
  get role(): string {
    return this._role;
  }

  /**
   * Gets the creation timestamp of the tenant member.
   * @returns {Date}
   */
  get createdAt(): Date {
    return this._createdAt;
  }
  /**
   * Gets the last updated timestamp of the tenant member.
   * @returns {Date}
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
