import type { TenantDatabaseStatus } from './tenant-database-status.type.js';

export type TenantDatabaseUpdateInput = {
  id: string;
  databaseName?: string;
  databaseUrl?: string;
  status?: TenantDatabaseStatus;
  schemaVersion?: string;
  lastMigrationAt?: Date;
  errorMessage?: string;
};
