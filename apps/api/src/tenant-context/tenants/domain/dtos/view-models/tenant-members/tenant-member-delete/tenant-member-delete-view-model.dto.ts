import { ITenantMemberCreateViewModelDto } from '@/tenant-context/tenant-members/domain/dtos/view-models/tenant-member-create/tenant-member-create-view-model.dto';

/**
 * Data Transfer Object for deleting a tenant member view model.
 *
 * @interface ITenantMemberDeleteViewModelDto
 * @property {string} id - The unique identifier of the tenant member.
 */
export interface ITenantMemberDeleteViewModelDto
  extends Pick<ITenantMemberCreateViewModelDto, 'id'> {}
