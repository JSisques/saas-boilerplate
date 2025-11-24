# Multitenant Database Architecture

This document describes the multitenant database architecture implementation.

## Overview

The system uses a **hybrid multitenant architecture** with:

- **Master Database**: Contains global entities (users, tenants, subscriptions, etc.)
- **Tenant Databases**: Each tenant has its own isolated database for tenant-specific data

## Architecture Components

### 1. PrismaMasterService

Service for accessing the master database. This is the main database that contains:

- Users
- Tenants
- TenantDatabase records (metadata about tenant databases)
- Subscriptions
- Global configuration

### 2. PrismaTenantFactory

Factory service that manages Prisma client instances for tenant databases. It:

- Creates and caches Prisma clients per tenant
- Manages connection pooling
- Handles client lifecycle (connect/disconnect)

### 3. PrismaTenantService

Service that provides access to tenant databases. It:

- Fetches tenant database configuration from master
- Retrieves or creates Prisma clients for tenants
- Validates tenant database status

### 4. TenantDatabaseProvisioningService

Service for managing tenant database lifecycle:

- Creates new tenant databases
- Deletes tenant databases
- Updates database URLs
- Manages database status

### 5. TenantDatabaseMigrationService

Service for managing tenant database migrations:

- Runs migrations for specific tenants
- Runs migrations for all tenants
- Tracks migration status

### 6. BasePrismaTenantRepository

Base repository class for tenant-specific repositories. Extend this class when creating repositories that work with tenant databases.

## Usage

### Creating a Tenant Database

```typescript
import { TenantDatabaseProvisioningService } from '@/shared/infrastructure/database/prisma/services/tenant-database-provisioning.service';

// In your service
constructor(
  private readonly provisioningService: TenantDatabaseProvisioningService,
) {}

async createTenant(tenantId: string) {
  // Create tenant record in master database first
  const tenant = await this.prismaMasterService.tenant.create({
    data: { /* tenant data */ },
  });

  // Provision tenant database
  const database = await this.provisioningService.createTenantDatabase({
    tenantId: tenant.id,
    databaseName: `tenant_${tenant.id}`, // Optional
  });

  // Run migrations
  await this.migrationService.migrateTenantDatabase(tenant.id);
}
```

### Using Tenant Database in Repositories

```typescript
import { BasePrismaTenantRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-tenant/base-prisma-tenant.repository';
import { PrismaTenantService } from '@/shared/infrastructure/database/prisma/services/prisma-tenant.service';

export class ProductRepository extends BasePrismaTenantRepository {
  protected readonly tenantId: string;

  constructor(
    prismaTenantService: PrismaTenantService,
    tenantId: string, // Inject tenant ID from context
  ) {
    super(prismaTenantService);
    this.tenantId = tenantId;
  }

  async findAll() {
    const client = await this.getTenantClient();
    return client.product.findMany();
  }
}
```

### Using Tenant Database Directly

```typescript
import { PrismaTenantService } from '@/shared/infrastructure/database/prisma/services/prisma-tenant.service';

export class ProductService {
  constructor(private readonly prismaTenantService: PrismaTenantService) {}

  async getProducts(tenantId: string) {
    const client = await this.prismaTenantService.getTenantClient(tenantId);
    return client.product.findMany();
  }
}
```

## Scripts

### Provision a Tenant Database

```bash
npm run provision:tenant <tenantId> [databaseName]
```

Example:

```bash
npm run provision:tenant abc123-def456-ghi789
```

### Run Migrations for a Tenant

```bash
npm run migrate:tenant <tenantId>
```

Example:

```bash
npm run migrate:tenant abc123-def456-ghi789
```

### Run Migrations for All Tenants

```bash
npm run migrate:tenant:all
```

## Database Schema

### Master Database Schema

The master database includes the `TenantDatabase` model:

```prisma
model TenantDatabase {
  id            String                    @id @default(uuid())
  tenantId      String                    @unique
  databaseName  String
  databaseUrl   String
  status        TenantDatabaseStatusEnum  @default(PROVISIONING)
  schemaVersion String?
  lastMigrationAt DateTime?
  errorMessage  String?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?

  tenant        Tenant   @relation(fields: [tenantId], references: [id])
}
```

### Tenant Database Schema

Each tenant database has its own schema defined in `prisma/tenant/schema.prisma`. This schema should contain only tenant-specific models (products, orders, etc.), not global entities.

## Migration Workflow

1. **Update Tenant Schema**: Modify `prisma/tenant/schema.prisma`
2. **Create Migration**:
   ```bash
   cd prisma/tenant
   npx prisma migrate dev --name your_migration_name
   ```
3. **Deploy to All Tenants**:
   ```bash
   npm run migrate:tenant:all
   ```

## Best Practices

1. **Always check tenant database status** before operations
2. **Use BasePrismaTenantRepository** for tenant-specific repositories
3. **Invalidate tenant clients** when database URLs change
4. **Handle connection errors gracefully** - tenant databases may be temporarily unavailable
5. **Monitor tenant database status** - track PROVISIONING, ACTIVE, FAILED states
6. **Use transactions carefully** - tenant operations are isolated from master

## Security Considerations

1. **Database Isolation**: Each tenant has a completely isolated database
2. **Connection Pooling**: Each tenant has its own connection pool
3. **URL Security**: Database URLs are stored encrypted (consider implementing encryption)
4. **Access Control**: Always validate tenant access before operations

## Troubleshooting

### Tenant Database Not Found

- Check if tenant database record exists in master database
- Verify tenant database status is ACTIVE
- Check database URL is correct

### Migration Failures

- Check tenant database status
- Review error messages in TenantDatabase.errorMessage
- Verify database connectivity
- Check Prisma migration logs

### Connection Issues

- Verify database URL format
- Check PostgreSQL connection limits
- Review connection pool settings
- Check network connectivity
