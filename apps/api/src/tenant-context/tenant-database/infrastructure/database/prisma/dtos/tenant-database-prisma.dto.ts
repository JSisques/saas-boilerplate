import { TenantDatabaseStatusEnum } from '@/prisma/master/client';
import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';

export type TenantDatabasePrismaDto = BasePrismaDto & {
  id: string;
  tenantId: string;
  databaseName: string;
  readDatabaseName: string;
  status: TenantDatabaseStatusEnum;
  schemaVersion: string | null;
  lastMigrationAt: Date | null;
  errorMessage: string | null;
};
