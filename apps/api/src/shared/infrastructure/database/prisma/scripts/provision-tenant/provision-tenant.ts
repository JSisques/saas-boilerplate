/**
 * Script to provision a new tenant database
 *
 * Usage: npm run provision:tenant <tenantId> [databaseName]
 */

import { AppModule } from '@/app.module';
import { TenantDatabaseProvisioningService } from '@/shared/infrastructure/database/prisma/services/tenant-database-provisioning/tenant-database-provisioning.service';
import { NestFactory } from '@nestjs/core';

async function provisionTenant() {
  const tenantId = process.argv[2];
  const databaseName = process.argv[3];

  if (!tenantId) {
    console.error('Usage: npm run provision:tenant <tenantId> [databaseName]');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const provisioningService = app.get(TenantDatabaseProvisioningService);

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
    console.log(`npm run migrate:tenant ${tenantId}`);
  } catch (error) {
    console.error(`❌ Error provisioning tenant database:`, error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

provisionTenant();
