# Multitenant Database Architecture with TypeORM

This document describes the multitenant database architecture implementation using TypeORM.

## Overview

The system uses a **hybrid multitenant architecture** with:

- **Master Database**: Contains global entities (users, tenants, subscriptions, etc.)
- **Tenant Databases**: Each tenant has its own isolated database for tenant-specific data

## Architecture Components

### 1. TypeormMasterService

Service for accessing the master database. This is the main database that contains:

- Users
- Tenants
- TenantDatabase records (metadata about tenant databases)
- Subscriptions
- Global configuration

### 2. TypeormTenantFactory

Factory service that manages TypeORM DataSource instances for tenant databases. It:

- Creates and caches DataSource instances per tenant
- Manages connection pooling
- Handles DataSource lifecycle (initialize/destroy)
- Validates connections before reuse

### 3. TypeormTenantService

Service that provides access to tenant databases. It:

- Fetches tenant database configuration from master
- Retrieves or creates DataSource instances for tenants
- Validates tenant database status
- Provides methods to check if tenant database is active

### 4. TenantDatabaseProvisioningTypeormService

Service for managing tenant database lifecycle:

- Creates new tenant databases
- Deletes tenant databases
- Updates database names
- Manages database status

### 5. BaseTypeormTenantRepository

Base repository class for tenant-specific repositories. Extend this class when creating repositories that work with tenant databases.

## Usage

### Creating a Tenant Database

```typescript
import { TenantDatabaseProvisioningTypeormService } from '@/shared/infrastructure/database/typeorm/services/tenant-database-provisioning/tenant-database-provisioning-typeorm.service';

// In your service
constructor(
  private readonly provisioningService: TenantDatabaseProvisioningTypeormService,
) {}

async createTenant(tenantId: string) {
  const databaseInfo = await this.provisioningService.createTenantDatabase({
    tenantId,
    databaseName: 'tenant_abc123' // Optional
  });

  console.log(`Database created: ${databaseInfo.databaseName}`);
}
```

### Using Tenant Repositories

```typescript
import { BaseTypeormTenantRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-tenant/base-typeorm-tenant.repository';
import { TypeormTenantService } from '@/shared/infrastructure/database/typeorm/services/typeorm-tenant/typeorm-tenant.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';

export class MyTenantRepository extends BaseTypeormTenantRepository {
  constructor(
    typeormTenantService: TypeormTenantService,
    tenantContextService: TenantContextService,
  ) {
    super(typeormTenantService, tenantContextService);
  }

  async findAll(): Promise<MyEntity[]> {
    const dataSource = await this.getTenantDataSource();
    const repository = dataSource.getRepository(MyEntity);
    return repository.find();
  }
}
```

### Getting Tenant DataSource Directly

```typescript
import { TypeormTenantService } from '@/shared/infrastructure/database/typeorm/services/typeorm-tenant/typeorm-tenant.service';

constructor(
  private readonly typeormTenantService: TypeormTenantService,
) {}

async getTenantData(tenantId: string) {
  const dataSource = await this.typeormTenantService.getTenantDataSource(tenantId);
  const repository = dataSource.getRepository(MyEntity);
  return repository.find();
}
```

### Deleting a Tenant Database

```typescript
await provisioningService.deleteTenantDatabase(tenantId);
```

### Updating Database Name

```typescript
await provisioningService.updateTenantDatabaseName(tenantId, newDatabaseName);
```

## Database Schema

### Master Database Schema

The master database includes the `TenantDatabase` entity:

```typescript
@Entity('tenant_databases')
export class TenantDatabaseTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar' })
  tenantId: string;

  @Column({ type: 'varchar' })
  databaseName: string;

  @Column({ type: 'varchar' })
  readDatabaseName: string;

  @Column({
    type: 'enum',
    enum: TenantDatabaseStatusEnum,
  })
  status: TenantDatabaseStatusEnum;

  @Column({ type: 'varchar', nullable: true })
  schemaVersion: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastMigrationAt: Date | null;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;
}
```

### Tenant Database Schema

Each tenant database has its own schema with tenant-specific entities. These entities should be defined in your domain modules and will be automatically loaded when the DataSource is initialized.

## Migration Workflow

1. **Update Tenant Schema**: Modify your tenant entity definitions
2. **Create Migration**: Use TypeORM CLI to generate migrations
3. **Deploy to All Tenants**: Run migrations for each tenant database

## Best Practices

1. **Always check tenant database status** before operations
2. **Use BaseTypeormTenantRepository** for tenant-specific repositories
3. **Invalidate tenant DataSources** when database URLs change
4. **Handle connection errors gracefully** - tenant databases may be temporarily unavailable
5. **Monitor tenant database status** - track PROVISIONING, ACTIVE, FAILED states
6. **Use transactions carefully** - tenant operations are isolated from master
7. **Don't use autoLoadEntities in tenant DataSources** - explicitly define entities for better performance

## Security Considerations

1. **Database Isolation**: Each tenant has a completely isolated database
2. **Connection Pooling**: Each tenant has its own connection pool
3. **URL Security**: Database URLs are built dynamically from environment variables
4. **Access Control**: Always validate tenant access before operations

## Differences from Prisma Implementation

1. **DataSource Management**: TypeORM uses DataSource instances instead of Prisma clients
2. **Connection Lifecycle**: TypeORM requires explicit initialization and destruction
3. **Entity Loading**: Entities must be explicitly defined (no autoLoadEntities in tenant DataSources)
4. **Query API**: Uses TypeORM's query builder and repository pattern instead of Prisma's query API

## Troubleshooting

### Tenant Database Not Found

- Verify the tenant database record exists in the master database
- Check that the tenant database status is ACTIVE
- Verify the database name is correct

### Connection Errors

- Check database URL configuration
- Verify database exists in PostgreSQL
- Check network connectivity
- Review connection pool settings

### Migration Issues

- Ensure migrations are run for each tenant database
- Check migration status in tenant database record
- Verify schema version matches expected version
