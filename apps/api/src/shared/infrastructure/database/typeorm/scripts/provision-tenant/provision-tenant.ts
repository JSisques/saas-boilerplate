/**
 * Script to provision a new tenant database using TypeORM
 *
 * Usage: npm run provision:tenant:typeorm <tenantId> [databaseName]
 */

import { AppModule } from '@/app.module';
import { TenantDatabaseProvisioningTypeormService } from '@/shared/infrastructure/database/typeorm/services/tenant-database-provisioning/tenant-database-provisioning-typeorm.service';
import { NestFactory } from '@nestjs/core';

async function provisionTenant() {
  const tenantId = process.argv[2];
  const databaseName = process.argv[3];

  if (!tenantId) {
    console.error(
      'Usage: npm run provision:tenant:typeorm <tenantId> [databaseName]',
    );
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const provisioningService = app.get(TenantDatabaseProvisioningTypeormService);

  try {
    console.log(`Provisioning database for tenant: ${tenantId}`);
    const result = await provisioningService.createTenantDatabase({
      tenantId,
      databaseName,
    });

    console.log(`✅ Tenant database provisioned successfully!`);
    console.log(`Database ID: ${result.id}`);
    console.log(`Database Name: ${result.databaseName}`);
    console.log(`Database URL: ${result.databaseUrl}`);
    console.log(`Status: ${result.status}`);

    console.log(`\n⚠️  Don't forget to run migrations:`);
    console.log(`npm run migrate:tenant:typeorm ${tenantId}`);
  } catch (error) {
    console.error(`❌ Error provisioning tenant database:`, error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

provisionTenant();
