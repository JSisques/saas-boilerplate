/**
 * Data Transfer Object for adding a tenant member via command layer.
 *
 * @interface ITenantMemberAddCommandDto
 * @property {string} tenantId - The id of the tenant. Must be provided.
 * @property {string} userId - The id of the user. Must be provided.
 * @property {string} role - The role of the tenant member. Must be provided.
 */
export interface ITenantMemberAddCommandDto {
  tenantId: string;
  userId: string;
  role: string;
}
