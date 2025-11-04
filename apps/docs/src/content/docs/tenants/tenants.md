---
title: Tenants
description: Complete guide to tenant management
---

The **Tenants** module provides comprehensive tenant management capabilities, allowing you to create, configure, and manage tenant entities in your multi-tenant SaaS application.

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

### TenantMemberAddedEvent

Published when a member is added to a tenant (handled by Tenant Members module, but tenant listens to it).

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

## Best Practices

1. **Slug Generation** - Slugs are auto-generated from names. Ensure names are meaningful.
2. **Status Management** - Use INACTIVE for temporary deactivation, BLOCKED for violations.
3. **Resource Limits** - Set appropriate limits based on subscription tiers.
4. **Event Handling** - Subscribe to tenant events for cross-module integration.
5. **Validation** - All value objects validate input data automatically.

## Error Handling

The module throws the following exceptions:

- **TenantNotFoundException** - Tenant does not exist
- **TenantSlugIsNotUniqueException** - Slug is already in use

## Example Usage

### Creating a Tenant

```graphql
mutation {
  tenantCreate(
    input: {
      name: "Acme Corporation"
      description: "Leading technology company"
      email: "contact@acme.com"
      websiteUrl: "https://acme.com"
      primaryColor: "#FF5733"
      timezone: "America/New_York"
      locale: "en-US"
      maxUsers: 100
      maxStorage: 1073741824
    }
  ) {
    success
    message
    id
  }
}
```

### Finding Tenants

```graphql
query {
  tenantFindByCriteria(
    input: {
      filters: { status: "ACTIVE" }
      pagination: { page: 1, pageSize: 10 }
      sorts: [{ field: "name", direction: ASC }]
    }
  ) {
    data {
      id
      name
      slug
      status
    }
    total
    page
    pageSize
  }
}
```
