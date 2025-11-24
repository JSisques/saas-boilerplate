import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';
import { TenantDatabaseStatusEnum } from '@prisma/client';

export type TenantDatabasePrismaDto = BasePrismaDto & {
  id: string;
  tenantId: string;
  databaseName: string;
  databaseUrl: string;
  status: TenantDatabaseStatusEnum;
  schemaVersion: string | null;
  lastMigrationAt: Date | null;
  errorMessage: string | null;
};
