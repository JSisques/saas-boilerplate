/**
 * Data Transfer Object for creating a tenant database via command layer.
 *
 * @interface ITenantDatabaseCreateCommandDto
 * @property {string} tenantId - The id of the tenant. Must be provided.
 */
export interface ITenantDatabaseCreateCommandDto {
  tenantId: string;
  databaseName: string;
}
