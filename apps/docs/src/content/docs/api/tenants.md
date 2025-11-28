---
title: Tenants
description: Complete guide to tenant management
---

The **Tenants** module provides comprehensive tenant management capabilities, allowing you to create, configure, and manage tenant entities in your multi-tenant SaaS application. It handles tenant lifecycle, configuration, branding, resource limits, and automatically provisions tenant databases.

> **Important:** Tenant operations are typically performed by system administrators or automated processes. While the current implementation doesn't enforce authentication guards, you should add appropriate security measures based on your requirements. **Note:** Tenant operations don't require `x-tenant-id` header as they operate on the master database.

## Tenant Entity

A tenant represents an isolated customer or organization in your SaaS application. Each tenant has:

- **Unique identifier** - UUID-based tenant ID
- **Unique slug** - Human-readable identifier (auto-generated from name)
- **Configuration** - Branding, contact info, localization, and resource limits
- **Status** - Active, Inactive, or Blocked
- **Lifecycle events** - Created, Updated, Deleted events

## Tenant Properties

### Required Properties

- **name** - Tenant name (used to generate slug)
- **slug** - Unique identifier (auto-generated, validated for uniqueness)

### Optional Properties

#### Branding

- **description** - Tenant description
- **websiteUrl** - Tenant website URL
- **logoUrl** - Tenant logo URL
- **faviconUrl** - Tenant favicon URL
- **primaryColor** - Primary brand color
- **secondaryColor** - Secondary brand color

#### Contact Information

- **email** - Contact email
- **phoneNumber** - Phone number
- **phoneCode** - Phone country code
- **address** - Street address
- **city** - City
- **state** - State/Province
- **country** - Country
- **postalCode** - Postal/ZIP code

#### Localization

- **timezone** - Timezone (defaults to UTC)
- **locale** - Locale code (defaults to 'en')

#### Resource Limits

- **maxUsers** - Maximum number of users allowed
- **maxStorage** - Maximum storage in bytes
- **maxApiCalls** - Maximum API calls per period

## Tenant Status

Tenants can have one of three statuses:

- **ACTIVE** - Tenant is active and operational
- **INACTIVE** - Tenant is inactive (cannot be used)
- **BLOCKED** - Tenant is blocked (cannot be used)

## Authentication & Authorization

> **Note:** Currently, the tenant resolvers do not have authentication guards applied. This is intentional as tenant operations are typically performed by system administrators or automated processes. However, you should add appropriate guards based on your security requirements.

**Recommended Guards:**
- `JwtAuthGuard`: Requires authentication
- `RolesGuard`: Requires ADMIN role only

**Important:** Tenant operations don't require `x-tenant-id` header as they operate on the master database (not tenant-specific databases).

## Automatic Database Provisioning

When a tenant is created, a **Saga** automatically provisions the tenant's database:

1. **Step 1: Provision Database**
   - Creates PostgreSQL database for the tenant
   - Updates database status to ACTIVE

2. **Step 2: Run Migrations**
   - Runs Prisma migrations on the new database
   - Updates database with migration info

**Saga:** `TenantCreatedProvisionDatabaseSaga`

**Error Handling:**
- If provisioning fails, database status is set to FAILED
- Error messages are logged
- Tenant database record remains for manual retry

## Commands

### Create Tenant

Creates a new tenant with the provided configuration.

**GraphQL Mutation:**

```graphql
mutation CreateTenant($input: TenantCreateRequestDto!) {
  tenantCreate(input: $input) {
    success
    message
    id
  }
}
```

**Input Parameters:**

- `name` (required) - Tenant name
- `description` (optional) - Description
- `websiteUrl` (optional) - Website URL
- `logoUrl` (optional) - Logo URL
- `faviconUrl` (optional) - Favicon URL
- `primaryColor` (optional) - Primary color (hex)
- `secondaryColor` (optional) - Secondary color (hex)
- `email` (optional) - Contact email
- `phoneNumber` (optional) - Phone number
- `phoneCode` (optional) - Phone country code
- `address` (optional) - Street address
- `city` (optional) - City
- `state` (optional) - State/Province
- `country` (optional) - Country
- `postalCode` (optional) - Postal code
- `timezone` (optional) - Timezone (defaults to UTC)
- `locale` (optional) - Locale (defaults to 'en')
- `maxUsers` (optional) - Maximum users
- `maxStorage` (optional) - Maximum storage (bytes)
- `maxApiCalls` (optional) - Maximum API calls

**Business Rules:**

- Slug is auto-generated from the name
- Slug must be unique across all tenants
- Status defaults to ACTIVE
- Timezone defaults to UTC if not provided
- Locale defaults to 'en' if not provided

**Events Published:**

- `TenantCreatedEvent` - Published when tenant is created
  - Triggers `TenantCreatedProvisionDatabaseSaga` to automatically provision database

**Automatic Actions:**
- Database is automatically provisioned via saga
- Initial migrations are run automatically

### Update Tenant

Updates an existing tenant's properties.

**GraphQL Mutation:**

```graphql
mutation UpdateTenant($input: TenantUpdateRequestDto!) {
  tenantUpdate(input: $input) {
    success
    message
    id
  }
}
```

**Input Parameters:**

- `id` (required) - Tenant ID
- All optional properties from Create Tenant
- `status` (optional) - Tenant status (ACTIVE, INACTIVE, BLOCKED)

