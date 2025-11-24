/**
 * TenantDatabaseStatusEnum represents the status of a tenant database.
 * PROVISIONING: The database is being provisioned.
 * ACTIVE: The database is active and ready to use.
 * MIGRATING: The database is currently running migrations.
 * FAILED: The database has failed.
 * SUSPENDED: The database is suspended.
 */
export enum TenantDatabaseStatusEnum {
  PROVISIONING = 'PROVISIONING',
  ACTIVE = 'ACTIVE',
  MIGRATING = 'MIGRATING',
  FAILED = 'FAILED',
  SUSPENDED = 'SUSPENDED',
}
