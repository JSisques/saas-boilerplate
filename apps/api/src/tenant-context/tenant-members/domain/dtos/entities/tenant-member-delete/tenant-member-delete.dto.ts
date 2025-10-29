import { ITenantMemberCreateDto } from '@/tenant-context/tenant-members/domain/dtos/entities/tenant-member-create/tenant-member-create.dto';

/**
 * Data Transfer Object for deleting a tenant member.
 *
 * Allows deleting a tenant member entity by specifying only the tenant member's immutable identifier (`id`).
 * @interface ITenantMemberDeleteDto
 * @property {TenantMemberUuidValueObject} id - The immutable identifier of the tenant member to delete.
 */
export interface ITenantMemberDeleteDto
  extends Pick<ITenantMemberCreateDto, 'id'> {}
