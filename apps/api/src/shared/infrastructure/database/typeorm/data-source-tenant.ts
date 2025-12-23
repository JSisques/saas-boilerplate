import { StorageTypeormEntity } from '@/storage-context/storage/infrastructure/database/typeorm/entities/storage-typeorm.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

/**
 * DataSource configuration for tenant databases
 * This is used by TypeORM CLI to generate and run migrations for tenant databases
 *
 * Note: This DataSource uses a placeholder URL. When generating migrations,
 * TypeORM CLI will use this configuration. When running migrations in the application,
 * the actual tenant database URL will be provided dynamically.
 */
const tenantDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_TENANT_URL || process.env.DATABASE_URL || '',
  entities: [
    // Add all tenant-specific entities here
    StorageTypeormEntity,
    // Add more tenant entities as they are migrated
  ],
  migrations: [
    'src/shared/infrastructure/database/typeorm/migrations/tenant/*.ts',
  ],
  migrationsTableName: 'tenant_migrations',
  synchronize: false, // Never use synchronize in production
  logging: process.env.NODE_ENV === 'development',
};

export const TenantDataSource = new DataSource(tenantDataSourceOptions);
