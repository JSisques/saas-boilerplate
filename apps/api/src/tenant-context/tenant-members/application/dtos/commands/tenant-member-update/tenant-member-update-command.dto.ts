import { ITenantMemberAddCommandDto } from '@/tenant-context/tenant-members/application/dtos/commands/tenant-member-add/tenant-member-add-command.dto';

/**
 * Data Transfer Object for updating a tenant member via command layer.
 *
 * @interface ITenantMemberUpdateCommandDto
 * @property {string} id - The id of the tenant member to update.
 * @extends Partial<ITenantMemberAddCommandDto>
 */
export interface ITenantMemberUpdateCommandDto
  extends Partial<Omit<ITenantMemberAddCommandDto, 'tenantId' | 'userId'>> {
  id: string;
}
