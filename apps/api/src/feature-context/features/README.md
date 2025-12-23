# Features Module

A comprehensive module for managing feature flags in a multi-tenant SaaS application. This module handles feature lifecycle, status management, and feature flag operations. It follows Clean Architecture principles, implements CQRS pattern, and uses Domain-Driven Design.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Feature Status](#feature-status)
- [Commands](#commands)
- [Queries](#queries)
- [Events](#events)
- [Repositories](#repositories)
- [GraphQL API](#graphql-api)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

The Features Module provides a complete solution for managing feature flags in a multi-tenant SaaS application. It handles feature creation, updates, deletion, status management, and feature flag operations.

### Features

- ✅ Feature creation, update, and deletion
- ✅ Feature status management (ACTIVE, INACTIVE, DEPRECATED)
- ✅ Unique feature key validation
- ✅ GraphQL API for feature operations
- ✅ Event-driven architecture
- ✅ CQRS pattern with separate read/write repositories
- ✅ Domain-driven design with value objects and aggregates
- ✅ Authentication and authorization guards
- ✅ Scalable design for future tenant/plan associations

## Architecture

The module is organized following Clean Architecture principles:

```
features/
├── application/              # Application layer (CQRS)
│   ├── commands/            # Command handlers
│   │   ├── feature-create/
│   │   ├── feature-update/
│   │   ├── feature-delete/
│   │   └── feature-change-status/
│   ├── queries/             # Query handlers
│   │   ├── find-feature-by-id/
│   │   ├── find-features-by-criteria/
│   │   └── feature-view-model-find-by-id/
│   ├── event-handlers/      # Event handlers
│   │   ├── feature-created/
│   │   ├── feature-updated/
│   │   ├── feature-deleted/
│   │   └── feature-status-changed/
│   ├── services/           # Application services
│   │   ├── assert-feature-exists/
│   │   ├── assert-feature-key-is-unique/
│   │   └── assert-feature-view-model-exists/
│   └── exceptions/         # Application exceptions
│       ├── feature-not-found/
│       └── feature-key-is-not-unique/
├── domain/                  # Domain layer
│   ├── aggregates/          # Feature aggregate
│   │   └── feature.aggregate.ts
│   ├── repositories/       # Repository interfaces
│   │   ├── feature-write.repository.ts
│   │   └── feature-read.repository.ts
│   ├── value-objects/      # Value objects
│   │   ├── feature-key/
│   │   ├── feature-name/
│   │   ├── feature-description/
│   │   └── feature-status/
│   ├── view-models/        # Read models
│   │   └── feature.view-model.ts
│   ├── factories/          # Domain factories
│   │   ├── feature-aggregate.factory.ts
│   │   └── feature-view-model.factory.ts
│   ├── enums/             # Domain enums
│   │   └── feature-status.enum.ts
│   ├── primitives/        # Domain primitives
│   │   └── feature.primitives.ts
│   └── dtos/              # Domain DTOs
│       ├── entities/
│       └── view-models/
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

- **Commands**: Write operations (create, update, delete, changeStatus) that modify state
- **Queries**: Read operations (findById, findByCriteria) that query data
- **Write Repository**: Prisma-based repository for write operations (PostgreSQL - Master database)
- **Read Repository**: MongoDB-based repository for read operations (optimized for queries)

#### Event-Driven Architecture

The module publishes domain events for important state changes:

- `FeatureCreatedEvent` - Published when a feature is created
- `FeatureUpdatedEvent` - Published when a feature is updated
- `FeatureDeletedEvent` - Published when a feature is deleted
- `FeatureStatusChangedEvent` - Published when a feature's status is changed

Events are handled asynchronously to update read models and trigger side effects.

#### Multi-Tenant Architecture

- Features are stored in the master database (not tenant-specific)
- This allows for cross-tenant feature management
- **Note:** Feature operations don't require `x-tenant-id` header as they operate on the master database
- **Future:** Features can be associated with tenants or plans for granular control

## Domain Model

### Feature Aggregate

The `FeatureAggregate` is the main domain entity that encapsulates feature business logic:

```typescript
class FeatureAggregate {
  id: FeatureUuidValueObject;
  key: FeatureKeyValueObject;
  name: FeatureNameValueObject;
  description: FeatureDescriptionValueObject | null;
  status: FeatureStatusValueObject;
  createdAt: DateValueObject;
  updatedAt: DateValueObject;
}
```

**Methods:**

- `update(props, generateEvent)`: Updates feature properties
- `delete(generateEvent)`: Marks feature as deleted
- `changeStatus(status, generateEvent)`: Changes feature status
- `toPrimitives()`: Converts aggregate to primitive data

### Value Objects

The module uses value objects to encapsulate and validate domain concepts:

- **FeatureKeyValueObject**: Validates and ensures unique feature key (slug format)
- **FeatureNameValueObject**: Validates feature name
- **FeatureDescriptionValueObject**: Validates feature description
- **FeatureStatusValueObject**: Validates feature status enum

### View Model

The `FeatureViewModel` is optimized for read operations and stored in MongoDB for fast querying. View models are automatically synchronized via event handlers.

## Feature Status

Features can have one of three statuses:

### ACTIVE

The feature is active and available for use.

**Characteristics:**

- Feature is enabled
- Feature can be used by applications
- Default status for new features

### INACTIVE

The feature is inactive and not available for use.

**Characteristics:**

- Feature is disabled
- Feature cannot be used by applications
- Can be reactivated later

### DEPRECATED

The feature is deprecated and should not be used.

**Characteristics:**

- Feature is marked for removal
- Feature should not be used in new implementations
- May be removed in future versions

## Commands

Commands represent write operations that modify state:

### FeatureCreateCommand

Creates a new feature.

**Handler:** `FeatureCreateCommandHandler`

**Process:**

1. Asserts feature key is unique
2. Creates feature aggregate
3. Saves aggregate to write repository (Prisma - Master database)
4. Publishes `FeatureCreatedEvent`
5. Returns feature ID

**Input:**

```typescript
{
  key: string  // Required, must be unique, slug format
  name: string  // Required
  description?: string | null  // Optional
  status?: FeatureStatusEnum  // Optional, defaults to ACTIVE
}
```

**Output:** `string` (feature ID)

**Business Rules:**

- Feature key must be unique
- Feature key must be in slug format
- Status defaults to ACTIVE if not provided

### FeatureUpdateCommand

Updates an existing feature's properties.

**Handler:** `FeatureUpdateCommandHandler`

**Process:**

1. Asserts feature exists
2. Asserts new key is unique (if key is being changed)
3. Updates aggregate properties
4. Saves aggregate to write repository
5. Publishes `FeatureUpdatedEvent`

**Input:**

```typescript
{
  id: string  // Required
  key?: string
  name?: string
  description?: string | null
  status?: FeatureStatusEnum
}
```

**Output:** `void`

**Business Rules:**

- Feature must exist
- Feature key must be unique if changed

### FeatureDeleteCommand

Deletes a feature from the system.

**Handler:** `FeatureDeleteCommandHandler`

**Process:**

1. Asserts feature exists
2. Marks aggregate as deleted
3. Deletes record from write repository (soft delete)
4. Publishes `FeatureDeletedEvent`

**Input:**

```typescript
{
  id: string;
}
```

**Output:** `void`

**Business Rules:**

- Feature must exist
- Only ADMIN can delete features

### FeatureChangeStatusCommand

Changes a feature's status.

**Handler:** `FeatureChangeStatusCommandHandler`

**Process:**

1. Asserts feature exists
2. Changes feature status
3. Saves aggregate to write repository
4. Publishes `FeatureStatusChangedEvent`

**Input:**

```typescript
{
  id: string; // Required
  status: FeatureStatusEnum; // Required
}
```

**Output:** `void`

**Business Rules:**

- Feature must exist
- Status must be a valid FeatureStatusEnum value

## Queries

Queries represent read operations that don't modify state:

### FindFeatureByIdQuery

Finds a feature aggregate by ID.

**Handler:** `FindFeatureByIdQueryHandler`

**Input:**

```typescript
{
  id: string;
}
```

**Output:** `FeatureAggregate`

### FindFeaturesByCriteriaQuery

Finds features by criteria with pagination.

**Handler:** `FindFeaturesByCriteriaQueryHandler`

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

**Output:** `PaginatedResult<FeatureViewModel>`

### FeatureViewModelFindByIdQuery

Finds a feature view model by ID (optimized for read operations).

**Handler:** `FeatureViewModelFindByIdQueryHandler`

**Input:**

```typescript
{
  id: string;
}
```

**Output:** `FeatureViewModel`

## Events

The module publishes domain events for important state changes:

### FeatureCreatedEvent

Published when a feature is created.

**Handler:** `FeatureCreatedEventHandler`

**Process:**

1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

This ensures read models are synchronized with write models.

### FeatureUpdatedEvent

Published when a feature is updated.

**Handler:** `FeatureUpdatedEventHandler`

**Process:**

1. Asserts view model exists
2. Updates view model from event data
3. Saves view model to read repository (MongoDB)

### FeatureDeletedEvent

Published when a feature is deleted.

**Handler:** `FeatureDeletedEventHandler`

**Process:**

1. Deletes view model from read repository (MongoDB)

### FeatureStatusChangedEvent

Published when a feature's status is changed.

**Handler:** `FeatureStatusChangedEventHandler`

**Process:**

1. Asserts view model exists
2. Updates view model status from event data
3. Saves view model to read repository (MongoDB)

## Repositories

The module uses two repositories following CQRS pattern:

### Write Repository (Prisma)

**Interface:** `IFeatureWriteRepository`

**Implementation:** `FeaturePrismaRepository`

**Database:** PostgreSQL (Master database)

**Operations:**

- `findById(id: string): Promise<FeatureAggregate | null>`
- `save(feature: FeatureAggregate): Promise<FeatureAggregate>`
- `delete(id: string): Promise<void>`

**Features:**

- Stores features in master database (not tenant-specific)
- Allows cross-tenant feature management
- Indexed on `key` and `status` for performance
- Soft delete support

### Read Repository (MongoDB)

**Interface:** `IFeatureReadRepository`

**Implementation:** `FeatureMongoRepository`

**Database:** MongoDB

**Operations:**

- `findById(id: string): Promise<FeatureViewModel | null>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<FeatureViewModel>>`
- `save(featureViewModel: FeatureViewModel): Promise<void>`
- `delete(id: string): Promise<void>`

**Features:**

- Optimized for read operations
- Supports complex queries with filters, sorts, and pagination

## GraphQL API

The module exposes a GraphQL API through two resolvers:

### Authentication & Authorization

All feature operations require authentication. The module uses multiple guards to ensure security.

### Required Headers

Every request to the features API must include:

1. **Authorization Header** - JWT token for authentication
   ```http
   Authorization: Bearer <jwt-token>
   ```

**Note:** Feature operations don't require `x-tenant-id` header as they operate on the master database.

### Guards

The module applies the following guards to all endpoints:

1. **JwtAuthGuard** - Validates JWT token and extracts user information
2. **RolesGuard** - Validates user has appropriate role

### Authorization Rules

- **ADMIN Role**: Can perform all operations (create, update, delete, query all features)
- **USER Role**: Cannot access feature management (ADMIN only)

### FeatureQueriesResolver

Handles read operations (queries).

**Queries:**

#### featuresFindByCriteria

Finds features by criteria with pagination. **Requires ADMIN role.**

```graphql
query FindFeaturesByCriteria($input: FeatureFindByCriteriaRequestDto) {
  featuresFindByCriteria(input: $input) {
    items {
      id
      key
      name
      description
      status
      createdAt
      updatedAt
    }
    total
    page
    perPage
    totalPages
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
      "perPage": 10
    }
  }
}
```

#### featureFindById

Finds a feature by ID. **Requires ADMIN role.**

```graphql
query FindFeatureById($input: FeatureFindByIdRequestDto!) {
  featureFindById(input: $input) {
    id
    key
    name
    description
    status
    createdAt
    updatedAt
  }
}
```

**Variables:**

```json
{
  "input": {
    "id": "feature-uuid"
  }
}
```

### FeatureMutationsResolver

Handles write operations (mutations).

**Mutations:**

#### createFeature

Creates a new feature. **Requires ADMIN role.**

```graphql
mutation CreateFeature($input: CreateFeatureRequestDto!) {
  createFeature(input: $input) {
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
    "key": "advanced-analytics",
    "name": "Advanced Analytics",
    "description": "This feature enables advanced analytics capabilities",
    "status": "ACTIVE"
  }
}
```

**Response:**

```json
{
  "data": {
    "createFeature": {
      "success": true,
      "message": "Feature created successfully",
      "id": "feature-uuid"
    }
  }
}
```

#### updateFeature

Updates an existing feature. **Requires ADMIN role.**

```graphql
mutation UpdateFeature($input: UpdateFeatureRequestDto!) {
  updateFeature(input: $input) {
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
    "id": "feature-uuid",
    "name": "Updated Feature Name",
    "description": "Updated description",
    "status": "INACTIVE"
  }
}
```

#### deleteFeature

Deletes a feature. **Requires ADMIN role.**

```graphql
mutation DeleteFeature($input: DeleteFeatureRequestDto!) {
  deleteFeature(input: $input) {
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
    "id": "feature-uuid"
  }
}
```

#### changeFeatureStatus

Changes a feature's status. **Requires ADMIN role.**

```graphql
mutation ChangeFeatureStatus($input: FeatureChangeStatusRequestDto!) {
  changeFeatureStatus(input: $input) {
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
    "id": "feature-uuid",
    "status": "DEPRECATED"
  }
}
```

## Examples

### Complete Feature Lifecycle

```graphql
# 1. Create feature (ADMIN only)
mutation {
  createFeature(
    input: {
      key: "advanced-analytics"
      name: "Advanced Analytics"
      description: "This feature enables advanced analytics capabilities"
      status: ACTIVE
    }
  ) {
    success
    message
    id
  }
}

# 2. Find features by criteria (ADMIN only)
query {
  featuresFindByCriteria(
    input: {
      filters: [{ field: "status", operator: EQUALS, value: "ACTIVE" }]
      pagination: { page: 1, perPage: 10 }
    }
  ) {
    items {
      id
      key
      name
      status
    }
    total
  }
}

# 3. Find feature by ID (ADMIN only)
query {
  featureFindById(input: { id: "feature-uuid" }) {
    id
    key
    name
    description
    status
  }
}

# 4. Update feature (ADMIN only)
mutation {
  updateFeature(
    input: {
      id: "feature-uuid"
      name: "Updated Feature Name"
      description: "Updated description"
    }
  ) {
    success
    message
  }
}

# 5. Change feature status (ADMIN only)
mutation {
  changeFeatureStatus(input: { id: "feature-uuid", status: INACTIVE }) {
    success
    message
  }
}

# 6. Delete feature (ADMIN only)
mutation {
  deleteFeature(input: { id: "feature-uuid" }) {
    success
    message
  }
}
```

### Query with Filters

```graphql
query {
  featuresFindByCriteria(
    input: {
      filters: [{ field: "status", operator: EQUALS, value: "ACTIVE" }]
      sorts: [{ field: "createdAt", direction: DESC }]
      pagination: { page: 1, perPage: 20 }
    }
  ) {
    items {
      id
      key
      name
      description
      status
      createdAt
      updatedAt
    }
    total
    page
    perPage
    totalPages
  }
}
```

## Troubleshooting

### Common Issues

1. **Feature Not Found:**
   - Solution: Verify the feature ID exists
   - Check if the feature was soft deleted

2. **Feature Key Is Not Unique:**
   - Solution: Feature key must be unique across all features
   - Use a different feature key
   - Error: `FeatureKeyIsNotUniqueException`

3. **Unauthorized Access:**
   - Solution: Ensure JWT token is valid
   - Check user has ADMIN role
   - All feature operations require ADMIN role

4. **Invalid Feature Key Format:**
   - Solution: Feature key must be in slug format (lowercase, alphanumeric, hyphens)
   - Example: `advanced-analytics`, `api-access`, `beta-testing`

### Debugging

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed logs for:

- Feature create/update/delete operations
- Repository operations
- Event handling
- Guard validation

## Database Schema

### Prisma Schema (Master Database)

```prisma
enum FeatureStatusEnum {
  ACTIVE
  INACTIVE
  DEPRECATED
}

model Feature {
  id          String            @id @default(uuid())
  key         String            @unique
  name        String
  description String?
  status      FeatureStatusEnum @default(ACTIVE)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@index([key])
  @@index([status])
}
```

**Note:** Features are stored in the master database, not in tenant-specific databases. This allows for:

- Cross-tenant feature management
- Centralized feature administration
- Efficient feature lookup
- Future: Association with tenants or plans for granular control

### MongoDB Schema (Read Database)

The MongoDB collection stores view models with the same structure as the Prisma model, optimized for read operations.

## Best Practices

1. **Feature Key Naming** - Use descriptive, slug-format keys (e.g., `advanced-analytics`, `api-access`)
2. **Status Management** - Use INACTIVE for temporary deactivation, DEPRECATED for features to be removed
3. **Feature Descriptions** - Provide clear descriptions for better documentation
4. **Event Handling** - Subscribe to feature events for cross-module integration
5. **Validation** - All value objects validate input data automatically
6. **Soft Deletes** - Features are soft deleted to maintain audit trail

## Integration with Other Modules

### Future: Tenant Association

- Features can be associated with specific tenants
- Allows tenant-specific feature flags
- Enables granular feature control per tenant

### Future: Plan Association

- Features can be associated with subscription plans
- Allows plan-based feature flags
- Enables feature gating based on subscription tier

## Testing

The module includes comprehensive unit tests:

- **Domain Layer**: Value objects, aggregates, factories, view models
- **Application Layer**: Command handlers, query handlers, event handlers, services
- **Infrastructure Layer**: Repositories, mappers
- **Transport Layer**: Resolvers, mappers

Run tests with:

```bash
npm test -- --testPathPattern="feature-context/features"
```

## License

This module is part of the SaaS Boilerplate project.
