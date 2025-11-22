import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { TenantMemberCreatedAtValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-created-at/tenant-member-created-at.vo';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';
import { TenantMemberUpdatedAtValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-updated-at/tenant-member-updated-at.vo';

/**
 * Interface representing the structure required to create a new tenant member entity.
 *
 * @interface ITenantMemberCreateDto
 * @property {TenantMemberUuidValueObject} id - The unique identifier for the tenant member.
 * @property {TenantUuidValueObject} tenantId - The unique identifier for the tenant.
 * @property {UserUuidValueObject} userId - The unique identifier for the user.
 * @property {TenantMemberRoleValueObject} role - The role of the tenant member.
 * @property {TenantMemberCreatedAtValueObject} createdAt - The created at of the tenant member.
 * @property {TenantMemberUpdatedAtValueObject} updatedAt - The updated at of the tenant member.
 */
export interface ITenantMemberCreateDto {
  id: TenantMemberUuidValueObject;
  tenantId: TenantUuidValueObject;
  userId: UserUuidValueObject;
  role: TenantMemberRoleValueObject;
  createdAt: TenantMemberCreatedAtValueObject;
  updatedAt: TenantMemberUpdatedAtValueObject;
}
