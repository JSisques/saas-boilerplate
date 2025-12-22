/**
 * Script to generate a new tenant migration using TypeORM CLI
 *
 * Usage: npm run migration:tenant:generate <MigrationName>
 *
 * This script generates a migration based on the tenant DataSource configuration
 * which includes all tenant-specific entities.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execAsync = promisify(exec);

async function generateTenantMigration() {
  const migrationName = process.argv[2];

  if (!migrationName) {
    console.error('Usage: npm run migration:tenant:generate <MigrationName>');
    console.error(
      'Example: npm run migration:tenant:generate InitialTenantSchema',
    );
    process.exit(1);
  }

  const dataSourcePath = join(
    process.cwd(),
    'src/shared/infrastructure/database/typeorm/data-source-tenant.ts',
  );

  try {
    console.log(`Generating tenant migration: ${migrationName}`);
    console.log(`Using DataSource: ${dataSourcePath}`);

    // Use TypeORM CLI to generate migration
    // TypeORM CLI format: typeorm migration:generate -d <dataSourcePath> <migrationPath>
    const migrationPath = `src/shared/infrastructure/database/typeorm/migrations/tenant/${migrationName}`;
    const { stdout, stderr } = await execAsync(
      `npx typeorm-ts-node-commonjs migration:generate -d ${dataSourcePath} ${migrationPath}`,
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          // Use a placeholder URL for migration generation
          // The actual tenant database URL will be used when running migrations
          DATABASE_TENANT_URL:
            process.env.DATABASE_TENANT_URL || process.env.DATABASE_URL || '',
          TS_NODE_PROJECT: 'tsconfig.json',
        },
      },
    );

    if (stderr && !stderr.includes('warning')) {
      console.warn(`Migration generation warnings: ${stderr}`);
    }

    console.log(`✅ Migration generated successfully!`);
    console.log(stdout);

    console.log(`\n📝 Next steps:`);
    console.log(`1. Review the generated migration file`);
    console.log(`2. Test the migration on a development tenant:`);
    console.log(`   npm run migrate:tenant:typeorm <tenantId>`);
    console.log(`3. Apply to all tenants:`);
    console.log(`   npm run migrate:tenant:typeorm:all`);
  } catch (error) {
    console.error(`❌ Error generating migration:`, error);
    if (error instanceof Error) {
      console.error(`Error message: ${error.message}`);
    }
    process.exit(1);
  }
}

generateTenantMigration();
