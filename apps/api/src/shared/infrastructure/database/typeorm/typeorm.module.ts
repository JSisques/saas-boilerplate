import { TypeormTenantFactory } from '@/shared/infrastructure/database/typeorm/factories/typeorm-tenant-factory/typeorm-tenant-factory.service';
import { TenantDatabaseMigrationTypeormService } from '@/shared/infrastructure/database/typeorm/services/tenant-database-migration/tenant-database-migration-typeorm.service';
import { TenantDatabaseProvisioningTypeormService } from '@/shared/infrastructure/database/typeorm/services/tenant-database-provisioning/tenant-database-provisioning-typeorm.service';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TypeormTenantService } from '@/shared/infrastructure/database/typeorm/services/typeorm-tenant/typeorm-tenant.service';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';

const SERVICES = [
  TypeormMasterService,
  TypeormTenantService,
  TypeormTenantFactory,
  TenantDatabaseProvisioningTypeormService,
  TenantDatabaseMigrationTypeormService,
];

@Global()
@Module({
  imports: [
    NestTypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
  ],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class TypeOrmModule {}
