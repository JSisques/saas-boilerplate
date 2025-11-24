import { PrismaTenantFactory } from '@/shared/infrastructure/database/prisma/factories/prisma-tenant-factory/prisma-tenant-factory.service';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { PrismaTenantService } from '@/shared/infrastructure/database/prisma/services/prisma-tenant/prisma-tenant.service';
import { TenantDatabaseMigrationService } from '@/shared/infrastructure/database/prisma/services/tenant-database-migration/tenant-database-migration.service';
import { TenantDatabaseProvisioningService } from '@/shared/infrastructure/database/prisma/services/tenant-database-provisioning/tenant-database-provisioning.service';
import { Global, Module } from '@nestjs/common';

const SERVICES = [
  PrismaMasterService,
  PrismaTenantService,
  TenantDatabaseProvisioningService,
  TenantDatabaseMigrationService,
];

const FACTORIES = [PrismaTenantFactory];

@Global()
@Module({
  providers: [...SERVICES, ...FACTORIES],
  exports: [...SERVICES, ...FACTORIES],
})
export class PrismaModule {}
