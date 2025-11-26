import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface ITenantDatabaseEventData extends IBaseEventData {
  id: string;
  tenantId: string;
  databaseName: string;
  readDatabaseName: string;
  status: string;
  schemaVersion: string | null;
  lastMigrationAt: Date | null;
  errorMessage: string | null;
}
