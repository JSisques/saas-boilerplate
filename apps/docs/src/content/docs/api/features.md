---
title: Features
description: Complete guide to feature flags management with status control
---

The **Features** module provides a comprehensive feature flags solution for managing application features. It follows Clean Architecture principles, implements CQRS pattern, and uses Domain-Driven Design.

## Overview

The Features Module provides a flexible feature flags solution that supports:

> **Important:** All feature operations require authentication and ADMIN role. You must include a valid JWT token in the `Authorization` header for every request.

- ✅ Feature creation, update, and deletion
- ✅ Feature status management (ACTIVE, INACTIVE, DEPRECATED)
- ✅ Unique feature key validation
- ✅ GraphQL API for feature operations
- ✅ Event-driven architecture
- ✅ CQRS pattern with separate read/write repositories
- ✅ Scalable design for future tenant/plan associations

## Architecture

The module follows Clean Architecture with clear separation of concerns:

- **Application Layer**: Command handlers, query handlers, and event handlers
- **Domain Layer**: Aggregates, value objects, repositories interfaces, and domain events
- **Infrastructure Layer**: Database repositories (Prisma for writes, MongoDB for reads)
- **Transport Layer**: GraphQL resolvers and DTOs

### CQRS Pattern

- **Commands**: Write operations (create, update, delete, changeStatus) that modify state
- **Queries**: Read operations (findById, findByCriteria) that query data
- **Write Repository**: Prisma-based repository for write operations (PostgreSQL - Master database)
- **Read Repository**: MongoDB-based repository for read operations (optimized for queries)

### Event-Driven Architecture

The module publishes domain events for important state changes:

- `FeatureCreatedEvent` - Published when a feature is created
- `FeatureUpdatedEvent` - Published when a feature is updated
- `FeatureDeletedEvent` - Published when a feature is deleted
- `FeatureStatusChangedEvent` - Published when a feature's status is changed

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

## GraphQL API

### Authentication & Authorization

All feature operations require:

1. **JWT Authentication** - Valid JWT token in `Authorization` header
2. **User Role** - User must have ADMIN role
3. **No Tenant Context** - Features operate on the master database (not tenant-specific)

**Required Headers:**

```http
Authorization: Bearer <jwt-token>
```

**Example Request:**

```bash
curl -X POST http://localhost:4100/graphql \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"query": "..."}'
```

**Important Notes:**

- The `x-tenant-id` header is **NOT required** for feature operations
- Features are stored in the master database (not tenant-specific)
- Only users with ADMIN role can access feature management
- This allows for cross-tenant feature management

### Queries

#### featureFindById

Finds a feature by ID.

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

**Response:**

```json
{
  "data": {
    "featureFindById": {
      "id": "feature-uuid",
      "key": "advanced-analytics",
      "name": "Advanced Analytics",
      "description": "This feature enables advanced analytics capabilities",
      "status": "ACTIVE",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

#### featuresFindByCriteria

Finds features by criteria with pagination.

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

**Response:**

```json
{
  "data": {
    "featuresFindByCriteria": {
      "items": [
        {
          "id": "feature-uuid",
          "key": "advanced-analytics",
          "name": "Advanced Analytics",
          "description": "This feature enables advanced analytics capabilities",
          "status": "ACTIVE",
          "createdAt": "2025-01-01T00:00:00.000Z",
          "updatedAt": "2025-01-01T00:00:00.000Z"
        }
      ],
      "total": 1,
      "page": 1,
      "perPage": 10,
      "totalPages": 1
    }
  }
}
```

### Mutations

#### createFeature

Creates a new feature.

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

**Business Rules:**

- Feature key must be unique
- Feature key must be in slug format (lowercase, alphanumeric, hyphens)
- Status defaults to ACTIVE if not provided
- Description is optional

#### updateFeature

Updates an existing feature.

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

**Response:**

```json
{
  "data": {
    "updateFeature": {
      "success": true,
      "message": "Feature updated successfully",
      "id": "feature-uuid"
    }
  }
}
```

**Business Rules:**

- Feature must exist
- Feature key must be unique if changed
- All fields are optional (partial update)

#### deleteFeature

Deletes a feature.

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

**Response:**

```json
{
  "data": {
    "deleteFeature": {
      "success": true,
      "message": "Feature deleted successfully",
      "id": "feature-uuid"
    }
  }
}
```

**Business Rules:**

- Feature must exist
- Performs soft delete (maintains audit trail)

#### changeFeatureStatus

Changes a feature's status.

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

**Response:**

```json
{
  "data": {
    "changeFeatureStatus": {
      "success": true,
      "message": "Feature status changed successfully",
      "id": "feature-uuid"
    }
  }
}
```

**Business Rules:**

- Feature must exist
- Status must be a valid FeatureStatusEnum value (ACTIVE, INACTIVE, DEPRECATED)
- Publishes `FeatureStatusChangedEvent` for event-driven updates

## Examples

### Complete Feature Lifecycle

```graphql
# 1. Create feature
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

# 2. Find features by criteria
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

