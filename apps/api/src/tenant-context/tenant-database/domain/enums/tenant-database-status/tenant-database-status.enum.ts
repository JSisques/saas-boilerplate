/**
 * TenantMemberRoleEnum represents the role of a tenant member.
 * PROVISIONING: The database is being provisioned.
 * ACTIVE: The database is active.
 * FAILED: The database has failed.
 * SUSPENDED: The database is suspended.
 */
export enum TenantDatabaseStatusEnum {
  PROVISIONING = 'PROVISIONING',
  ACTIVE = 'ACTIVE',
  FAILED = 'FAILED',
  SUSPENDED = 'SUSPENDED',
}
