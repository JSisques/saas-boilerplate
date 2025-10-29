import { ITenantCreateViewModelDto } from '@/tenant-context/tenants/domain/dtos/view-models/tenant-create/tenant-create-view-model.dto';

/**
 * Data Transfer Object for deleting a tenant view model.
 *
 * @interface ITenantDeleteViewModelDto
 * @property {string} id - The unique identifier of the tenant.
 */
export interface ITenantDeleteViewModelDto
  extends Pick<ITenantCreateViewModelDto, 'id'> {}
