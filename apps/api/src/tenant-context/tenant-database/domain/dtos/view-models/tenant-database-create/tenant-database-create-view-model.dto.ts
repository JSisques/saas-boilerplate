/**
 * Tenant database creation view model Data Transfer Object.
 *
 * Represents the structure of data returned when a tenant database is created, tailored for presentation layers.
 *
 * @interface ITenantDatabaseCreateViewModelDto
 * @property {string} id - The unique, immutable identifier of the tenant.
 * @property {string} tenantId - The unique identifier of the tenant.
 * @property {string} databaseName - The name of the tenant database for write operations.
 * @property {string} readDatabaseName - The name of the tenant database for read operations.
 * @property {string} status - The status of the tenant database.
 * @property {string | null} schemaVersion - The schema version of the tenant database.
 * @property {Date | null} lastMigrationAt - The last migration at of the tenant database.
 * @property {string | null} errorMessage - The error message of the tenant database.
 * @property {Date} createdAt - Timestamp when the tenant database was created.
 * @property {Date} updatedAt - Timestamp when the tenant database was last updated.
 */
export interface ITenantDatabaseCreateViewModelDto {
  id: string;
  tenantId: string;
  databaseName: string;
  readDatabaseName: string;
  status: string;
  schemaVersion: string | null;
  lastMigrationAt: Date | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}
