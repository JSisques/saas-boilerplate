/**
 * Tenant member creation view model Data Transfer Object.
 *
 * Represents the structure of data returned when a tenant member is created, tailored for presentation layers.
 *
 * @interface ITenantMemberCreateViewModelDto
 * @property {string} id - The unique, immutable identifier of the tenant.
 * @property {string} userId - The unique identifier of the user.
 * @property {string} role - The role of the tenant member.
 * @property {Date} createdAt - Timestamp when the tenant member was created.
 * @property {Date} updatedAt - Timestamp when the tenant member was last updated.
 */
export interface ITenantMemberCreateViewModelDto {
  id: string;
  userId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
