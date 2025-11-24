import { ITenantDatabaseCreateViewModelDto } from '@/tenant-context/tenant-database/domain/dtos/view-models/tenant-database-create/tenant-database-create-view-model.dto';

/**
 * Data Transfer Object for deleting a tenant database view model.
 *
 * @type ITenantDatabaseDeleteViewModelDto
 * @property {string} id - The unique identifier of the tenant database.
 */
export type ITenantDatabaseDeleteViewModelDto = Pick<
  ITenantDatabaseCreateViewModelDto,
  'id'
>;