# 3. Find feature by ID
query {
  featureFindById(input: { id: "feature-uuid" }) {
    id
    key
    name
    description
    status
  }
}

# 4. Update feature
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

# 5. Change feature status
mutation {
  changeFeatureStatus(input: { id: "feature-uuid", status: INACTIVE }) {
    success
    message
  }
}

# 6. Delete feature
mutation {
  deleteFeature(input: { id: "feature-uuid" }) {
    success
    message
  }
}
```

### Query with Multiple Filters

```graphql
query {
  featuresFindByCriteria(
    input: {
      filters: [{ field: "status", operator: EQUALS, value: "ACTIVE" }]
      sorts: [
        { field: "createdAt", direction: DESC }
        { field: "name", direction: ASC }
      ]
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

### Feature Key Naming Examples

Feature keys must be in slug format:

- ✅ `advanced-analytics`
- ✅ `api-access`
- ✅ `beta-testing`
- ✅ `new-dashboard-v2`
- ❌ `Advanced Analytics` (spaces not allowed)
- ❌ `advanced_analytics` (underscores not recommended)
- ❌ `advancedAnalytics` (camelCase not recommended)

## Domain Model

### Feature Aggregate

The `FeatureAggregate` is the main domain entity:

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

- **FeatureKeyValueObject**: Validates unique feature key (slug format)
- **FeatureNameValueObject**: Validates feature name
- **FeatureDescriptionValueObject**: Validates feature description
- **FeatureStatusValueObject**: Validates feature status enum

## Events

The module publishes domain events for important state changes:

### FeatureCreatedEvent

Published when a feature is created. Automatically creates a view model in MongoDB.

### FeatureUpdatedEvent

Published when a feature is updated. Automatically updates the view model in MongoDB.

### FeatureDeletedEvent

Published when a feature is deleted. Automatically deletes the view model from MongoDB.

### FeatureStatusChangedEvent

Published when a feature's status is changed. Automatically updates the view model status in MongoDB.

## Repositories

### Write Repository (Prisma)

**Database:** PostgreSQL (Master database)

**Operations:**

- `findById(id: string): Promise<FeatureAggregate | null>`
- `save(feature: FeatureAggregate): Promise<FeatureAggregate>`
- `delete(id: string): Promise<void>`

**Features:**

- Stores features in master database
- Indexed on `key` and `status` for performance
- Soft delete support

### Read Repository (MongoDB)

**Database:** MongoDB

**Operations:**

- `findById(id: string): Promise<FeatureViewModel | null>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<FeatureViewModel>>`
- `save(featureViewModel: FeatureViewModel): Promise<void>`
- `delete(id: string): Promise<void>`

**Features:**

- Optimized for read operations
- Supports complex queries with filters, sorts, and pagination

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

### Error Responses

#### FeatureNotFoundException

```json
{
  "errors": [
    {
      "message": "Feature with id <id> not found",
      "extensions": {
        "code": "FEATURE_NOT_FOUND"
      }
    }
  ]
}
```

#### FeatureKeyIsNotUniqueException

```json
{
  "errors": [
    {
      "message": "Feature with key <key> already exists",
      "extensions": {
        "code": "FEATURE_KEY_IS_NOT_UNIQUE"
      }
    }
  ]
}
```

## Best Practices

1. **Feature Key Naming** - Use descriptive, slug-format keys (e.g., `advanced-analytics`, `api-access`)
2. **Status Management** - Use INACTIVE for temporary deactivation, DEPRECATED for features to be removed
3. **Feature Descriptions** - Provide clear descriptions for better documentation
4. **Event Handling** - Subscribe to feature events for cross-module integration
5. **Validation** - All value objects validate input data automatically
6. **Soft Deletes** - Features are soft deleted to maintain audit trail

## Future Enhancements

### Tenant Association

Features can be associated with specific tenants for tenant-specific feature flags.

### Plan Association

Features can be associated with subscription plans for plan-based feature flags.

## Integration Examples

### Using Feature Flags in Application Code

```typescript
// Example: Check if feature is active
const feature = await featureService.isFeatureActive('advanced-analytics');
if (feature) {
  // Enable advanced analytics
}
```

### Event Subscription

```typescript
// Example: Subscribe to feature status changes
@EventsHandler(FeatureStatusChangedEvent)
export class MyFeatureStatusChangedHandler {
  async handle(event: FeatureStatusChangedEvent) {
    // React to feature status changes
    // e.g., update cache, notify services, etc.
  }
}
```

## Testing

The module includes comprehensive unit tests covering all layers:

- **Domain Layer**: Value objects, aggregates, factories, view models
- **Application Layer**: Command handlers, query handlers, event handlers, services
- **Infrastructure Layer**: Repositories, mappers
- **Transport Layer**: Resolvers, mappers

Run tests with:

```bash
npm test -- --testPathPattern="feature-context/features"
```

## Related Documentation

- [Users Module](/api/users) - User management
- [Tenants Module](/api/tenants) - Tenant management
- [Authentication](/api/authentication) - Authentication and authorization
