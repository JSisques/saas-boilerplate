---
title: Tenant Database
description: Complete guide to tenant database management and provisioning
---

The **Tenant Database** module provides comprehensive management of tenant databases in a multi-tenant SaaS architecture. It handles database provisioning, schema migrations, status tracking, and lifecycle management following Clean Architecture principles, CQRS pattern, and Domain-Driven Design.

## Overview

The Tenant Database Module manages isolated databases for each tenant, providing:

> **Important:** Tenant database operations are typically performed by system administrators or automated processes. While the current implementation doesn't enforce authentication guards, you should add appropriate security measures based on your requirements.

- ✅ Tenant database provisioning and deletion
- ✅ Database status tracking (PROVISIONING, ACTIVE, MIGRATING, FAILED, SUSPENDED)
- ✅ Schema version management
- ✅ Migration tracking and execution
- ✅ Error message tracking
- ✅ GraphQL API for database operations
- ✅ Event-driven architecture
- ✅ CQRS pattern with separate read/write repositories

## Architecture

The module follows Clean Architecture with clear separation of concerns:

- **Application Layer**: Command handlers, query handlers, and event handlers
- **Domain Layer**: Aggregates, value objects, repositories interfaces, and domain events
- **Infrastructure Layer**: Database repositories (Prisma for writes in master DB, MongoDB for reads) and provisioning/migration services
- **Transport Layer**: GraphQL resolvers and DTOs

### CQRS Pattern

- **Commands**: Write operations (create, update, delete) that modify state
- **Queries**: Read operations (findById, findByCriteria, findByTenantId) that query data
- **Write Repository**: Prisma-based repository for write operations (PostgreSQL - Master database)
- **Read Repository**: MongoDB-based repository for read operations (optimized for queries)

### Event-Driven Architecture

The module publishes domain events for important state changes:

- `TenantDatabaseCreatedEvent` - Published when a tenant database is created
- `TenantDatabaseUpdatedEvent` - Published when a tenant database is updated
- `TenantDatabaseDeletedEvent` - Published when a tenant database is deleted

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

## GraphQL API

### Authentication & Authorization

> **Note:** Currently, the tenant database resolvers do not have authentication guards applied. This is intentional as tenant database operations are typically performed by system administrators or automated processes. However, you should add appropriate guards based on your security requirements.

**Recommended Guards:**
- `JwtAuthGuard`: Requires authentication
- `RolesGuard`: Requires ADMIN role only
- Consider adding `TenantGuard` if tenant context is needed

### Queries

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

