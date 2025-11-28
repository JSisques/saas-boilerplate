# Tenant Database Module

A comprehensive module for managing tenant databases in a multi-tenant SaaS architecture. This module handles the lifecycle of tenant databases, including provisioning, migration management, and status tracking. It follows Clean Architecture principles, implements CQRS pattern, and uses Domain-Driven Design.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Database Status](#database-status)
- [Commands](#commands)
- [Queries](#queries)
- [Events](#events)
- [Repositories](#repositories)
- [GraphQL API](#graphql-api)
- [Provisioning Service](#provisioning-service)
- [Migration Service](#migration-service)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

The Tenant Database Module provides a complete solution for managing isolated databases for each tenant in a multi-tenant SaaS application. It handles database provisioning, schema migrations, status tracking, and lifecycle management.

### Features

- ✅ Tenant database provisioning and deletion
- ✅ Database status tracking (PROVISIONING, ACTIVE, MIGRATING, FAILED, SUSPENDED)
- ✅ Schema version management
- ✅ Migration tracking and execution
- ✅ Error message tracking
- ✅ GraphQL API for database operations
- ✅ Event-driven architecture
- ✅ CQRS pattern with separate read/write repositories
- ✅ Domain-driven design with value objects and aggregates

## Architecture

The module is organized following Clean Architecture principles:

```
tenant-database/
├── application/              # Application layer (CQRS)
│   ├── commands/            # Command handlers
│   │   ├── tenant-database-create/
│   │   ├── tenant-database-update/
│   │   └── tenant-database-delete/
│   ├── queries/             # Query handlers
│   │   ├── tenant-database-find-by-id/
│   │   ├── tenant-database-find-by-criteria/
│   │   └── tenant-database-find-by-tenant-id/
│   ├── event-handlers/      # Event handlers
│   │   ├── tenant-database-created/
│   │   ├── tenant-database-updated/
│   │   └── tenant-database-deleted/
│   ├── services/           # Application services
│   │   ├── assert-tenant-database-exsits/
│   │   ├── assert-tenant-database-not-exsits/
│   │   ├── assert-tenant-database-view-model-exsits/
│   │   └── assert-tenant-database-tenant-id-is-unique/
│   └── exceptions/         # Application exceptions
│       ├── tenant-database-not-found/
│       ├── tenant-database-already-exists/
│       └── tenant-database-tenant-id-exists/
├── domain/                  # Domain layer
│   ├── aggregates/          # Tenant database aggregate
│   │   └── tenant-database.aggregate.ts
│   ├── repositories/       # Repository interfaces
│   │   ├── tenant-database-write.repository.ts
│   │   └── tenant-database-read.repository.ts
│   ├── value-objects/      # Value objects
│   │   ├── tenant-database-name/
│   │   ├── tenant-database-status/
│   │   ├── tenant-database-schema-version/
│   │   ├── tenant-database-last-migration-at/
│   │   └── tenant-database-error-message/
│   ├── view-models/        # Read models
│   │   └── tenant-database.view-model.ts
│   ├── factories/          # Domain factories
│   │   ├── tenant-database-aggregate.factory.ts
│   │   └── tenant-database-view-model.factory.ts
│   ├── enums/             # Domain enums
│   │   └── tenant-database-status.enum.ts
│   └── primitives/        # Domain primitives
│       └── tenant-database.primitives.ts
├── infrastructure/         # Infrastructure layer
│   └── database/          # Database repositories
│       ├── prisma/        # Write repository (Prisma/PostgreSQL)
│       └── mongodb/       # Read repository (MongoDB)
└── transport/             # Transport layer
    └── graphql/          # GraphQL resolvers and DTOs
        ├── resolvers/
        ├── dtos/
        └── mappers/
```

### Architecture Patterns

#### CQRS (Command Query Responsibility Segregation)

- **Commands**: Write operations (create, update, delete) that modify state
- **Queries**: Read operations (findById, findByCriteria, findByTenantId) that query data
- **Write Repository**: Prisma-based repository for write operations (PostgreSQL - Master database)
- **Read Repository**: MongoDB-based repository for read operations (optimized for queries)

#### Event-Driven Architecture

The module publishes domain events for important state changes:

- `TenantDatabaseCreatedEvent` - Published when a tenant database is created
- `TenantDatabaseUpdatedEvent` - Published when a tenant database is updated
- `TenantDatabaseDeletedEvent` - Published when a tenant database is deleted

Events are handled asynchronously to update read models and trigger side effects.

## Domain Model

### Tenant Database Aggregate

The `TenantDatabaseAggregate` is the main domain entity that encapsulates tenant database business logic:

```typescript
class TenantDatabaseAggregate {
  id: TenantDatabaseUuidValueObject
  tenantId: TenantUuidValueObject
  databaseName: TenantDatabaseNameValueObject
  readDatabaseName: TenantDatabaseNameValueObject
  status: TenantDatabaseStatusValueObject
  schemaVersion: TenantDatabaseSchemaVersionValueObject | null
  lastMigrationAt: TenantDatabaseLastMigrationAtValueObject | null
  errorMessage: TenantDatabaseErrorMessageValueObject | null
  createdAt: DateValueObject
  updatedAt: DateValueObject
}
```

**Methods:**
- `update(props, generateEvent)`: Updates tenant database metadata
- `delete(generateEvent)`: Marks tenant database as deleted
- `toPrimitives()`: Converts aggregate to primitive data

### Value Objects

The module uses value objects to encapsulate and validate domain concepts:

- **TenantDatabaseNameValueObject**: Validates database name
- **TenantDatabaseStatusValueObject**: Validates status enum
- **TenantDatabaseSchemaVersionValueObject**: Represents schema version
- **TenantDatabaseLastMigrationAtValueObject**: Represents last migration timestamp
- **TenantDatabaseErrorMessageValueObject**: Represents error messages

### View Model

The `TenantDatabaseViewModel` is optimized for read operations and stored in MongoDB for fast querying.

## Database Status

Tenant databases can have one of five statuses:

### PROVISIONING

The database is being provisioned. This is the initial status when a tenant database record is created.

**Characteristics:**
- Database record exists but database may not be fully created
- Used during initial setup
- Automatically transitions to ACTIVE on successful provisioning

### ACTIVE

The database is active and ready to use.

**Characteristics:**
- Database is fully provisioned
- Migrations are up to date
- Ready for tenant operations

### MIGRATING

The database is currently running migrations.

**Characteristics:**
- Migrations are in progress
- Database operations may be limited
- Automatically transitions to ACTIVE on success or FAILED on error

### FAILED

The database has failed during provisioning or migration.

**Characteristics:**
- Error occurred during provisioning or migration
- `errorMessage` field contains details
- Requires manual intervention

### SUSPENDED

The database is suspended (not currently in use).

**Characteristics:**
- Database exists but is not active
- Can be reactivated later

## Commands

Commands represent write operations that modify state:

### TenantDatabaseCreateCommand

Creates a new tenant database record.

**Handler:** `TenantDatabaseCreateCommandHandler`

**Process:**
1. Asserts tenant database does not already exist
2. Asserts tenant exists
3. Creates tenant database aggregate
4. Saves aggregate to write repository (Prisma - Master database)
5. Publishes `TenantDatabaseCreatedEvent`
6. Returns tenant database ID

**Input:**
```typescript
{
  tenantId: string
  databaseName?: string  // Optional, auto-generated if not provided
}
```

**Output:** `string` (tenant database ID)

**Business Rules:**
- Tenant must exist
- Tenant database must not already exist for the tenant
- Database name is auto-generated if not provided (format: `tenant_{tenantId}`)
- Initial status is PROVISIONING

### TenantDatabaseUpdateCommand

Updates a tenant database record.

**Handler:** `TenantDatabaseUpdateCommandHandler`

**Process:**
1. Asserts tenant database exists
2. Updates aggregate properties
3. Saves aggregate to write repository
4. Publishes `TenantDatabaseUpdatedEvent`

**Input:**
```typescript
{
  id: string
  databaseName?: string
  readDatabaseName?: string
  status?: TenantDatabaseStatusEnum
  schemaVersion?: string
  lastMigrationAt?: Date
  errorMessage?: string
}
```

**Output:** `void`

### TenantDatabaseDeleteCommand

Deletes a tenant database record (soft delete).

**Handler:** `TenantDatabaseDeleteCommandHandler`

**Process:**
1. Asserts tenant database exists
2. Marks aggregate as deleted
3. Deletes record from write repository (soft delete)
4. Publishes `TenantDatabaseDeletedEvent`

**Input:**
```typescript
{
  id: string
}
```

**Output:** `void`

## Queries

Queries represent read operations that don't modify state:

### FindTenantDatabaseByIdQuery

Finds a tenant database aggregate by ID.

**Handler:** `FindTenantDatabaseByIdQueryHandler`

**Input:**
```typescript
{
  id: string
}
```

**Output:** `TenantDatabaseAggregate`

### FindTenantDatabasesByCriteriaQuery

Finds tenant databases by criteria with pagination.

**Handler:** `FindTenantDatabasesByCriteriaQueryHandler`

**Input:**
```typescript
{
  criteria: Criteria {
    filters?: Filter[]
    sorts?: Sort[]
    pagination?: Pagination
  }
}
```

**Output:** `PaginatedResult<TenantDatabaseViewModel>`

### FindTenantDatabaseByTenantIdQuery

Finds a tenant database by tenant ID.

**Handler:** `FindTenantDatabaseByTenantIdQueryHandler`

**Input:**
```typescript
{
  tenantId: string
}
```

**Output:** `TenantDatabaseAggregate | null`

## Events

The module publishes domain events for important state changes:

### TenantDatabaseCreatedEvent

Published when a tenant database is created.

**Handler:** `TenantDatabaseCreatedEventHandler`

**Process:**
1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

### TenantDatabaseUpdatedEvent

Published when a tenant database is updated.

**Handler:** `TenantDatabaseUpdatedEventHandler`

**Process:**
1. Creates or updates view model from event data
2. Saves view model to read repository (MongoDB)

### TenantDatabaseDeletedEvent

Published when a tenant database is deleted.

**Handler:** `TenantDatabaseDeletedEventHandler`

**Process:**
1. Asserts view model exists
2. Deletes view model from read repository (MongoDB)

## Repositories

The module uses two repositories following CQRS pattern:

### Write Repository (Prisma)

**Interface:** `TenantDatabaseWriteRepository`

**Implementation:** `TenantDatabasePrismaRepository`

**Database:** PostgreSQL (Master database)

**Operations:**
- `findById(id: string): Promise<TenantDatabaseAggregate | null>`
- `findByTenantId(tenantId: string): Promise<TenantDatabaseAggregate[] | null>`
- `save(tenantDatabase: TenantDatabaseAggregate): Promise<TenantDatabaseAggregate>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Stores tenant database metadata in master database
- Indexed on `tenantId` and `status` for performance
- Soft delete support

### Read Repository (MongoDB)

**Interface:** `TenantDatabaseReadRepository`

**Implementation:** `TenantDatabaseMongoRepository`

**Database:** MongoDB

**Operations:**
- `findById(id: string): Promise<TenantDatabaseViewModel | null>`
- `findByTenantId(tenantId: string): Promise<TenantDatabaseViewModel[] | null>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<TenantDatabaseViewModel>>`
- `save(tenantDatabaseViewModel: TenantDatabaseViewModel): Promise<void>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Optimized for read operations
- Supports complex queries with filters, sorts, and pagination

## GraphQL API

The module exposes a GraphQL API through two resolvers:

### Authentication & Authorization

> **Note:** Currently, the tenant database resolvers do not have authentication guards applied. This is intentional as tenant database operations are typically performed by system administrators or automated processes. However, you should add appropriate guards based on your security requirements.

**Recommended Guards:**
- `JwtAuthGuard`: Requires authentication
- `RolesGuard`: Requires ADMIN role only
- Consider adding `TenantGuard` if tenant context is needed

### TenantDatabaseQueryResolver

Handles read operations (queries).

**Queries:**

#### tenantDatabaseFindById

Finds a tenant database by ID.

```graphql
query FindTenantDatabaseById($input: TenantDatabaseFindByIdRequestDto!) {
  tenantDatabaseFindById(input: $input) {
    id
    tenantId
    databaseName
    readDatabaseName
    status
    schemaVersion
    lastMigrationAt
    errorMessage
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "uuid-here"
  }
}
```

#### tenantDatabaseFindByCriteria

Finds tenant databases by criteria with pagination.

```graphql
query FindTenantDatabasesByCriteria($input: TenantDatabaseFindByCriteriaRequestDto) {
  tenantDatabaseFindByCriteria(input: $input) {
    items {
      id
      tenantId
      databaseName
      status
      schemaVersion
    }
    total
    page
    limit
  }
}
```

**Variables:**
```json
{
  "input": {
    "filters": [
      {
        "field": "status",
        "operator": "EQUALS",
        "value": "ACTIVE"
      }
    ],
    "sorts": [
      {
        "field": "createdAt",
        "direction": "DESC"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10
    }
  }
}
```

### TenantDatabaseMutationsResolver

Handles write operations (mutations).

**Mutations:**

#### tenantDatabaseCreate

Creates a new tenant database record.

```graphql
mutation CreateTenantDatabase($input: TenantDatabaseCreateRequestDto!) {
  tenantDatabaseCreate(input: $input) {
    success
    message
    id
  }
}
```

**Variables:**
```json
{
  "input": {
    "tenantId": "tenant-uuid",
    "databaseName": "tenant_abc123"  // Optional
  }
}
```

**Response:**
```json
{
  "data": {
    "tenantDatabaseCreate": {
      "success": true,
      "message": "Tenant database created successfully",
      "id": "tenant-database-uuid"
    }
  }
}
```

#### tenantDatabaseUpdate

Updates a tenant database record.

```graphql
mutation UpdateTenantDatabase($input: TenantDatabaseUpdateRequestDto!) {
  tenantDatabaseUpdate(input: $input) {
    success
    message
    id
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "tenant-database-uuid",
    "status": "ACTIVE",
    "schemaVersion": "20250101",
    "lastMigrationAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### tenantDatabaseDelete

Deletes a tenant database record.

```graphql
mutation DeleteTenantDatabase($input: TenantDatabaseDeleteRequestDto!) {
  tenantDatabaseDelete(input: $input) {
    success
    message
    id
  }
}
```

**Variables:**
```json
{
  "input": {
    "id": "tenant-database-uuid"
  }
}
```

## Provisioning Service

The `TenantDatabaseProvisioningService` (located in `shared/infrastructure/database/prisma/services/tenant-database-provisioning/`) handles the actual provisioning and deletion of tenant databases.

### Creating a Tenant Database

```typescript
const provisioningService = new TenantDatabaseProvisioningService(...);

const databaseInfo = await provisioningService.createTenantDatabase({
  tenantId: 'tenant-uuid',
  databaseName: 'tenant_abc123'  // Optional
});
```

**Process:**
1. Validates tenant exists
2. Checks if tenant database already exists
3. Generates database name if not provided
4. Creates database record with PROVISIONING status
5. Creates actual PostgreSQL database
6. Updates status to ACTIVE
7. Returns database information

**Error Handling:**
- If provisioning fails, status is updated to FAILED
- Error message is stored in `errorMessage` field

### Deleting a Tenant Database

```typescript
await provisioningService.deleteTenantDatabase(tenantId);
```

**Process:**
1. Finds tenant database record
2. Removes tenant client from cache
3. Drops PostgreSQL database
4. Soft deletes database record

### Updating Database Name

```typescript
await provisioningService.updateTenantDatabaseName(
  tenantId,
  newDatabaseName
);
```

**Process:**
1. Finds tenant database record
2. Removes old client from cache
3. Updates database name in record

## Migration Service

The `TenantDatabaseMigrationService` (located in `shared/infrastructure/database/prisma/services/tenant-database-migration/`) handles schema migrations for tenant databases.

### Migrating a Single Tenant

```typescript
const migrationService = new TenantDatabaseMigrationService(...);

const result = await migrationService.migrateTenantDatabase(tenantId);
```

**Process:**
1. Validates tenant database exists and is ACTIVE
2. Updates status to MIGRATING
3. Runs Prisma migrations
4. Updates status to ACTIVE with migration info
5. Invalidates tenant client cache

**Returns:**
```typescript
{
  tenantId: string
  success: boolean
  migrationVersion?: string
  error?: string
}
```

### Migrating All Tenants

```typescript
const results = await migrationService.migrateAllTenantDatabases();
```

**Process:**
- Migrates all active tenant databases
- Returns array of migration results
- Continues even if individual migrations fail

### Getting Migration Status

```typescript
const status = await migrationService.getTenantMigrationStatus(tenantId);
```

**Returns:**
```typescript
{
  tenantId: string
  status: TenantDatabaseStatusEnum
  schemaVersion: string | null
  lastMigrationAt: Date | null
  errorMessage: string | null
}
```

## Examples

### Complete Tenant Database Lifecycle

```graphql
# 1. Create tenant database
mutation {
  tenantDatabaseCreate(input: {
    tenantId: "tenant-uuid"
  }) {
    success
    message
    id
  }
}

# 2. Check status
query {
  tenantDatabaseFindById(input: { id: "database-uuid" }) {
    id
    status
    databaseName
  }
}

# 3. Update status after provisioning
mutation {
  tenantDatabaseUpdate(input: {
    id: "database-uuid"
    status: ACTIVE
  }) {
    success
    message
  }
}

# 4. Update after migration
mutation {
  tenantDatabaseUpdate(input: {
    id: "database-uuid"
    status: ACTIVE
    schemaVersion: "20250101"
    lastMigrationAt: "2025-01-01T00:00:00.000Z"
  }) {
    success
    message
  }
}
```

### Query with Filters

```graphql
query {
  tenantDatabaseFindByCriteria(input: {
    filters: [
      {
        field: "status"
        operator: EQUALS
        value: "ACTIVE"
      }
    ]
    sorts: [
      {
        field: "createdAt"
        direction: DESC
      }
    ]
    pagination: {
      page: 1
      limit: 20
    }
  }) {
    items {
      id
      tenantId
      databaseName
      status
      schemaVersion
    }
    total
    page
    limit
  }
}
```

## Troubleshooting

### Common Issues

1. **Tenant Database Not Found:**
   - Solution: Verify the tenant database ID exists
   - Check if the database was soft deleted

2. **Tenant Database Already Exists:**
   - Solution: Check if a database already exists for the tenant
   - Use `findByTenantId` to check existing databases

3. **Provisioning Failed:**
   - Solution: Check `errorMessage` field for details
   - Verify PostgreSQL connection and permissions
   - Check database name conflicts

4. **Migration Failed:**
   - Solution: Check `errorMessage` field for details
   - Verify Prisma schema is correct
   - Check database connection
   - Review migration files

5. **Status Stuck in PROVISIONING:**
   - Solution: Check provisioning service logs
   - Manually update status if needed
   - Verify PostgreSQL is accessible

### Debugging

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed logs for:
- Database provisioning
- Migration execution
- Repository operations
- Event handling

## Database Schema

### Prisma Schema (Master Database)

```prisma
enum TenantDatabaseStatusEnum {
  PROVISIONING
  ACTIVE
  MIGRATING
  FAILED
  SUSPENDED
}

model TenantDatabase {
  id               String                   @id @default(uuid())
  tenantId         String                   @unique
  databaseName     String
  readDatabaseName String
  status           TenantDatabaseStatusEnum @default(PROVISIONING)
  schemaVersion    String?
  lastMigrationAt DateTime?
  errorMessage     String?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([status])
}
```

### MongoDB Schema (Read Database)

The MongoDB collection stores view models with the same structure as the Prisma model, optimized for read operations.

## Best Practices

1. **Database Naming** - Use consistent naming conventions (e.g., `tenant_{tenantId}`)
2. **Status Management** - Always update status appropriately during provisioning and migrations
3. **Error Handling** - Store error messages for failed operations
4. **Migration Tracking** - Keep schema version and last migration timestamp up to date
5. **Soft Deletes** - Use soft deletes to maintain audit trail
6. **Event Handling** - Subscribe to tenant database events for cross-module integration
7. **Cache Management** - Invalidate tenant client cache after schema changes

## Related Services

- **TenantDatabaseProvisioningService**: Handles actual database provisioning
- **TenantDatabaseMigrationService**: Handles schema migrations
- **TenantDatabaseUrlBuilderService**: Builds database connection URLs
- **PrismaTenantFactory**: Manages Prisma client instances for tenant databases
- **PrismaTenantService**: Provides access to tenant databases

## License

This module is part of the SaaS Boilerplate project.

