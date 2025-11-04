---
title: Tenant Members
description: Complete guide to tenant member management
---

The **Tenant Members** module manages user membership within tenants. It provides role-based access control and enables you to associate users with tenants and manage their permissions.

## Tenant Member Entity

A tenant member represents the relationship between a user and a tenant, including their role and permissions.

### Properties

- **id** - Unique tenant member identifier (UUID)
- **tenantId** - The tenant this member belongs to
- **userId** - The user who is a member
- **role** - The member's role (OWNER, ADMIN, MEMBER, GUEST)

## Member Roles

The module supports four role types:

### OWNER

- Full control over the tenant
- Can manage all aspects of the tenant
- Can add/remove members
- Highest level of access

### ADMIN

- Administrative access to the tenant
- Can manage most tenant settings
- Can manage members (except owners)
- Cannot delete the tenant

### MEMBER

- Standard member access
- Can access tenant resources
- Limited to basic operations
- Cannot manage other members

### GUEST

- Read-only or limited access
- Minimal permissions
- Cannot modify tenant settings

## Commands

### Add Tenant Member

Adds a user as a member to a tenant with a specific role.

**GraphQL Mutation:**

```graphql
mutation AddTenantMember($input: TenantMemberAddRequestDto!) {
  tenantMemberAdd(input: $input) {
    success
    message
    id
  }
}
```

**Input Parameters:**

- `tenantId` (required) - The tenant ID
- `userId` (required) - The user ID to add
- `role` (required) - Member role (OWNER, ADMIN, MEMBER, GUEST)

**Business Rules:**

- Tenant must exist
- User must exist (validated by User Context)
- User cannot already be a member of the tenant
- At least one OWNER should exist per tenant

**Events Published:**

- `TenantMemberAddedEvent` - Published when member is added

**Returns:**

- `MutationResponseDto` with the created tenant member ID

### Update Tenant Member

Updates a tenant member's role.

**GraphQL Mutation:**

```graphql
mutation UpdateTenantMember($input: TenantMemberUpdateRequestDto!) {
  tenantMemberUpdate(input: $input) {
    success
    message
    id
  }
}
```

**Input Parameters:**

- `id` (required) - Tenant member ID
- `role` (required) - New role (OWNER, ADMIN, MEMBER, GUEST)

**Business Rules:**

- Tenant member must exist
- Role must be valid
- Cannot remove the last OWNER (if applicable)

**Events Published:**

- `TenantMemberUpdatedEvent` - Published when member is updated

**Returns:**

- `MutationResponseDto` with the updated tenant member ID

### Remove Tenant Member

Removes a user from a tenant.

**GraphQL Mutation:**

```graphql
mutation RemoveTenantMember($input: TenantMemberRemoveRequestDto!) {
  tenantMemberRemove(input: $input) {
    success
    message
    id
  }
}
```

**Input Parameters:**

- `id` (required) - Tenant member ID

**Business Rules:**

- Tenant member must exist
- Cannot remove the last OWNER (validation should be implemented)

**Events Published:**

- `TenantMemberRemovedEvent` - Published when member is removed

**Returns:**

- `MutationResponseDto` with the removed tenant member ID

## Queries

### Find Tenant Member by ID

Retrieves a single tenant member by its ID.

**GraphQL Query:**

```graphql
query FindTenantMemberById($id: String!) {
  tenantMemberFindById(id: $id) {
    id
    tenantId
    userId
    role
  }
}
```

**Returns:**

- `TenantMemberAggregate` - The tenant member aggregate root

**Throws:**

- `TenantMemberNotFoundException` - If tenant member does not exist

### Find Tenant Members by Criteria

Searches for tenant members matching specified criteria with filtering, sorting, and pagination.

**GraphQL Query:**

```graphql
query FindTenantMembersByCriteria(
  $input: TenantMemberFindByCriteriaRequestDto
) {
  tenantMemberFindByCriteria(input: $input) {
    data {
      id
      tenantId
      userId
      role
    }
    total
    page
    pageSize
    totalPages
  }
}
```

**Input Parameters:**

- `filters` (optional) - Filter criteria (e.g., by tenantId, userId, role)
- `sorts` (optional) - Sort criteria
- `pagination` (optional) - Pagination settings

**Returns:**

- `PaginatedTenantMemberResultDto` - Paginated list of tenant members

### Find Tenant Members by Tenant ID

Retrieves all members of a specific tenant.

**Query Handler:**

- `FindTenantMembersByTenantIdQuery`

**Use Case:**

- List all members of a tenant
- Display member management interface
- Check member count for resource limits

### Find Tenant Member View Model by ID

Retrieves a tenant member view model (optimized read model) by ID.

**Query Handler:**

- `FindTenantMemberViewModelByIdQuery`

**Use Case:**

- Optimized read operations
- Display member information in UI
- Performance-critical queries

### Find Tenant Member View Models by Tenant ID

Retrieves all tenant member view models for a specific tenant.

