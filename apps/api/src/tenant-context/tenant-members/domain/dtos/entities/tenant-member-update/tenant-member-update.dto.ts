import { ITenantMemberCreateDto } from '@/tenant-context/tenant-members/domain/dtos/entities/tenant-member-create/tenant-member-create.dto';

/**
 * Data Transfer Object for updating a tenant member.
 *
 * Allows partial updating of a tenant member entity, excluding the tenant member's immutable identifier (`id`).
 * @type ITenantMemberUpdateDto
 * @extends Partial<Omit<ITenantMemberCreateDto, 'id'>>
 */
export type ITenantMemberUpdateDto = Partial<
  Omit<ITenantMemberCreateDto, 'id'>
>;
