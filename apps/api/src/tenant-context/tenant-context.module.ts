import { SharedModule } from '@/shared/shared.module';
import { TenantDatabaseModule } from '@/tenant-context/tenant-database/tenant-database.module';
import { TenantMemberModule } from '@/tenant-context/tenant-members/tenant-members.module';
import { TenantModule } from '@/tenant-context/tenants/tenant.module';
import { Module } from '@nestjs/common';

const MODULES = [TenantModule, TenantMemberModule, TenantDatabaseModule];

@Module({
  imports: [SharedModule, ...MODULES],
  controllers: [],
  providers: [],
  exports: [...MODULES],
})
export class TenantContextModule {}
