import { ITenantDatabaseCreateViewModelDto } from '@/tenant-context/tenant-database/domain/dtos/view-models/tenant-database-create/tenant-database-create-view-model.dto';

/**
 * Data Transfer Object for updating a tenant database view model.
 *
 * @type ITenantDatabaseUpdateViewModelDto
 * @property {string} databaseName - The name of the tenant database for write operations.
 * @property {string} readDatabaseName - The name of the tenant database for read operations.
 * @property {string} status - The status of the tenant database.
 * @property {string} schemaVersion - The schema version of the tenant database.
 * @property {Date} lastMigrationAt - The last migration at of the tenant database.
 * @property {string} errorMessage - The error message of the tenant database.
 */
export type ITenantDatabaseUpdateViewModelDto = Partial<
  Omit<
    ITenantDatabaseCreateViewModelDto,
    'id' | 'tenantId' | 'createdAt' | 'updatedAt'
  >
>;
