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

### 5. BaseTypeormTenantRepository (Master Database)

Base repository class for entities stored in the **master database** that require tenant isolation via a `tenantId` column. This class automatically filters all queries by `tenantId` to ensure data isolation.

**Key Features:**

- Automatically adds `tenantId` filter to all `find`, `findOne`, `count`, and `findAndCount` operations
- Automatically sets `tenantId` on `save` operations if not present
- Prevents cross-tenant operations (updates/deletes)
- Works with entities that extend `BaseTypeormWithTenantEntity`

**Note:** This is different from tenant-specific databases. Use this for entities in the master database that need tenant filtering.

### 6. TenantQuerySubscriber

TypeORM Entity Subscriber that intercepts entity lifecycle events to enforce tenant isolation:

- Automatically sets `tenantId` on insert operations
- Prevents cross-tenant updates and deletes
- Validates tenant isolation on load operations

### 7. BaseTypeormTenantRepository (Tenant Databases)

Base repository class for tenant-specific repositories that work with isolated tenant databases. Extend this class when creating repositories that work with tenant databases.

## Automatic Tenant Filtering (Master Database)

For entities stored in the **master database** that require tenant isolation, the system provides automatic tenant filtering through `BaseTypeormTenantRepository` and `TenantQuerySubscriber`.

### How It Works

1. **TenantContextInterceptor**: Extracts `tenantId` from request headers (`x-tenant-id`) and stores it in `AsyncLocalStorage`
2. **TenantContextService**: Provides access to the current tenant ID throughout the request lifecycle
3. **BaseTypeormTenantRepository**: Automatically filters all queries by `tenantId`
4. **TenantQuerySubscriber**: Intercepts entity lifecycle events to enforce tenant isolation

### Using BaseTypeormTenantRepository (Master Database)

When your entity extends `BaseTypeormWithTenantEntity` and is stored in the master database, extend `BaseTypeormTenantRepository` to get automatic tenant filtering:

```typescript
import { BaseTypeormTenantRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-tenant/base-typeorm-tenant.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { StorageTypeormEntity } from '@/storage-context/storage/infrastructure/database/typeorm/entities/storage-typeorm.entity';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class StorageTypeormRepository
  extends BaseTypeormTenantRepository<StorageTypeormEntity>
  implements StorageWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    tenantContextService: TenantContextService,
    private readonly storageTypeormMapper: StorageTypeormMapper,
  ) {
    super(typeormMasterService, tenantContextService, StorageTypeormEntity);
  }

  // All queries automatically filtered by tenantId
  async findById(id: string): Promise<StorageAggregate | null> {
    // No need to manually add tenantId - it's automatic!
    const entity = await super.findOne({ where: { id } as any });
    return entity ? this.storageTypeormMapper.toDomainEntity(entity) : null;
  }

  // Save automatically sets tenantId if not present
  async save(storage: StorageAggregate): Promise<StorageAggregate> {
    const entity = this.storageTypeormMapper.toTypeormEntity(storage);
    // tenantId is automatically set by saveEntity()
    const saved = await super.saveEntity(entity);
    return this.storageTypeormMapper.toDomainEntity(saved);
  }

  // Delete automatically filtered by tenantId
  async delete(id: string): Promise<boolean> {
    // Automatically filters by tenantId
    await super.softDelete(id);
    return true;
  }
}
```

### Automatic Methods Provided

The `BaseTypeormTenantRepository` provides these methods that automatically filter by `tenantId`:

```typescript
// Find operations (automatically filtered by tenantId)
findOne(options?: FindOneOptions<T>): Promise<T | null>
find(options?: FindManyOptions<T>): Promise<T[]>
findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>
count(options?: FindManyOptions<T>): Promise<number>
findEntityById(id: string): Promise<T | null>  // Protected method

// Save operations (automatically sets tenantId)
saveEntity(entity: DeepPartial<T>): Promise<T>  // Protected method
saveMany(entities: DeepPartial<T>[]): Promise<T[]>

// Delete operations (automatically filtered by tenantId)
softDelete(id: string): Promise<DeleteResult>
softDeleteBy(criteria: Partial<T>): Promise<DeleteResult>
deleteEntity(id: string): Promise<DeleteResult>  // Protected method
deleteBy(criteria: Partial<T>): Promise<DeleteResult>

// Existence checks (automatically filtered by tenantId)
exists(options?: FindOneOptions<T>): Promise<boolean>
existsById(id: string): Promise<boolean>
```

