import { MongoTenantFactory } from '@/shared/infrastructure/database/mongodb/factories/mongo-tenant-factory/mongo-tenant-factory.service';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { MongoTenantService } from '@/shared/infrastructure/database/mongodb/services/mongo-tenant/mongo-tenant.service';
import { TenantDatabaseUrlBuilderService } from '@/shared/infrastructure/database/mongodb/services/tenant-database-url-builder/tenant-database-url-builder.service';
import { Global, Module } from '@nestjs/common';

const SERVICES = [
  MongoMasterService,
  MongoTenantService,
  TenantDatabaseUrlBuilderService,
];

const FACTORIES = [MongoTenantFactory];

@Global()
@Module({
  providers: [...SERVICES, ...FACTORIES],
  exports: [...SERVICES, ...FACTORIES],
})
export class MongoModule {}
