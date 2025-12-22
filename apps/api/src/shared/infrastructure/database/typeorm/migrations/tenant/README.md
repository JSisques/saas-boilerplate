# Tenant Database Migrations

This directory contains TypeORM migrations for tenant databases. These migrations are applied to each tenant database when a tenant is created or when migrations are run manually.

## Migration Workflow

### 1. Generate a Migration (Auto-generated from entity changes)

```bash
npm run migration:tenant:generate <MigrationName>
```

This command:

- Compares the current entity definitions with the database schema
- Generates a migration file with the necessary SQL changes
- Example: `npm run migration:tenant:generate AddStorageIndex`

### 2. Create an Empty Migration (For custom SQL)

```bash
npm run migration:tenant:create <MigrationName>
```

This command:

- Creates an empty migration file that you can fill manually
- Use this for custom SQL, data migrations, or complex changes
- Example: `npm run migration:tenant:create CustomDataMigration`

### 3. Run Migrations

#### For a Specific Tenant

```bash
npm run migrate:tenant:typeorm <tenantId>
```

#### For All Tenants

```bash
npm run migrate:tenant:typeorm:all
```

## Automatic Migration on Tenant Creation

When a tenant is created, migrations are automatically applied as part of the `TenantCreatedProvisionDatabaseSaga`. This ensures that every new tenant database has the latest schema.

## Adding New Tenant Entities

When you add a new entity that belongs to tenant databases:

1. **Add the entity to the DataSource configuration:**
   - Update `data-source-tenant.ts` to include the new entity
   - Update `typeorm-tenant-factory.service.ts` to include the new entity

2. **Generate a migration:**

   ```bash
   npm run migration:tenant:generate AddNewEntity
   ```

3. **Review the generated migration** to ensure it's correct

4. **Test the migration** on a development tenant:

   ```bash
   npm run migrate:tenant:typeorm <testTenantId>
   ```

5. **Apply to all tenants** (if needed):
   ```bash
   npm run migrate:tenant:typeorm:all
   ```

## Migration Files

Migration files follow the naming pattern:

```
<Timestamp>-<MigrationName>.ts
```

Example:

```
1734567890123-InitialTenantSchema.ts
1734567890456-AddStorageIndex.ts
```

## Important Notes

- **Never edit existing migration files** after they've been applied to production
- **Always test migrations** on a development tenant first
- **Backup databases** before running migrations in production
- **Migrations are tenant-specific** - each tenant database has its own migration history
- **The migrations table** is named `tenant_migrations` (not the default `migrations`)

## Current Tenant Entities

- `StorageTypeormEntity` - File storage information

Add more entities here as they are migrated to tenant databases.