**Query Handler:**

- `FindTenantMemberViewModelsByTenantIdQuery`

**Use Case:**

- Display tenant member list
- Optimized bulk read operations
- Member management interfaces

## Domain Events

The Tenant Members module publishes the following domain events:

### TenantMemberAddedEvent

Published when a user is added as a member to a tenant.

**Event Properties:**

- `aggregateId` - Tenant member ID
- `aggregateType` - "TenantMemberAggregate"
- `eventType` - "TenantMemberAddedEvent"
- `data` - Tenant member primitives

**Subscribers:**

- Tenant module listens to update tenant member count

### TenantMemberUpdatedEvent

Published when a tenant member's role is updated.

**Event Properties:**

- `aggregateId` - Tenant member ID
- `aggregateType` - "TenantMemberAggregate"
- `eventType` - "TenantMemberUpdatedEvent"
- `data` - Updated tenant member primitives

### TenantMemberRemovedEvent

Published when a user is removed from a tenant.

**Event Properties:**

- `aggregateId` - Tenant member ID
- `aggregateType` - "TenantMemberAggregate"
- `eventType` - "TenantMemberRemovedEvent"
- `data` - Removed tenant member primitives

**Subscribers:**

- Tenant module listens to update tenant member count

## Value Objects

### TenantMemberRoleValueObject

Validates and encapsulates tenant member roles.

**Valid Values:**

- `OWNER`
- `ADMIN`
- `MEMBER`
- `GUEST`

**Validation:**

- Ensures role is one of the valid enum values
- Type-safe role management

## Aggregate Root

### TenantMemberAggregate

The aggregate root for tenant members, encapsulating business logic:

**Methods:**

- `update(props)` - Updates the member's role
- `delete()` - Marks the member as deleted
- `toPrimitives()` - Converts to primitive DTO

**Business Rules:**

- Role changes are validated
- Deletion publishes appropriate events
- Immutable tenant and user IDs

## Repositories

### Write Repository (Prisma)

- Used for command operations (add, update, remove)
- Implements `TenantMemberWriteRepository`
- Uses Prisma ORM for database operations

### Read Repository (MongoDB)

- Used for query operations (find by id, find by criteria)
- Implements `TenantMemberReadRepository`
- Uses MongoDB for optimized read performance

## Services

### AssertTenantMemberExistsService

Validates that a tenant member exists by ID.

**Throws:**

- `TenantMemberNotFoundException` - If tenant member does not exist

**Use Case:**

- Validate before operations
- Ensure member exists before updates/deletes

### AssertTenantMemberNotExistsService

Validates that a tenant member does NOT exist (for adding new members).

**Throws:**

- `TenantMemberAlreadyExistsException` - If member already exists

**Use Case:**

- Prevent duplicate memberships
- Validate before adding members

### AssertTenantMemberViewModelExistsService

Validates that a tenant member view model exists (for read operations).

## Event Handlers

### TenantMemberAddedEventHandler

Handles the `TenantMemberAddedEvent`:

- Updates read models
- Triggers notifications
- Updates tenant member counts

### TenantMemberUpdatedEventHandler

Handles the `TenantMemberUpdatedEvent`:

- Updates read models
- Triggers role change notifications
- Updates audit logs

### TenantMemberDeletedEventHandler

Handles the `TenantMemberDeletedEvent`:

- Updates read models
- Triggers removal notifications
- Updates tenant member counts

## Best Practices

1. **Role Hierarchy** - Implement proper role hierarchy checks (OWNER > ADMIN > MEMBER > GUEST)
2. **Last Owner Protection** - Ensure at least one OWNER exists per tenant
3. **Member Limits** - Respect tenant maxUsers limit when adding members
4. **Event Integration** - Subscribe to member events for cross-module integration
5. **Validation** - Always validate tenant and user existence before operations
6. **Bulk Operations** - Use view model queries for performance-critical operations

## Error Handling

The module throws the following exceptions:

- **TenantMemberNotFoundException** - Tenant member does not exist
- **TenantMemberAlreadyExistsException** - User is already a member of the tenant

## Example Usage

### Adding a Member

```graphql
mutation {
  tenantMemberAdd(
    input: {
      tenantId: "tenant-uuid-here"
      userId: "user-uuid-here"
      role: ADMIN
    }
  ) {
    success
    message
    id
  }
}
```

### Finding Members by Tenant

```graphql
query {
  tenantMemberFindByCriteria(
    input: {
      filters: { tenantId: "tenant-uuid-here" }
      pagination: { page: 1, pageSize: 20 }
      sorts: [{ field: "role", direction: DESC }]
    }
  ) {
    data {
      id
      userId
      role
    }
    total
    page
    pageSize
  }
}
```

### Updating Member Role

```graphql
mutation {
  tenantMemberUpdate(input: { id: "member-uuid-here", role: MEMBER }) {
    success
    message
    id
  }
}
```

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
