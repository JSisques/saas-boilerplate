import { ITenantCreateCommandDto } from '@/tenant-context/tenants/application/dtos/commands/tenant-create/tenant-create-command.dto';

/**
 * Data Transfer Object for updating a tenant via command layer.
 *
 * @interface ITenantUpdateCommandDto
 * @property {string} id - The id of the tenant to update.
 * @extends Partial<ITenantCreateCommandDto>
 */
export interface ITenantUpdateCommandDto
  extends Partial<ITenantCreateCommandDto> {
  id: string;
  status: string;
}
