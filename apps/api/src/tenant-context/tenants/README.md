# Tenants Module

A comprehensive module for managing tenants in a multi-tenant SaaS application. This module handles tenant lifecycle, configuration, branding, resource limits, and automatic database provisioning. It follows Clean Architecture principles, implements CQRS pattern, and uses Domain-Driven Design.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Tenant Status](#tenant-status)
- [Commands](#commands)
- [Queries](#queries)
- [Events](#events)
- [Sagas](#sagas)
- [Repositories](#repositories)
- [GraphQL API](#graphql-api)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

The Tenants Module provides a complete solution for managing tenants in a multi-tenant SaaS application. It handles tenant creation, configuration, branding, resource limits, and automatically provisions tenant databases.

### Features

- ✅ Tenant creation, update, and deletion
- ✅ Automatic database provisioning via saga
- ✅ Tenant status management (ACTIVE, INACTIVE, BLOCKED)
- ✅ Comprehensive tenant configuration (branding, contact info, localization, resource limits)
- ✅ Unique slug generation and validation
- ✅ GraphQL API for tenant operations
- ✅ Event-driven architecture
- ✅ Saga pattern for complex workflows
- ✅ CQRS pattern with separate read/write repositories
- ✅ Domain-driven design with value objects and aggregates

## Architecture

The module is organized following Clean Architecture principles:

```
tenants/
├── application/              # Application layer (CQRS)
│   ├── commands/            # Command handlers
│   │   ├── tenant-create/
│   │   ├── tenant-update/
│   │   └── tenant-delete/
│   ├── queries/             # Query handlers
│   │   ├── find-tenant-by-id/
│   │   └── find-tenants-by-criteria/
│   ├── event-handlers/      # Event handlers
│   │   ├── tenant-created/
│   │   ├── tenant-updated/
│   │   ├── tenant-deleted/
│   │   ├── tenant-member-added/
│   │   └── tenant-member-removed/
│   ├── sagas/              # Saga orchestrators
│   │   └── tenant-created-provision-database/
│   ├── services/           # Application services
│   │   ├── assert-tenant-exsits/
│   │   ├── assert-tenant-slug-is-unique/
│   │   └── assert-tenant-view-model-exsits/
│   └── exceptions/         # Application exceptions
│       ├── tenant-not-found/
│       └── tenant-slug-is-not-unique/
├── domain/                  # Domain layer
│   ├── aggregates/          # Tenant aggregate
│   │   └── tenant.aggregate.ts
│   ├── repositories/       # Repository interfaces
│   │   ├── tenant-write.repository.ts
│   │   └── tenant-read.repository.ts
│   ├── value-objects/      # Value objects (20+)
│   │   ├── tenant-name/
│   │   ├── tenant-slug/
│   │   ├── tenant-status/
│   │   ├── tenant-email/
│   │   └── ... (many more)
│   ├── view-models/        # Read models
│   │   ├── tenant/
│   │   └── tenant-member/
│   ├── factories/          # Domain factories
│   │   ├── tenant-aggregate.factory.ts
│   │   └── tenant-view-model.factory.ts
│   ├── enums/             # Domain enums
│   │   └── tenant-status.enum.ts
│   └── primitives/        # Domain primitives
│       └── tenant.primitives.ts
├── infrastructure/         # Infrastructure layer
│   └── database/          # Database repositories
│       ├── prisma/        # Write repository (Prisma/PostgreSQL - Master DB)
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
- **Queries**: Read operations (findById, findByCriteria) that query data
- **Write Repository**: Prisma-based repository for write operations (PostgreSQL - Master database)
- **Read Repository**: MongoDB-based repository for read operations (optimized for queries)

#### Event-Driven Architecture

The module publishes domain events for important state changes:

- `TenantCreatedEvent` - Published when a tenant is created
- `TenantUpdatedEvent` - Published when a tenant is updated
- `TenantDeletedEvent` - Published when a tenant is deleted

The module also listens to events from other modules:

- `TenantMemberAddedEvent` - Updates tenant view model with new member
- `TenantMemberRemovedEvent` - Updates tenant view model when member is removed

#### Saga Pattern

The module implements a saga for complex workflows:

- **TenantCreatedProvisionDatabaseSaga** - Orchestrates automatic database provisioning when a tenant is created
  - Step 1: Provisions tenant database
  - Step 2: Runs initial migrations
  - Error handling and compensation

#### Multi-Tenant Architecture

- Tenants are stored in the master database (not tenant-specific)
- This allows for cross-tenant queries and centralized tenant management
- Tenant context is used for tenant-specific data operations
- **Note:** Tenant operations themselves don't require `x-tenant-id` header as they operate on the master database

## Domain Model

### Tenant Aggregate

The `TenantAggregate` is the main domain entity that encapsulates tenant business logic:

```typescript
class TenantAggregate {
  id: TenantUuidValueObject
  name: TenantNameValueObject
  slug: TenantSlugValueObject
  description: TenantDescriptionValueObject | null
  websiteUrl: TenantWebsiteUrlValueObject | null
  logoUrl: TenantLogoUrlValueObject | null
  faviconUrl: TenantFaviconUrlValueObject | null
  primaryColor: TenantPrimaryColorValueObject | null
  secondaryColor: TenantSecondaryColorValueObject | null
  status: TenantStatusValueObject
  email: TenantEmailValueObject | null
  phoneNumber: TenantPhoneNumberValueObject | null
  phoneCode: TenantPhoneCodeValueObject | null
  address: TenantAddressValueObject | null
  city: TenantCityValueObject | null
  state: TenantStateValueObject | null
  country: TenantCountryValueObject | null
  postalCode: TenantPostalCodeValueObject | null
  timezone: TenantTimezoneValueObject | null
  locale: TenantLocaleValueObject | null
  maxUsers: TenantMaxUsersValueObject | null
  maxStorage: TenantMaxStorageValueObject | null
  maxApiCalls: TenantMaxApiCallsValueObject | null
  createdAt: DateValueObject
  updatedAt: DateValueObject
}
```

**Methods:**
- `update(props, generateEvent)`: Updates tenant properties
- `delete(generateEvent)`: Marks tenant as deleted
- `toPrimitives()`: Converts aggregate to primitive data

### Value Objects

The module uses many value objects to encapsulate and validate domain concepts:

**Identity & Basic Info:**
- **TenantNameValueObject**: Validates tenant name
- **TenantSlugValueObject**: Validates and ensures unique slug
- **TenantDescriptionValueObject**: Validates description
- **TenantStatusValueObject**: Validates status enum

**Branding:**
- **TenantWebsiteUrlValueObject**: Validates website URL
- **TenantLogoUrlValueObject**: Validates logo URL
- **TenantFaviconUrlValueObject**: Validates favicon URL
- **TenantPrimaryColorValueObject**: Validates primary color (hex)
- **TenantSecondaryColorValueObject**: Validates secondary color (hex)

**Contact Information:**
- **TenantEmailValueObject**: Validates email format
- **TenantPhoneNumberValueObject**: Validates phone number
- **TenantPhoneCodeValueObject**: Validates phone country code
- **TenantAddressValueObject**: Validates address
- **TenantCityValueObject**: Validates city
- **TenantStateValueObject**: Validates state/province
- **TenantCountryValueObject**: Validates country
- **TenantPostalCodeValueObject**: Validates postal/ZIP code

**Localization:**
- **TenantTimezoneValueObject**: Validates timezone
- **TenantLocaleValueObject**: Validates locale code

**Resource Limits:**
- **TenantMaxUsersValueObject**: Validates maximum users limit
- **TenantMaxStorageValueObject**: Validates maximum storage limit (bytes)
- **TenantMaxApiCallsValueObject**: Validates maximum API calls limit

### View Model

The `TenantViewModel` is optimized for read operations and stored in MongoDB for fast querying. View models are automatically synchronized via event handlers.

## Tenant Status

Tenants can have one of three statuses:

### ACTIVE

The tenant is active and can be used.

**Characteristics:**
- Tenant is operational
- Users can access tenant resources
- Default status for new tenants

### INACTIVE

The tenant is inactive and cannot be used.

**Characteristics:**
- Tenant exists but is not operational
- Users cannot access tenant resources
- Can be reactivated later

### BLOCKED

The tenant is blocked and cannot be used.

**Characteristics:**
- Tenant is blocked (e.g., due to violations)
- Users cannot access tenant resources
- Requires manual intervention to unblock

## Commands

Commands represent write operations that modify state:

### TenantCreateCommand

Creates a new tenant.

**Handler:** `TenantCreateCommandHandler`

**Process:**
1. Asserts tenant slug is unique
2. Creates tenant aggregate
3. Saves aggregate to write repository (Prisma - Master database)
4. Publishes `TenantCreatedEvent`
5. Returns tenant ID

**Input:**
```typescript
{
  name: string  // Required
  slug?: string  // Optional, auto-generated from name if not provided
  description?: string
  websiteUrl?: string
  logoUrl?: string
  faviconUrl?: string
  primaryColor?: string
  secondaryColor?: string
  email?: string
  phoneNumber?: string
  phoneCode?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  timezone?: string  // Defaults to UTC
  locale?: string  // Defaults to 'en'
  maxUsers?: number
  maxStorage?: number
  maxApiCalls?: number
}
```

**Output:** `string` (tenant ID)

**Business Rules:**
- Slug is auto-generated from name if not provided
- Slug must be unique across all tenants
- Status defaults to ACTIVE
- Timezone defaults to UTC if not provided
- Locale defaults to 'en' if not provided

**Events Published:**
- `TenantCreatedEvent` - Published when tenant is created
  - Triggers `TenantCreatedProvisionDatabaseSaga` to automatically provision database

### TenantUpdateCommand

Updates an existing tenant's properties.

**Handler:** `TenantUpdateCommandHandler`

**Process:**
1. Asserts tenant exists
2. Updates aggregate properties
3. Saves aggregate to write repository
4. Publishes `TenantUpdatedEvent`

**Input:**
```typescript
{
  id: string  // Required
  // All other properties are optional
  name?: string
  slug?: string  // Cannot be changed if tenant already exists
  description?: string
  websiteUrl?: string
  logoUrl?: string
  faviconUrl?: string
  primaryColor?: string
  secondaryColor?: string
  status?: TenantStatusEnum
  email?: string
  phoneNumber?: string
  phoneCode?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  timezone?: string
  locale?: string
  maxUsers?: number
  maxStorage?: number
  maxApiCalls?: number
}
```

**Output:** `void`

**Business Rules:**
- Tenant must exist
- Slug cannot be changed (it's immutable)
- If slug would change, validation fails

**Events Published:**
- `TenantUpdatedEvent` - Published when tenant is updated

### TenantDeleteCommand

Deletes a tenant from the system.

**Handler:** `TenantDeleteCommandHandler`

**Process:**
1. Asserts tenant exists
2. Marks aggregate as deleted
3. Deletes record from write repository (soft delete)
4. Publishes `TenantDeletedEvent`

**Input:**
```typescript
{
  id: string
}
```

**Output:** `void`

**Business Rules:**
- Tenant must exist
- Associated tenant members and database are handled separately

**Events Published:**
- `TenantDeletedEvent` - Published when tenant is deleted

## Queries

Queries represent read operations that don't modify state:

### FindTenantByIdQuery

Finds a tenant aggregate by ID.

**Handler:** `FindTenantByIdQueryHandler`

**Input:**
```typescript
{
  id: string
}
```

**Output:** `TenantAggregate`

### FindTenantsByCriteriaQuery

Finds tenants by criteria with pagination.

**Handler:** `FindTenantsByCriteriaQueryHandler`

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

**Output:** `PaginatedResult<TenantViewModel>`

## Events

The module publishes domain events for important state changes:

### TenantCreatedEvent

Published when a tenant is created.

**Handler:** `TenantCreatedEventHandler`

**Process:**
1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

**Saga Trigger:**
- `TenantCreatedProvisionDatabaseSaga` - Automatically provisions tenant database

### TenantUpdatedEvent

Published when a tenant is updated.

**Handler:** `TenantUpdatedEventHandler`

**Process:**
1. Creates or updates view model from event data
2. Saves view model to read repository (MongoDB)

### TenantDeletedEvent

Published when a tenant is deleted.

**Handler:** `TenantDeletedEventHandler`

**Process:**
1. Asserts view model exists
2. Deletes view model from read repository (MongoDB)

### Event Listeners

The module also listens to events from other modules:

#### TenantMemberAddedEvent

**Handler:** `TenantMemberAddedEventHandler`

**Process:**
1. Finds all tenant members for the tenant
2. Updates tenant view model with new member list
3. Saves updated view model to read repository

#### TenantMemberRemovedEvent

**Handler:** `TenantMemberRemovedEventHandler`

**Process:**
1. Finds all tenant members for the tenant
2. Updates tenant view model with updated member list
3. Saves updated view model to read repository

## Sagas

### TenantCreatedProvisionDatabaseSaga

Orchestrates the automatic provisioning of a tenant database when a new tenant is created.

**Trigger:** `TenantCreatedEvent`

**Process:**
1. **Step 1: Provision Database**
   - Calls `TenantDatabaseProvisioningService.createTenantDatabase()`
   - Creates PostgreSQL database for the tenant
   - Updates database status to ACTIVE

2. **Step 2: Run Migrations**
   - Calls `TenantDatabaseMigrationService.migrateTenantDatabase()`
   - Runs Prisma migrations on the new database
   - Updates database with migration info

**Error Handling:**
- If provisioning fails, database status is set to FAILED
- Error messages are logged
- Tenant database record remains for manual retry

**Compensation:**
- Currently logs errors for manual intervention
- In production, could implement:
  - Automatic retry mechanism
  - Alert notifications
  - Rollback procedures

## Repositories

The module uses two repositories following CQRS pattern:

### Write Repository (Prisma)

**Interface:** `TenantWriteRepository`

**Implementation:** `TenantPrismaRepository`

**Database:** PostgreSQL (Master database)

**Operations:**
- `findById(id: string): Promise<TenantAggregate | null>`
- `findBySlug(slug: string): Promise<TenantAggregate | null>`
- `save(tenant: TenantAggregate): Promise<TenantAggregate>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Stores tenants in master database (not tenant-specific)
- Allows cross-tenant queries
- Indexed on `slug` for performance
- Soft delete support

### Read Repository (MongoDB)

**Interface:** `TenantReadRepository`

**Implementation:** `TenantMongoRepository`

**Database:** MongoDB

**Operations:**
- `findById(id: string): Promise<TenantViewModel | null>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<TenantViewModel>>`
- `save(tenantViewModel: TenantViewModel): Promise<void>`
- `delete(id: string): Promise<boolean>`

**Features:**
- Optimized for read operations
- Supports complex queries with filters, sorts, and pagination

## GraphQL API

The module exposes a GraphQL API through two resolvers:

### Authentication & Authorization

> **Note:** Currently, the tenant resolvers do not have authentication guards applied. This is intentional as tenant operations are typically performed by system administrators or automated processes. However, you should add appropriate guards based on your security requirements.

**Recommended Guards:**
- `JwtAuthGuard`: Requires authentication
- `RolesGuard`: Requires ADMIN role only
- **Note:** Tenant operations don't require `x-tenant-id` header as they operate on the master database

### TenantQueryResolver

Handles read operations (queries).

**Queries:**

#### tenantFindByCriteria

Finds tenants by criteria with pagination.

```graphql
query FindTenantsByCriteria($input: TenantFindByCriteriaRequestDto) {
  tenantFindByCriteria(input: $input) {
    items {
      id
      name
      slug
      status
      description
      websiteUrl
      logoUrl
      email
      maxUsers
      maxStorage
      createdAt
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

### TenantMutationsResolver

Handles write operations (mutations).

**Mutations:**

#### tenantCreate

Creates a new tenant.

```graphql
mutation CreateTenant($input: TenantCreateRequestDto!) {
  tenantCreate(input: $input) {
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
    "name": "Acme Corporation",
    "description": "Leading technology company",
    "email": "contact@acme.com",
    "websiteUrl": "https://acme.com",
    "primaryColor": "#FF5733",
    "timezone": "America/New_York",
    "locale": "en-US",
    "maxUsers": 100,
    "maxStorage": 1073741824
  }
}
```

**Response:**
```json
{
  "data": {
    "tenantCreate": {
      "success": true,
      "message": "Tenant created successfully",
      "id": "tenant-uuid"
    }
  }
}
```

**Process:**
1. Validates slug uniqueness
2. Creates tenant aggregate
3. Saves to master database
4. Publishes `TenantCreatedEvent`
5. Saga automatically provisions database

#### tenantUpdate

Updates an existing tenant.

```graphql
mutation UpdateTenant($input: TenantUpdateRequestDto!) {
  tenantUpdate(input: $input) {
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
    "id": "tenant-uuid",
    "description": "Updated description",
    "status": "ACTIVE",
    "maxUsers": 200
  }
}
```

#### tenantDelete

Deletes a tenant.

```graphql
mutation DeleteTenant($input: TenantDeleteRequestDto!) {
  tenantDelete(input: $input) {
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
    "id": "tenant-uuid"
  }
}
```

## Examples

### Complete Tenant Lifecycle

```graphql
# 1. Create tenant
mutation {
  tenantCreate(input: {
    name: "Acme Corporation"
    description: "Leading technology company"
    email: "contact@acme.com"
    websiteUrl: "https://acme.com"
    primaryColor: "#FF5733"
    timezone: "America/New_York"
    locale: "en-US"
    maxUsers: 100
    maxStorage: 1073741824
  }) {
    success
    message
    id
  }
}

# 2. Find tenant by criteria
query {
  tenantFindByCriteria(input: {
    filters: [
      {
        field: "status"
        operator: EQUALS
        value: "ACTIVE"
      }
    ]
    pagination: {
      page: 1
      limit: 10
    }
  }) {
    items {
      id
      name
      slug
      status
      maxUsers
    }
    total
  }
}

# 3. Update tenant
mutation {
  tenantUpdate(input: {
    id: "tenant-uuid"
    description: "Updated description"
    maxUsers: 200
  }) {
    success
    message
  }
}

# 4. Delete tenant
mutation {
  tenantDelete(input: {
    id: "tenant-uuid"
  }) {
    success
    message
  }
}
```

### Query with Filters

```graphql
query {
  tenantFindByCriteria(input: {
    filters: [
      {
        field: "status"
        operator: EQUALS
        value: "ACTIVE"
      }
      {
        field: "maxUsers"
        operator: GREATER_THAN
        value: 50
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
      name
      slug
      status
      maxUsers
      maxStorage
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

1. **Tenant Not Found:**
   - Solution: Verify the tenant ID exists
   - Check if the tenant was soft deleted

2. **Tenant Slug Is Not Unique:**
   - Solution: Slug must be unique across all tenants
   - Use a different name or provide a custom unique slug
   - Error: `TenantSlugIsNotUniqueException`

3. **Database Provisioning Failed:**
   - Solution: Check tenant database status
   - Review provisioning service logs
   - Verify PostgreSQL connection and permissions
   - Manually retry database provisioning if needed

4. **Migration Failed:**
   - Solution: Check tenant database migration status
   - Review migration service logs
   - Verify Prisma schema is correct
   - Manually run migrations if needed

5. **Saga Execution Failed:**
   - Solution: Check saga logs for detailed error messages
   - Verify database provisioning service is available
   - Check migration service configuration
   - Tenant database will remain in PROVISIONING or FAILED status

### Debugging

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed logs for:
- Tenant creation/update/delete operations
- Database provisioning
- Migration execution
- Repository operations
- Event handling
- Saga execution

## Database Schema

### Prisma Schema (Master Database)

```prisma
enum TenantStatusEnum {
  ACTIVE
  INACTIVE
  BLOCKED
}

model Tenant {
  id             String           @id @default(uuid())
  name           String
  slug           String           @unique
  description    String?
  websiteUrl     String?
  logoUrl        String?
  faviconUrl     String?
  primaryColor   String?
  secondaryColor String?
  status         TenantStatusEnum @default(ACTIVE)
  email          String?
  phoneNumber    String?
  phoneCode      String?
  address        String?
  city           String?
  state          String?
  country        String?
  postalCode     String?
  timezone       String           @default("UTC")
  locale         String           @default("en")
  maxUsers       Int?
  maxStorage     Int?
  maxApiCalls    Int?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  members      TenantMember[]
  subscription Subscription?
  database     TenantDatabase?

  @@index([slug])
  @@index([status])
}
```

**Note:** Tenants are stored in the master database, not in tenant-specific databases. This allows for:
- Cross-tenant queries
- Centralized tenant management
- Efficient tenant lookup
- Simplified tenant administration

### MongoDB Schema (Read Database)

The MongoDB collection stores view models with the same structure as the Prisma model, optimized for read operations.

## Best Practices

1. **Slug Generation** - Slugs are auto-generated from names. Ensure names are meaningful and unique.
2. **Status Management** - Use INACTIVE for temporary deactivation, BLOCKED for violations.
3. **Resource Limits** - Set appropriate limits based on subscription tiers.
4. **Event Handling** - Subscribe to tenant events for cross-module integration.
5. **Validation** - All value objects validate input data automatically.
6. **Database Provisioning** - Monitor saga execution for automatic database provisioning.
7. **Slug Immutability** - Slugs cannot be changed after creation. Choose carefully.

## Integration with Other Modules

### Tenant Database Module

- Automatically provisions tenant database via saga
- Listens to tenant creation events
- Manages tenant database lifecycle

### Tenant Members Module

- Listens to tenant member events
- Updates tenant view model with member information
- Tracks member count for resource limits

### User Context

- Links users to tenants through tenant members
- Validates user existence

### Auth Context

- Uses tenant information for authorization
- Validates tenant access

## License

This module is part of the SaaS Boilerplate project.

