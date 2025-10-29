/**
 * Data Transfer Object for removing a tenant member via command layer.
 *
 * @interface ITenantMemberRemoveCommandDto
 * @property {string} id - The id of the tenant member to remove.
 */
export interface ITenantMemberRemoveCommandDto {
  id: string;
}