### Entity Requirements

Your entity must extend `BaseTypeormWithTenantEntity`:

```typescript
import { BaseTypeormWithTenantEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm-with-tenant.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('storages')
@Index(['path'])
export class StorageTypeormEntity extends BaseTypeormWithTenantEntity {
  @Column({ type: 'varchar' })
  fileName: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  // tenantId is inherited from BaseTypeormWithTenantEntity
}
```

### TenantQuerySubscriber Behavior

The `TenantQuerySubscriber` automatically:

1. **On Insert**: Sets `tenantId` if not present
2. **On Update**: Prevents updating entities from different tenants
3. **On Delete**: Prevents deleting entities from different tenants
4. **On Load**: Logs warnings if entities from different tenants are loaded (safety check)

### Configuration

The subscriber is automatically registered in `TypeOrmModule`:

```typescript
@Module({
  imports: [
    NestTypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        // ... other config
        subscribers: [TenantQuerySubscriber],
      }),
    }),
  ],
  providers: [TenantQuerySubscriber],
})
export class TypeOrmModule {}
```

### Best Practices

1. **Always use `BaseTypeormTenantRepository`** for entities with `tenantId` in the master database
2. **Never manually add `tenantId` to queries** - let the base class handle it
3. **Use `Scope.REQUEST`** for repositories that need tenant context
4. **Ensure `TenantContextInterceptor` is registered globally** (already done in `main.ts`)
5. **Always send `x-tenant-id` header** in requests that require tenant context
6. **Use protected methods** (`saveEntity`, `findEntityById`, `deleteEntity`) when implementing domain repository interfaces

### Example: Before vs After

**Before (Manual Filtering):**

```typescript
async findById(id: string): Promise<StorageAggregate | null> {
  const entity = await this.repository.findOne({
    where: { id, tenantId: this.tenantId }, // Manual!
  });
  return entity ? this.mapper.toDomainEntity(entity) : null;
}

async save(storage: StorageAggregate): Promise<StorageAggregate> {
  const entity = this.mapper.toTypeormEntity(storage);
  if (!entity.tenantId) {
    entity.tenantId = this.tenantId; // Manual!
  }
  const saved = await this.repository.save(entity);
  return this.mapper.toDomainEntity(saved);
}
```

**After (Automatic Filtering):**

```typescript
async findById(id: string): Promise<StorageAggregate | null> {
  const entity = await super.findOne({ where: { id } as any }); // Automatic!
  return entity ? this.mapper.toDomainEntity(entity) : null;
}

async save(storage: StorageAggregate): Promise<StorageAggregate> {
  const entity = this.mapper.toTypeormEntity(storage);
  const saved = await super.saveEntity(entity); // Automatic tenantId!
  return this.mapper.toDomainEntity(saved);
}
```

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

### Using Tenant Repositories (Isolated Tenant Databases)

For repositories that work with isolated tenant databases (not master database with tenantId column):

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

**Note:** This is for isolated tenant databases. For master database entities with `tenantId` column, use the `BaseTypeormTenantRepository` shown in the "Automatic Tenant Filtering" section above.

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

### Master Database with Tenant Filtering

1. **Always use `BaseTypeormTenantRepository`** for entities with `tenantId` in master database
2. **Never manually add `tenantId` to queries** - let the base class handle it automatically
3. **Use `Scope.REQUEST`** for repositories that need tenant context
4. **Ensure entities extend `BaseTypeormWithTenantEntity`** for automatic tenant filtering
5. **Always send `x-tenant-id` header** in requests that require tenant context
6. **Use protected methods** (`saveEntity`, `findEntityById`, `deleteEntity`) when implementing domain interfaces

### Isolated Tenant Databases

1. **Always check tenant database status** before operations
2. **Use BaseTypeormTenantRepository** for tenant-specific repositories (isolated databases)
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
