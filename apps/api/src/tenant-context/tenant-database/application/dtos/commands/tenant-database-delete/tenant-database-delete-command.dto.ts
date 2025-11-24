/**
 * Data Transfer Object for deleting a tenant database via command layer.
 *
 * @interface ITenantDatabaseDeleteCommandDto
 * @property {string} id - The id of the tenant database to delete.
 */
export interface ITenantDatabaseDeleteCommandDto {
  id: string;
}
