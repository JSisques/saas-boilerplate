/**
 * Script to run migrations for tenant databases using TypeORM
 *
 * Usage:
 * - Migrate specific tenant: npm run migrate:tenant:typeorm <tenantId>
 * - Migrate all tenants: npm run migrate:tenant:typeorm:all
 */

import { AppModule } from '@/app.module';
import { TenantDatabaseMigrationTypeormService } from '@/shared/infrastructure/database/typeorm/services/tenant-database-migration/tenant-database-migration-typeorm.service';
import { NestFactory } from '@nestjs/core';

async function migrateTenant() {
  const tenantId = process.argv[2];

  if (!tenantId) {
    console.error('Usage: npm run migrate:tenant:typeorm <tenantId>');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const migrationService = app.get(TenantDatabaseMigrationTypeormService);

  try {
    console.log(`Starting migration for tenant: ${tenantId}`);
    const result = await migrationService.migrateTenantDatabase(tenantId);

    if (result.success) {
      console.log(
        `✅ Migration completed successfully for tenant: ${tenantId}`,
      );
      console.log(`Migration version: ${result.migrationVersion}`);
    } else {
      console.error(`❌ Migration failed for tenant: ${tenantId}`);
      console.error(`Error: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error migrating tenant ${tenantId}:`, error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

async function migrateAllTenants() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const migrationService = app.get(TenantDatabaseMigrationTypeormService);

  try {
    console.log('Starting migrations for all tenants...');
    const results = await migrationService.migrateAllTenantDatabases();

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.length - successCount;

    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);

    if (failCount > 0) {
      console.log(`\n❌ Failed tenants:`);
      results
        .filter((r) => !r.success)
        .forEach((r) => {
          console.log(`  - ${r.tenantId}: ${r.error}`);
        });
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error migrating tenants:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// Check if running for all tenants
if (process.argv[2] === '--all' || process.argv[2] === 'all') {
  migrateAllTenants();
} else {
  migrateTenant();
}
