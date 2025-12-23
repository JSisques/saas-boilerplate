import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TenantQuerySubscriber } from '@/shared/infrastructure/database/typeorm/subscribers/tenant-query.subscriber';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';

const SERVICES = [TypeormMasterService];
const SUBSCRIBERS = [TenantQuerySubscriber];

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
        subscribers: [TenantQuerySubscriber],
      }),
    }),
  ],
  providers: [...SERVICES, ...SUBSCRIBERS],
  exports: [...SERVICES],
})
export class TypeOrmModule {}
