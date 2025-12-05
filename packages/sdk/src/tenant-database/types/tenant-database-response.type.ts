import type { TenantDatabaseStatus } from './tenant-database-status.type.js';

export type TenantDatabaseResponse = {
  id: string;
  tenantId?: string;
  databaseName?: string;
  readDatabaseName?: string;
  status?: TenantDatabaseStatus;
  schemaVersion?: string;
  lastMigrationAt?: Date;
  errorMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
