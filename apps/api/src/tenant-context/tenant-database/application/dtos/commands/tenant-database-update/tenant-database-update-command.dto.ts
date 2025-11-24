/**
 * Data Transfer Object for updating a tenant database via command layer.
 *
 * @interface ITenantDatabaseUpdateCommandDto
 * @property {string} id - The id of the tenant database to update.
 * All other fields are optional for partial updates.
 */
export interface ITenantDatabaseUpdateCommandDto {
  id: string;
  databaseName?: string;
  databaseUrl?: string;
  status?: string;
  schemaVersion?: string;
  lastMigrationAt?: Date;
  errorMessage?: string;
}
