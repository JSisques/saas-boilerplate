import { ITenantDatabaseCreateCommandDto } from '@/tenant-context/tenant-database/application/dtos/commands/tenant-database-create/tenant-database-create-command.dto';

/**
 * Data Transfer Object for updating a tenant database via command layer.
 *
 * @interface ITenantDatabaseUpdateCommandDto
 * @property {string} id - The id of the tenant database to update.
 * @extends Partial<ITenantDatabaseCreateCommandDto>
 */
export interface ITenantDatabaseUpdateCommandDto
  extends Partial<Omit<ITenantDatabaseCreateCommandDto, 'tenantId'>> {
  id: string;
  databaseName: string;
  databaseUrl: string;
  status: string;
  schemaVersion: string;
  lastMigrationAt: Date;
  errorMessage: string;
}
