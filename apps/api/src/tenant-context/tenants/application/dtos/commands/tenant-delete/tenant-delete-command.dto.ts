/**
 * Data Transfer Object for deleting a tenant via command layer.
 *
 * @interface ITenantDeleteCommandDto
 * @property {string} id - The id of the tenant to delete.
 */
export interface ITenantDeleteCommandDto {
  id: string;
}
