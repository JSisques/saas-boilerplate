# Tenant Members Module

A comprehensive module for managing tenant memberships in a multi-tenant SaaS application. This module handles the relationship between users and tenants, including role-based access control. It follows Clean Architecture principles, implements CQRS pattern, and uses Domain-Driven Design.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Member Roles](#member-roles)
- [Commands](#commands)
- [Queries](#queries)
- [Events](#events)
- [Repositories](#repositories)
- [GraphQL API](#graphql-api)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

The Tenant Members Module provides a complete solution for managing user memberships within tenants. It enables role-based access control and associates users with tenants while managing their permissions.

### Features

- ✅ Add, update, and remove tenant members
- ✅ Role-based access control (OWNER, ADMIN, MEMBER, GUEST)
- ✅ GraphQL API for member operations
- ✅ Event-driven architecture
- ✅ Multi-tenant support with tenant isolation
- ✅ CQRS pattern with separate read/write repositories
- ✅ Domain-driven design with value objects and aggregates
- ✅ View models for optimized read operations

## Architecture

The module is organized following Clean Architecture principles:

```
tenant-members/
├── application/              # Application layer (CQRS)
│   ├── commands/            # Command handlers
│   │   ├── tenant-member-add/
│   │   ├── tenant-member-update/
│   │   └── tenant-member-remove/
│   ├── queries/             # Query handlers
│   │   ├── tenant-member-find-by-id/
│   │   ├── tenant-member-find-by-criteria/
│   │   ├── tenant-member-find-by-tenant-id/
│   │   ├── tenant-member-find-by-user-id/
│   │   ├── tenant-member-find-by-tenant-id-and-user-id/
│   │   └── tenant-member-find-view-model-by-*
│   ├── event-handlers/      # Event handlers
│   │   ├── tenant-member-added/
│   │   ├── tenant-member-updated/
│   │   └── tenant-member-deleted/
│   ├── services/           # Application services
│   │   ├── assert-tenant-member-exsits/
│   │   ├── assert-tenant-member-not-exsits/
│   │   └── assert-tenant-member-view-model-exsits/
│   └── exceptions/         # Application exceptions
│       ├── tenant-member-not-found/
│       └── tenant-member-already-exists/
├── domain/                  # Domain layer
│   ├── aggregates/          # Tenant member aggregate
│   │   └── tenant-member.aggregate.ts
│   ├── repositories/       # Repository interfaces
│   │   ├── tenant-member-write.repository.ts
│   │   └── tenant-member-read.repository.ts
│   ├── value-objects/      # Value objects
│   │   └── tenant-member-role/
│   ├── view-models/        # Read models
│   │   └── tenant-member.view-model.ts
│   ├── factories/          # Domain factories
│   │   ├── tenant-member-aggregate.factory.ts
│   │   └── tenant-member-view-model.factory.ts
│   ├── enums/             # Domain enums
│   │   └── tenant-member-role.enum.ts
│   └── primitives/        # Domain primitives
│       └── tenant-member.primitives.ts
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

- **Commands**: Write operations (add, update, remove) that modify state
- **Queries**: Read operations (findById, findByCriteria, findByTenantId, etc.) that query data
- **Write Repository**: Prisma-based repository for write operations (PostgreSQL - Tenant database)
- **Read Repository**: MongoDB-based repository for read operations (optimized for queries)

#### Event-Driven Architecture

The module publishes domain events for important state changes:

- `TenantMemberAddedEvent` - Published when a user is added as a member to a tenant
- `TenantMemberUpdatedEvent` - Published when a tenant member's role is updated
- `TenantMemberRemovedEvent` - Published when a user is removed from a tenant

Events are handled asynchronously to update read models and trigger side effects.

#### Multi-Tenant Architecture

- All operations are tenant-aware
- Tenant context is automatically injected via `TenantContextService`
- Each tenant has isolated member records
- Write operations use master database Prisma client (tenant members are stored in master DB)
- Read operations use tenant-specific MongoDB databases
- **Tenant ID must be provided in every request** via `x-tenant-id` or `X-Tenant-Id` header
- The tenant ID is validated against the user's JWT token to ensure proper access control

## Domain Model

### Tenant Member Aggregate

The `TenantMemberAggregate` is the main domain entity that encapsulates tenant member business logic:

```typescript
class TenantMemberAggregate {
  id: TenantMemberUuidValueObject
  tenantId: TenantUuidValueObject
  userId: UserUuidValueObject
  role: TenantMemberRoleValueObject
  createdAt: DateValueObject
  updatedAt: DateValueObject
}
```

**Methods:**
- `update(props, generateEvent)`: Updates member role
- `delete(generateEvent)`: Marks member as removed
- `toPrimitives()`: Converts aggregate to primitive data

### Value Objects

The module uses value objects to encapsulate and validate domain concepts:

- **TenantMemberRoleValueObject**: Validates and encapsulates tenant member roles (OWNER, ADMIN, MEMBER, GUEST)

### View Model

The `TenantMemberViewModel` is optimized for read operations and stored in MongoDB for fast querying. View models are automatically synchronized via event handlers.

## Member Roles

Tenant members can have one of four roles:

### OWNER

The owner of the tenant with full control.

**Permissions:**
- Full control over the tenant
- Can manage all aspects of the tenant
- Can add/remove members
- Can delete the tenant
- Highest level of access

**Business Rules:**
- At least one OWNER should exist per tenant
- Cannot remove the last OWNER (validation should be implemented)

### ADMIN

Administrative access to the tenant.

**Permissions:**
- Administrative access to the tenant
- Can manage most tenant settings
- Can manage members (except owners)
- Cannot delete the tenant

### MEMBER

Standard member access.

**Permissions:**
- Can access tenant resources
- Limited to basic operations
- Cannot manage other members
- Cannot modify tenant settings

### GUEST

Read-only or limited access.

**Permissions:**
- Read-only or limited access
- Minimal permissions
- Cannot modify tenant settings
- Cannot access sensitive data

## Commands

Commands represent write operations that modify state:

### TenantMemberAddCommand

Adds a user as a member to a tenant with a specific role.

**Handler:** `TenantMemberAddCommandHandler`

**Process:**
1. Asserts tenant member does not already exist
2. Asserts tenant exists
3. Asserts user exists
4. Creates tenant member aggregate
5. Saves aggregate to write repository (Prisma - Tenant database)
6. Publishes `TenantMemberAddedEvent`
7. Returns tenant member ID

**Input:**
```typescript
{
  tenantId: string
  userId: string
  role: TenantMemberRoleEnum
}
```

**Output:** `string` (tenant member ID)

**Business Rules:**
- Tenant must exist
- User must exist (validated by User Context)
- User cannot already be a member of the tenant
- At least one OWNER should exist per tenant

### TenantMemberUpdateCommand

Updates a tenant member's role.

**Handler:** `TenantMemberUpdateCommandHandler`

**Process:**
1. Asserts tenant member exists
2. Updates aggregate role
3. Saves aggregate to write repository
4. Publishes `TenantMemberUpdatedEvent`

**Input:**
```typescript
{
  id: string
  role: TenantMemberRoleEnum
}
```

**Output:** `void`

**Business Rules:**
- Tenant member must exist
- Role must be valid
- Cannot remove the last OWNER (if applicable)

### TenantMemberRemoveCommand

Removes a user from a tenant.

**Handler:** `TenantMemberRemoveCommandHandler`

**Process:**
1. Asserts tenant member exists
2. Marks aggregate as deleted
3. Deletes record from write repository (soft delete)
4. Publishes `TenantMemberRemovedEvent`

**Input:**
```typescript
{
  id: string
}
```

**Output:** `void`

**Business Rules:**
- Tenant member must exist
- Cannot remove the last OWNER (validation should be implemented)

## Queries

Queries represent read operations that don't modify state:

### FindTenantMemberByIdQuery

Finds a tenant member aggregate by ID.

**Handler:** `FindTenantMemberByIdQueryHandler`

**Input:**
```typescript
{
  id: string
}
```

**Output:** `TenantMemberAggregate`

### FindTenantMembersByCriteriaQuery

Finds tenant members by criteria with pagination.

**Handler:** `FindTenantMembersByCriteriaQueryHandler`

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

**Output:** `PaginatedResult<TenantMemberViewModel>`

### FindTenantMemberByTenantIdQuery

Finds all members of a specific tenant.

**Handler:** `FindTenantMemberByTenantIdQueryHandler`

**Input:**
```typescript
{
  tenantId: string
}
```

**Output:** `TenantMemberAggregate[] | null`

### FindTenantMemberByUserIdQuery

Finds all tenants a user is a member of.

**Handler:** `FindTenantMemberByUserIdQueryHandler`

**Input:**
```typescript
{
  userId: string
}
```

**Output:** `TenantMemberAggregate[] | null`

### FindTenantMemberByTenantIdAndUserIdQuery

Finds a tenant member by tenant ID and user ID.

**Handler:** `FindTenantMemberByTenantIdAndUserIdQueryHandler`

**Input:**
```typescript
{
  tenantId: string
  userId: string
}
```

**Output:** `TenantMemberAggregate | null`

### FindTenantMemberViewModelByIdQuery

Finds a tenant member view model by ID (optimized for read operations).

**Handler:** `FindTenantMemberViewModelByIdQueryHandler`

**Input:**
```typescript
{
  id: string
}
```

**Output:** `TenantMemberViewModel`

### FindTenantMemberViewModelByTenantIdQuery

Finds all tenant member view models for a specific tenant.

**Handler:** `FindTenantMemberViewModelByTenantIdQueryHandler`

**Input:**
```typescript
{
  tenantId: string
}
```

**Output:** `TenantMemberViewModel[]`

## Events

The module publishes domain events for important state changes:

### TenantMemberAddedEvent

Published when a user is added as a member to a tenant.

**Handler:** `TenantMemberAddedEventHandler`

**Process:**
1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

This ensures read models are synchronized with write models.

**Subscribers:**
- Tenant module listens to update tenant member count

### TenantMemberUpdatedEvent

Published when a tenant member's role is updated.

**Handler:** `TenantMemberUpdatedEventHandler`

**Process:**
1. Creates or updates view model from event data
2. Saves view model to read repository (MongoDB)

**Subscribers:**
- Triggers role change notifications
- Updates audit logs

### TenantMemberRemovedEvent

Published when a user is removed from a tenant.

**Handler:** `TenantMemberRemovedEventHandler`

**Process:**
1. Asserts view model exists
2. Deletes view model from read repository (MongoDB)

**Subscribers:**
- Tenant module listens to update tenant member count

## Repositories

The module uses two repositories following CQRS pattern:

### Write Repository (Prisma)

**Interface:** `TenantMemberWriteRepository`

**Implementation:** `TenantMemberPrismaRepository`

**Database:** PostgreSQL (Master database)

**Operations:**
- `findById(id: string): Promise<TenantMemberAggregate | null>`
- `findByTenantId(tenantId: string): Promise<TenantMemberAggregate[] | null>`
- `findByUserId(userId: string): Promise<TenantMemberAggregate[] | null>`
- `findByTenantIdAndUserId(tenantId: string, userId: string): Promise<TenantMemberAggregate | null>`
- `save(tenantMember: TenantMemberAggregate): Promise<TenantMemberAggregate>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Uses master database (extends `BasePrismaMasterRepository`)
- Stores tenant members in master database for centralized management
- Soft delete support
- Unique constraint on `[tenantId, userId]` to prevent duplicate memberships

### Read Repository (MongoDB)

**Interface:** `TenantMemberReadRepository`

**Implementation:** `TenantMemberMongoRepository`

**Database:** MongoDB (Tenant-specific database)

**Operations:**
- `findById(id: string): Promise<TenantMemberViewModel | null>`
- `findByTenantId(tenantId: string): Promise<TenantMemberViewModel[] | null>`
- `findByUserId(userId: string): Promise<TenantMemberViewModel[] | null>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<TenantMemberViewModel>>`
- `save(tenantMemberViewModel: TenantMemberViewModel): Promise<void>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Tenant-aware (uses `BaseMongoTenantRepository`)
- Request-scoped for tenant context
- Optimized for read operations
- Supports complex queries with filters, sorts, and pagination

## GraphQL API

The module exposes a GraphQL API through two resolvers:

### Authentication & Authorization

All tenant member operations require authentication and tenant context. The module uses multiple guards to ensure security and proper tenant isolation.

### Required Headers

Every request to the tenant members API must include:

1. **Authorization Header** - JWT token for authentication
   ```http
   Authorization: Bearer <jwt-token>
   ```

2. **Tenant ID Header** - Tenant context for multi-tenant isolation
   ```http
   x-tenant-id: <tenant-uuid>
   ```
   or
   ```http
   X-Tenant-Id: <tenant-uuid>
   ```

### Guards

The module should apply the following guards to all endpoints:

1. **JwtAuthGuard** - Validates JWT token and extracts user information
2. **TenantGuard** - Validates tenant context and ensures user has access to the tenant
3. **RolesGuard** - Validates user has ADMIN or USER role
4. **TenantRolesGuard** - Validates user has appropriate tenant member role (OWNER, ADMIN, or MEMBER)

### Tenant Context Validation

- The `x-tenant-id` header is **required** for all operations
- The tenant ID must match one of the tenant IDs in the user's JWT token (`tenantIds` array)
- Users with ADMIN role can access any tenant
- Regular users can only access tenants they are members of
- If the tenant ID is missing or invalid, the request will be rejected with a `ForbiddenException`

### Example Request

```bash
curl -X POST http://localhost:4100/api/graphql \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "x-tenant-id: 123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { tenantMemberFindByCriteria(input: {}) { items { id userId role } } }"
  }'
```

### TenantMemberQueryResolver

Handles read operations (queries).

**Queries:**

#### tenantMemberFindByCriteria

Finds tenant members by criteria with pagination.

```graphql
query FindTenantMembersByCriteria($input: TenantMemberFindByCriteriaRequestDto) {
  tenantMemberFindByCriteria(input: $input) {
    items {
      id
      tenantId
      userId
      role
      createdAt
      updatedAt
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
        "field": "role",
        "operator": "EQUALS",
        "value": "ADMIN"
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

### TenantMemberMutationsResolver

Handles write operations (mutations).

**Mutations:**

#### tenantMemberAdd

Adds a user as a member to a tenant.

```graphql
mutation AddTenantMember($input: TenantMemberAddRequestDto!) {
  tenantMemberAdd(input: $input) {
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
    "userId": "user-uuid",
    "role": "ADMIN"
  }
}
```

**Response:**
```json
{
  "data": {
    "tenantMemberAdd": {
      "success": true,
      "message": "Tenant member added successfully",
      "id": "tenant-member-uuid"
    }
  }
}
```

#### tenantMemberUpdate

Updates a tenant member's role.

```graphql
mutation UpdateTenantMember($input: TenantMemberUpdateRequestDto!) {
  tenantMemberUpdate(input: $input) {
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
    "id": "tenant-member-uuid",
    "role": "MEMBER"
  }
}
```

#### tenantMemberRemove

Removes a user from a tenant.

```graphql
mutation RemoveTenantMember($input: TenantMemberRemoveRequestDto!) {
  tenantMemberRemove(input: $input) {
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
    "id": "tenant-member-uuid"
  }
}
```

## Examples

### Complete Tenant Member Lifecycle

```graphql
# 1. Add a member
mutation {
  tenantMemberAdd(input: {
    tenantId: "tenant-uuid"
    userId: "user-uuid"
    role: ADMIN
  }) {
    success
    message
    id
  }
}

# 2. Find members by tenant
query {
  tenantMemberFindByCriteria(input: {
    filters: [
      {
        field: "tenantId"
        operator: EQUALS
        value: "tenant-uuid"
      }
    ]
    pagination: {
      page: 1
      limit: 10
    }
  }) {
    items {
      id
      userId
      role
    }
    total
  }
}

# 3. Update member role
mutation {
  tenantMemberUpdate(input: {
    id: "member-uuid"
    role: MEMBER
  }) {
    success
    message
  }
}

# 4. Remove member
mutation {
  tenantMemberRemove(input: {
    id: "member-uuid"
  }) {
    success
    message
  }
}
```

### Query with Filters

```graphql
query {
  tenantMemberFindByCriteria(input: {
    filters: [
      {
        field: "role"
        operator: EQUALS
        value: "ADMIN"
      }
      {
        field: "tenantId"
        operator: EQUALS
        value: "tenant-uuid"
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
      userId
      role
      createdAt
    }
    total
    page
    limit
  }
}
```

## Troubleshooting

### Common Issues

1. **Tenant Member Not Found:**
   - Solution: Verify the tenant member ID exists
   - Check if the member was soft deleted

2. **Tenant Member Already Exists:**
   - Solution: Check if user is already a member of the tenant
   - Use `findByTenantIdAndUserId` to check existing membership

3. **Tenant Context Missing:**
   - Solution: Ensure `TenantGuard` is applied and tenant context is set in request headers
   - **Required Header:** `x-tenant-id: <tenant-uuid>`
   - The tenant ID must be included in every request
   - The tenant ID must match one of the tenant IDs in the user's JWT token
   - Error: `"Tenant ID is required. Please provide x-tenant-id header."`

4. **Cannot Remove Last Owner:**
   - Solution: Ensure at least one OWNER exists before removing
   - Implement validation to prevent removing the last OWNER

5. **User Not Found:**
   - Solution: Verify the user exists in the User Context
   - Check user ID is valid

6. **Tenant Not Found:**
   - Solution: Verify the tenant exists
   - Check tenant ID is valid

### Debugging

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed logs for:
- Member add/update/remove operations
- Repository operations
- Event handling

## Database Schema

### Prisma Schema (Master Database)

The tenant member model is stored in the master database:

```prisma
enum TenantMemberRoleEnum {
  OWNER
  ADMIN
  MEMBER
  GUEST
}

model TenantMember {
  id       String                @id @default(uuid())
  tenantId String
  userId   String
  role     TenantMemberRoleEnum

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([tenantId, userId])
  @@index([tenantId])
  @@index([userId])
  @@index([role])
}
```

**Note:** Tenant members are stored in the master database, not in tenant-specific databases. This allows for cross-tenant queries and centralized member management.

### MongoDB Schema (Read Database)

The MongoDB collection stores view models with the same structure as the Prisma model, optimized for read operations.

## Best Practices

1. **Role Hierarchy** - Implement proper role hierarchy checks (OWNER > ADMIN > MEMBER > GUEST)
2. **Last Owner Protection** - Ensure at least one OWNER exists per tenant
3. **Member Limits** - Respect tenant maxUsers limit when adding members
4. **Event Integration** - Subscribe to member events for cross-module integration
5. **Validation** - Always validate tenant and user existence before operations
6. **Bulk Operations** - Use view model queries for performance-critical operations
7. **Tenant Isolation** - Always include `x-tenant-id` header for proper tenant context

## Integration with Other Modules

### User Context

- Links users to tenants through tenant members
- Validates user existence before adding members

### Tenant Context

- Tenant module listens to member events
- Updates tenant member counts
- Enforces maxUsers limits

### Auth Context

- Uses member roles for authorization
- Validates tenant membership for access control
- `TenantRolesGuard` uses tenant member roles for authorization

## License

This module is part of the SaaS Boilerplate project.

