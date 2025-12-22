/**
 * Script to create an empty tenant migration file
 *
 * Usage: npm run migration:tenant:create <MigrationName>
 *
 * This script creates an empty migration file that you can fill manually.
 * Use this when you need to write custom SQL or complex migration logic.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execAsync = promisify(exec);

async function createTenantMigration() {
  const migrationName = process.argv[2];

  if (!migrationName) {
    console.error('Usage: npm run migration:tenant:create <MigrationName>');
    console.error('Example: npm run migration:tenant:create AddCustomIndex');
    process.exit(1);
  }

  const dataSourcePath = join(
    process.cwd(),
    'src/shared/infrastructure/database/typeorm/data-source-tenant.ts',
  );

  try {
    console.log(`Creating empty tenant migration: ${migrationName}`);
    console.log(`Using DataSource: ${dataSourcePath}`);

    // Use TypeORM CLI to create empty migration
    // TypeORM CLI format: typeorm migration:create <migrationPath>
    const migrationPath = `src/shared/infrastructure/database/typeorm/migrations/tenant/${migrationName}`;
    const { stdout, stderr } = await execAsync(
      `npx typeorm-ts-node-commonjs migration:create ${migrationPath}`,
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          TS_NODE_PROJECT: 'tsconfig.json',
        },
      },
    );

    if (stderr && !stderr.includes('warning')) {
      console.warn(`Migration creation warnings: ${stderr}`);
    }

    console.log(`✅ Empty migration created successfully!`);
    console.log(stdout);

    console.log(`\n📝 Next steps:`);
    console.log(
      `1. Edit the migration file to add your custom migration logic`,
    );
    console.log(`2. Test the migration on a development tenant:`);
    console.log(`   npm run migrate:tenant:typeorm <tenantId>`);
    console.log(`3. Apply to all tenants:`);
    console.log(`   npm run migrate:tenant:typeorm:all`);
  } catch (error) {
    console.error(`❌ Error creating migration:`, error);
    if (error instanceof Error) {
      console.error(`Error message: ${error.message}`);
    }
    process.exit(1);
  }
}

createTenantMigration();
