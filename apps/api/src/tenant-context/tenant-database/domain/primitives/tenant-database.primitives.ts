import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type TenantDatabasePrimitives = BasePrimitives & {
  id: string;
  tenantId: string;
  databaseName: string;
  databaseUrl: string;
  status: string;
  schemaVersion: string | null;
  lastMigrationAt: Date | null;
  errorMessage: string | null;
};