**Business Rules:**

- Tenant must exist
- Slug cannot be changed (it's immutable)
- If slug would change, validation fails

**Events Published:**

- `TenantUpdatedEvent` - Published when tenant is updated

### Delete Tenant

Deletes a tenant from the system.

**GraphQL Mutation:**

```graphql
mutation DeleteTenant($input: TenantDeleteRequestDto!) {
  tenantDelete(input: $input) {
    success
    message
    id
  }
}
```

**Input Parameters:**

- `id` (required) - Tenant ID

**Business Rules:**

- Tenant must exist
- Associated tenant members are handled separately

**Events Published:**

- `TenantDeletedEvent` - Published when tenant is deleted

## GraphQL API

### Queries

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

### Mutations

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

## Queries

### Find Tenant by ID

Retrieves a single tenant by its ID.

**GraphQL Query:**

```graphql
query FindTenantById($id: String!) {
  tenantFindById(id: $id) {
    id
    name
    slug
    description
    status
    # ... other properties
  }
}
```

**Returns:**

- `TenantAggregate` - The tenant aggregate root

**Throws:**

- `TenantNotFoundException` - If tenant does not exist

### Find Tenants by Criteria

Searches for tenants matching specified criteria with filtering, sorting, and pagination.

**GraphQL Query:**

```graphql
query FindTenantsByCriteria($input: TenantFindByCriteriaRequestDto) {
  tenantFindByCriteria(input: $input) {
    data {
      id
      name
      slug
      status
      # ... other properties
    }
    total
    page
    pageSize
    totalPages
  }
}
```

**Input Parameters:**

- `filters` (optional) - Filter criteria
- `sorts` (optional) - Sort criteria
- `pagination` (optional) - Pagination settings

**Returns:**

- `PaginatedTenantResultDto` - Paginated list of tenants

## Domain Events

The Tenants module publishes the following domain events:

### TenantCreatedEvent

Published when a new tenant is created.

**Event Properties:**

- `aggregateId` - Tenant ID
- `aggregateType` - "TenantAggregate"
- `eventType` - "TenantCreatedEvent"
- `data` - Tenant primitives

### TenantUpdatedEvent

Published when a tenant is updated.

**Event Properties:**

- `aggregateId` - Tenant ID
- `aggregateType` - "TenantAggregate"
- `eventType` - "TenantUpdatedEvent"
- `data` - Updated tenant primitives

### TenantDeletedEvent

Published when a tenant is deleted.

**Event Properties:**

- `aggregateId` - Tenant ID
- `aggregateType` - "TenantAggregate"
- `eventType` - "TenantDeletedEvent"
- `data` - Deleted tenant primitives

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

## Value Objects

The module uses value objects to ensure data integrity:

- **TenantNameValueObject** - Validates tenant name
- **TenantSlugValueObject** - Validates and generates unique slugs
- **TenantEmailValueObject** - Validates email format
- **TenantStatusValueObject** - Ensures valid status values
- **TenantMaxUsersValueObject** - Validates maximum users limit
- **TenantMaxStorageValueObject** - Validates maximum storage limit
- **TenantMaxApiCallsValueObject** - Validates maximum API calls limit
- And many more for address, colors, URLs, etc.

## Repositories

The module uses a dual repository pattern:

### Write Repository (Prisma)

- Used for command operations (create, update, delete)
- Implements `TenantWriteRepository`
- Uses Prisma ORM for database operations
- **Stores data in Master Database** (not tenant-specific database)
- This allows for cross-tenant queries and centralized tenant management

### Read Repository (MongoDB)

- Used for query operations (find by id, find by criteria)
- Implements `TenantReadRepository`
- Uses MongoDB for optimized read performance

## Services

### AssertTenantExistsService

Validates that a tenant exists by ID.

**Throws:**

- `TenantNotFoundException` - If tenant does not exist

### AssertTenantSlugIsUniqueService

Validates that a tenant slug is unique.

**Throws:**

- `TenantSlugIsNotUniqueException` - If slug already exists

### AssertTenantViewModelExistsService

Validates that a tenant view model exists (for read operations).

## Database Schema

### Prisma Schema (Master Database)

Tenants are stored in the master database, not in tenant-specific databases:

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

**Note:** Storing tenants in the master database allows for:
- Cross-tenant queries
- Centralized tenant management
- Efficient tenant lookup
- Simplified tenant administration

### MongoDB Schema (Read Database)

The MongoDB collection stores view models with the same structure, optimized for read operations.

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

## Best Practices

1. **Slug Generation** - Slugs are auto-generated from names. Ensure names are meaningful and unique.
2. **Status Management** - Use INACTIVE for temporary deactivation, BLOCKED for violations.
3. **Resource Limits** - Set appropriate limits based on subscription tiers.
4. **Event Handling** - Subscribe to tenant events for cross-module integration.
5. **Validation** - All value objects validate input data automatically.
6. **Database Provisioning** - Monitor saga execution for automatic database provisioning.
7. **Slug Immutability** - Slugs cannot be changed after creation. Choose carefully.

## Error Handling

The module throws the following exceptions:

- **TenantNotFoundException** - Tenant does not exist
- **TenantSlugIsNotUniqueException** - Slug is already in use

## Example Usage

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
