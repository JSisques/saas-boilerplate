import { SharedModule } from '@/shared/shared.module';
import { TenantModule } from '@/tenant-context/tenants/tenant.module';
import { Module } from '@nestjs/common';

const MODULES = [TenantModule];

@Module({
  imports: [SharedModule, ...MODULES],
  controllers: [],
  providers: [],
  exports: [...MODULES],
})
export class TenantContextModule {}
