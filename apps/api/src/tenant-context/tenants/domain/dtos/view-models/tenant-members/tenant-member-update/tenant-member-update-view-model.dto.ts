import { ITenantMemberCreateViewModelDto } from '@/tenant-context/tenant-members/domain/dtos/view-models/tenant-member-create/tenant-member-create-view-model.dto';

/**
 * Data Transfer Object for updating a tenant member view model.
 *
 * @type ITenantMemberUpdateViewModelDto
 * @property {string} role - The role of the tenant member.
 */
export type ITenantMemberUpdateViewModelDto = Partial<
  Omit<
    ITenantMemberCreateViewModelDto,
    'id' | 'userId' | 'createdAt' | 'updatedAt'
  >
>;
