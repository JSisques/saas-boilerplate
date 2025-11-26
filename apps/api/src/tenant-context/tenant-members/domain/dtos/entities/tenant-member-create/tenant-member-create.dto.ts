import { IBaseAggregateDto } from '@/shared/domain/interfaces/base-aggregate-dto.interface';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';

/**
 * Interface representing the structure required to create a new tenant member entity.
 *
 * @interface ITenantMemberCreateDto
 * @property {TenantMemberUuidValueObject} id - The unique identifier for the tenant member.
 * @property {TenantUuidValueObject} tenantId - The unique identifier for the tenant.
 * @property {UserUuidValueObject} userId - The unique identifier for the user.
 * @property {TenantMemberRoleValueObject} role - The role of the tenant member.
 * @property {DateValueObject} createdAt - The created at of the tenant member.
 * @property {DateValueObject} updatedAt - The updated at of the tenant member.
 */
export interface ITenantMemberCreateDto extends IBaseAggregateDto {
  id: TenantMemberUuidValueObject;
  tenantId: TenantUuidValueObject;
  userId: UserUuidValueObject;
  role: TenantMemberRoleValueObject;
}
