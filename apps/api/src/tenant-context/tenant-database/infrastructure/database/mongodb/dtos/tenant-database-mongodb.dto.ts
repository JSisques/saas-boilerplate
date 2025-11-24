export type TenantDatabaseMongoDbDto = {
  id: string;
  tenantId: string;
  databaseName: string;
  databaseUrl: string;
  status: string;
  schemaVersion: string | null;
  lastMigrationAt: Date | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
};