**Response:**
```json
{
  "data": {
    "tenantDatabaseFindById": {
      "id": "uuid",
      "tenantId": "tenant-uuid",
      "databaseName": "tenant_abc123",
      "readDatabaseName": "tenant_abc123_read",
      "status": "ACTIVE",
      "schemaVersion": "20250101",
      "lastMigrationAt": "2025-01-01T00:00:00.000Z",
      "errorMessage": null,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
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
      lastMigrationAt
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

### Mutations

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
    "databaseName": "tenant_abc123"
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

**Process:**
1. Asserts tenant database does not already exist
2. Asserts tenant exists
3. Creates tenant database aggregate with PROVISIONING status
4. Saves aggregate to write repository (Prisma - Master database)
5. Publishes `TenantDatabaseCreatedEvent`
6. Returns tenant database ID

**Business Rules:**
- Tenant must exist
- Tenant database must not already exist for the tenant
- Database name is auto-generated if not provided (format: `tenant_{tenantId}`)
- Initial status is PROVISIONING

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

**Response:**
```json
{
  "data": {
    "tenantDatabaseUpdate": {
      "success": true,
      "message": "Tenant database updated successfully",
      "id": "tenant-database-uuid"
    }
  }
}
```

**Process:**
1. Asserts tenant database exists
2. Updates aggregate properties
3. Saves aggregate to write repository
4. Publishes `TenantDatabaseUpdatedEvent`

#### tenantDatabaseDelete

Deletes a tenant database record (soft delete).

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

**Response:**
```json
{
  "data": {
    "tenantDatabaseDelete": {
      "success": true,
      "message": "Tenant database deleted successfully",
      "id": "tenant-database-uuid"
    }
  }
}
```

**Process:**
1. Asserts tenant database exists
2. Marks aggregate as deleted
3. Deletes record from write repository (soft delete)
4. Publishes `TenantDatabaseDeletedEvent`

## Provisioning Service

The `TenantDatabaseProvisioningService` handles the actual provisioning and deletion of tenant databases. It's located in `shared/infrastructure/database/prisma/services/tenant-database-provisioning/`.

### Creating a Tenant Database

The provisioning service creates both the database record and the actual PostgreSQL database:

**Process:**
1. Validates tenant exists
2. Checks if tenant database already exists
3. Generates database name if not provided (format: `tenant_{tenantId}`)
4. Creates database record with PROVISIONING status
5. Creates actual PostgreSQL database
6. Updates status to ACTIVE
7. Returns database information

**Error Handling:**
- If provisioning fails, status is updated to FAILED
- Error message is stored in `errorMessage` field

### Deleting a Tenant Database

**Process:**
1. Finds tenant database record
2. Removes tenant client from cache
3. Drops PostgreSQL database
4. Soft deletes database record

### Updating Database Name

**Process:**
1. Finds tenant database record
2. Removes old client from cache
3. Updates database name in record

## Migration Service

The `TenantDatabaseMigrationService` handles schema migrations for tenant databases. It's located in `shared/infrastructure/database/prisma/services/tenant-database-migration/`.

### Migrating a Single Tenant

**Process:**
1. Validates tenant database exists and is ACTIVE
2. Updates status to MIGRATING
3. Runs Prisma migrations using `prisma migrate deploy`
4. Updates status to ACTIVE with migration info (schemaVersion, lastMigrationAt)
5. Invalidates tenant client cache

**Error Handling:**
- If migration fails, status is updated to FAILED
- Error message is stored in `errorMessage` field

### Migrating All Tenants

**Process:**
- Migrates all active tenant databases sequentially
- Returns array of migration results
- Continues even if individual migrations fail
- Logs success/failure count

## Domain Model

### Tenant Database Aggregate

The `TenantDatabaseAggregate` is the main domain entity:

**Properties:**
- `id` - Tenant database UUID
- `tenantId` - Tenant UUID (unique)
- `databaseName` - Database name for write operations
- `readDatabaseName` - Database name for read operations
- `status` - Database status (PROVISIONING, ACTIVE, MIGRATING, FAILED, SUSPENDED)
- `schemaVersion` - Current schema version
- `lastMigrationAt` - Last migration timestamp
- `errorMessage` - Error message if status is FAILED
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

**Methods:**
- `update(props, generateEvent)` - Updates tenant database metadata
- `delete(generateEvent)` - Marks tenant database as deleted
- `toPrimitives()` - Converts aggregate to primitive data

### Value Objects

The module uses value objects to encapsulate and validate domain concepts:

- **TenantDatabaseNameValueObject** - Validates database name
- **TenantDatabaseStatusValueObject** - Validates status enum
- **TenantDatabaseSchemaVersionValueObject** - Represents schema version
- **TenantDatabaseLastMigrationAtValueObject** - Represents last migration timestamp
- **TenantDatabaseErrorMessageValueObject** - Represents error messages

## Repositories

The module uses two repositories following CQRS pattern:

### Write Repository (Prisma)

**Interface:** `TenantDatabaseWriteRepository`

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

## Event Handlers

### TenantDatabaseCreatedEventHandler

Handles `TenantDatabaseCreatedEvent`:

1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

### TenantDatabaseUpdatedEventHandler

Handles `TenantDatabaseUpdatedEvent`:

1. Creates or updates view model from event data
2. Saves view model to read repository (MongoDB)

### TenantDatabaseDeletedEventHandler

Handles `TenantDatabaseDeletedEvent`:

1. Asserts view model exists
2. Deletes view model from read repository (MongoDB)

## Complete Examples

### Tenant Database Lifecycle

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

## Error Handling

The module provides detailed error messages:

- **Tenant Database Not Found:** `TenantDatabaseNotFoundException` when database doesn't exist
- **Tenant Database Already Exists:** `TenantDatabaseAlreadyExistsException` when trying to create duplicate
- **Tenant ID Already Exists:** `TenantDatabaseTenantIdExistsException` when tenant already has a database
- **Provisioning Failures:** Error messages stored in `errorMessage` field
- **Migration Failures:** Error messages stored in `errorMessage` field

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
  lastMigrationAt  DateTime?
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

