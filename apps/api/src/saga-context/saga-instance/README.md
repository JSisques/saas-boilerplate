# Saga Instance Module

A comprehensive module for managing saga instances in a distributed transaction system. This module handles the lifecycle of saga workflows, status management, and compensation support following Clean Architecture principles, CQRS pattern, and Domain-Driven Design.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Saga Instance Status](#saga-instance-status)
- [Commands](#commands)
- [Queries](#queries)
- [Events](#events)
- [Repositories](#repositories)
- [GraphQL API](#graphql-api)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

The Saga Instance Module provides a complete solution for managing saga workflows in a multi-tenant SaaS application. It handles saga instance creation, updates, deletion, and status management.

### Features

- ✅ Saga instance creation, update, and deletion
- ✅ Status management with automatic transitions
- ✅ Start and end date tracking
- ✅ Compensation support (COMPENSATING, COMPENSATED)
- ✅ GraphQL API for saga operations
- ✅ Event-driven architecture
- ✅ CQRS pattern with separate read/write repositories
- ✅ Domain-driven design with value objects and aggregates

## Architecture

The module is organized following Clean Architecture principles:

```
saga-instance/
├── application/              # Application layer (CQRS)
│   ├── commands/            # Command handlers
│   │   ├── saga-instance-create/
│   │   ├── saga-instance-update/
│   │   ├── saga-instance-delete/
│   │   └── saga-instance-change-status/
│   ├── queries/             # Query handlers
│   │   ├── saga-instance-find-by-id/
│   │   ├── saga-instance-find-by-criteria/
│   │   └── saga-instance-find-view-model-by-id/
│   ├── event-handlers/      # Event handlers
│   │   ├── saga-instance-created/
│   │   ├── saga-instance-updated/
│   │   ├── saga-instance-deleted/
│   │   └── saga-instance-status-changed/
│   ├── services/           # Application services
│   │   ├── assert-saga-instance-exists/
│   │   ├── assert-saga-instance-not-exists/
│   │   └── assert-saga-instance-view-model-exists/
│   └── dtos/               # Data transfer objects
├── domain/                  # Domain layer
│   ├── aggregates/         # Domain aggregates
│   │   └── saga-instance.aggregate.ts
│   ├── value-objects/     # Value objects
│   │   ├── saga-instance-name/
│   │   ├── saga-instance-status/
│   │   ├── saga-instance-start-date/
│   │   └── saga-instance-end-date/
│   ├── repositories/       # Repository interfaces
│   │   ├── saga-instance-read.repository.ts
│   │   └── saga-instance-write.repository.ts
│   ├── factories/          # Aggregate factories
│   │   ├── saga-instance-aggregate/
│   │   └── saga-instance-view-model/
│   ├── enums/              # Domain enums
│   │   └── saga-instance-status/
│   └── primitives/         # Primitive types
│       └── saga-instance.primitives.ts
├── infrastructure/          # Infrastructure layer
│   └── database/          # Database implementations
│       ├── prisma/        # Prisma write repository
│       └── mongodb/       # MongoDB read repository
└── transport/              # Transport layer
    └── graphql/           # GraphQL resolvers and DTOs
        ├── resolvers/
        ├── dtos/
        └── mappers/
```

## Domain Model

### Saga Instance Aggregate

The `SagaInstanceAggregate` is the core domain entity that represents a saga workflow execution.

**Properties:**

- `id`: Unique identifier (SagaInstanceUuidValueObject)
- `name`: Saga instance name (SagaInstanceNameValueObject)
- `status`: Current status (SagaInstanceStatusValueObject)
- `startDate`: When the saga started (SagaInstanceStartDateValueObject | null)
- `endDate`: When the saga ended (SagaInstanceEndDateValueObject | null)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

**Methods:**

- `update(props)`: Update saga instance properties
- `delete()`: Delete the saga instance
- `markAsPending()`: Set status to PENDING
- `markAsStarted()`: Set status to STARTED and set start date
- `markAsRunning()`: Set status to RUNNING
- `markAsCompleted()`: Set status to COMPLETED and set end date
- `markAsFailed()`: Set status to FAILED and set end date
- `markAsCompensating()`: Set status to COMPENSATING
- `markAsCompensated()`: Set status to COMPENSATED and set end date

## Saga Instance Status

Saga instances can have one of the following statuses:

### PENDING

The saga instance is created but not yet started.

**Characteristics:**

- Initial state when saga is created
- No start or end date
- Can be started or deleted

### STARTED

The saga instance has started execution.

**Characteristics:**

- Start date is set when status changes to STARTED
- End date is cleared
- Can transition to RUNNING, COMPLETED, or FAILED

### RUNNING

The saga instance is actively executing steps.

**Characteristics:**

- Saga is in progress
- Steps are being executed
- Can transition to COMPLETED or FAILED

### COMPLETED

All steps completed successfully.

**Characteristics:**

- End date is set when status changes to COMPLETED
- All steps finished successfully
- Saga workflow is complete

### FAILED

One or more steps failed.

**Characteristics:**

- End date is set when status changes to FAILED
- One or more steps failed
- Can trigger compensation

### COMPENSATING

Compensation actions are being executed.

**Characteristics:**

- Saga is rolling back changes
- Compensation steps are executing
- Can transition to COMPENSATED

### COMPENSATED

All compensation actions completed.

**Characteristics:**

- End date is set when status changes to COMPENSATED
- All compensation steps completed
- Saga workflow is fully rolled back

## Commands

### Create Saga Instance

Creates a new saga instance.

**Command:** `SagaInstanceCreateCommand`

**Handler:** `SagaInstanceCreateCommandHandler`

**Input:**

```typescript
{
  name: string;
}
```

**Process:**

1. Validates saga instance name
2. Creates saga instance aggregate
3. Saves to write repository (Prisma)
4. Publishes `SagaInstanceCreatedEvent`

**Business Rules:**

- Name is required
- Name must be valid (validated by SagaInstanceNameValueObject)

### Update Saga Instance

Updates an existing saga instance.

**Command:** `SagaInstanceUpdateCommand`

**Handler:** `SagaInstanceUpdateCommandHandler`

**Input:**

```typescript
{
  id: string;
  name?: string;
  status?: SagaInstanceStatusEnum;
  startDate?: Date;
  endDate?: Date;
}
```

**Process:**

1. Asserts saga instance exists
2. Updates saga instance aggregate
3. Saves to write repository (Prisma)
4. Publishes `SagaInstanceUpdatedEvent`

**Business Rules:**

- Saga instance must exist
- All provided fields are validated

### Change Saga Instance Status

Changes the status of a saga instance.

**Command:** `SagaInstanceChangeStatusCommand`

**Handler:** `SagaInstanceChangeStatusCommandHandler`

**Input:**

```typescript
{
  id: string;
  status: SagaInstanceStatusEnum;
}
```

**Process:**

1. Asserts saga instance exists
2. Updates saga instance status using appropriate method
3. Saves to write repository (Prisma)
4. Publishes `SagaInstanceStatusChangedEvent`

**Business Rules:**

- Saga instance must exist
- Status must be valid
- Status transitions follow business rules

### Delete Saga Instance

Deletes a saga instance.

**Command:** `SagaInstanceDeleteCommand`

**Handler:** `SagaInstanceDeleteCommandHandler`

**Input:**

```typescript
{
  id: string;
}
```

**Process:**

1. Asserts saga instance exists
2. Deletes saga instance aggregate
3. Removes from write repository (Prisma)
4. Publishes `SagaInstanceDeletedEvent`

**Business Rules:**

- Saga instance must exist

## Queries

### Find Saga Instance by ID

Finds a saga instance by its ID.

**Query:** `FindSagaInstanceByIdQuery`

**Handler:** `FindSagaInstanceByIdQueryHandler`

**Returns:** `SagaInstanceAggregate | null`

### Find Saga Instances by Criteria

Finds saga instances matching criteria with pagination.

**Query:** `FindSagaInstancesByCriteriaQuery`

**Handler:** `FindSagaInstancesByCriteriaQueryHandler`

**Input:**

```typescript
{
  criteria: Criteria; // filters, sorts, pagination
}
```

**Returns:** `PaginatedResult<SagaInstanceViewModel>`

### Find Saga Instance View Model by ID

Finds a saga instance view model by ID (from read repository).

**Query:** `FindSagaInstanceViewModelByIdQuery`

**Handler:** `FindSagaInstanceViewModelByIdQueryHandler`

**Returns:** `SagaInstanceViewModel | null`

## Events

The module publishes the following domain events:

### SagaInstanceCreatedEvent

Published when a saga instance is created.

**Handler:** `SagaInstanceCreatedEventHandler`

**Process:**

1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

### SagaInstanceUpdatedEvent

Published when a saga instance is updated.

**Handler:** `SagaInstanceUpdatedEventHandler`

**Process:**

1. Creates or updates view model from event data
2. Saves view model to read repository (MongoDB)

### SagaInstanceDeletedEvent

Published when a saga instance is deleted.

**Handler:** `SagaInstanceDeletedEventHandler`

**Process:**

1. Asserts view model exists
2. Deletes view model from read repository (MongoDB)

### SagaInstanceStatusChangedEvent

Published when a saga instance status changes.

**Handler:** `SagaInstanceStatusChangedEventHandler`

**Process:**

1. Creates or updates view model from event data
2. Saves view model to read repository (MongoDB)

## Repositories

The module uses a dual repository pattern:

### Write Repository (Prisma)

- Used for command operations (create, update, delete)
- Implements `SagaInstanceWriteRepository`
- Uses Prisma ORM for database operations
- Stores data in PostgreSQL

**Operations:**

- `findById(id: string): Promise<SagaInstanceAggregate | null>`
- `save(sagaInstance: SagaInstanceAggregate): Promise<SagaInstanceAggregate>`
- `delete(id: string): Promise<boolean>`

### Read Repository (MongoDB)

- Used for query operations (find by id, find by criteria)
- Implements `SagaInstanceReadRepository`
- Uses MongoDB for optimized read performance

**Operations:**

- `findById(id: string): Promise<SagaInstanceViewModel | null>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<SagaInstanceViewModel>>`
- `save(sagaInstanceViewModel: SagaInstanceViewModel): Promise<void>`
- `delete(id: string): Promise<boolean>`

## GraphQL API

### Queries

#### sagaInstanceFindById

Finds a saga instance by ID.

```graphql
query FindSagaInstanceById($input: SagaInstanceFindByIdRequestDto!) {
  sagaInstanceFindById(input: $input) {
    id
    name
    status
    startDate
    endDate
    createdAt
    updatedAt
  }
}
```

**Variables:**

```json
{
  "input": {
    "id": "saga-instance-uuid"
  }
}
```

#### sagaInstanceFindByCriteria

Finds saga instances by criteria with pagination.

```graphql
query FindSagaInstancesByCriteria(
  $input: SagaInstanceFindByCriteriaRequestDto
) {
  sagaInstanceFindByCriteria(input: $input) {
    items {
      id
      name
      status
      startDate
      endDate
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
        "value": "RUNNING"
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

#### sagaInstanceCreate

Creates a new saga instance.

```graphql
mutation CreateSagaInstance($input: SagaInstanceCreateRequestDto!) {
  sagaInstanceCreate(input: $input) {
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
    "name": "Order Processing Saga"
  }
}
```

#### sagaInstanceUpdate

Updates an existing saga instance.

```graphql
mutation UpdateSagaInstance($input: SagaInstanceUpdateRequestDto!) {
  sagaInstanceUpdate(input: $input) {
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
    "id": "saga-instance-uuid",
    "name": "Updated Saga Name"
  }
}
```

#### sagaInstanceChangeStatus

Changes the status of a saga instance.

```graphql
mutation ChangeSagaInstanceStatus($input: SagaInstanceChangeStatusRequestDto!) {
  sagaInstanceChangeStatus(input: $input) {
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
    "id": "saga-instance-uuid",
    "status": "STARTED"
  }
}
```

#### sagaInstanceDelete

Deletes a saga instance.

```graphql
mutation DeleteSagaInstance($input: SagaInstanceDeleteRequestDto!) {
  sagaInstanceDelete(input: $input) {
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
    "id": "saga-instance-uuid"
  }
}
```

## Examples

### Complete Saga Instance Lifecycle

```typescript
// 1. Create saga instance
const sagaInstance = await commandBus.execute(
  new SagaInstanceCreateCommand({ name: 'Order Processing' }),
);

// 2. Start the saga
await commandBus.execute(
  new SagaInstanceChangeStatusCommand({
    id: sagaInstance,
    status: SagaInstanceStatusEnum.STARTED,
  }),
);

// 3. Mark as running
await commandBus.execute(
  new SagaInstanceChangeStatusCommand({
    id: sagaInstance,
    status: SagaInstanceStatusEnum.RUNNING,
  }),
);

// 4. Complete the saga
await commandBus.execute(
  new SagaInstanceChangeStatusCommand({
    id: sagaInstance,
    status: SagaInstanceStatusEnum.COMPLETED,
  }),
);
```

### Query with Filters

```graphql
query {
  sagaInstanceFindByCriteria(
    input: {
      filters: [{ field: "status", operator: EQUALS, value: "RUNNING" }]
      sorts: [{ field: "createdAt", direction: DESC }]
      pagination: { page: 1, limit: 20 }
    }
  ) {
    items {
      id
      name
      status
      startDate
      endDate
    }
    total
  }
}
```

## Value Objects

The module uses value objects to ensure data integrity:

- **SagaInstanceNameValueObject** - Validates saga instance name
- **SagaInstanceStatusValueObject** - Validates saga instance status enum
- **SagaInstanceStartDateValueObject** - Validates start date
- **SagaInstanceEndDateValueObject** - Validates end date

## Troubleshooting

### Common Issues

1. **Saga Instance Not Found:**
   - Solution: Verify the saga instance ID exists
   - Check if the saga instance was deleted

2. **Invalid Status Transition:**
   - Solution: Ensure status transitions follow business rules
   - Use the provided status change methods (markAsStarted, markAsCompleted, etc.)

3. **Event Not Published:**
   - Solution: Check event handlers are registered
   - Verify event bus is configured correctly

### Debugging

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed logs for:

- Saga instance create/update/delete operations
- Repository operations
- Event handling
- Status transitions

## Best Practices

1. **Status Management** - Use the provided status change methods to maintain consistency
2. **Date Tracking** - Start and end dates are automatically managed by status changes
3. **Event Handling** - Subscribe to saga instance events for cross-module integration
4. **Validation** - All value objects validate input data automatically
5. **Compensation** - Always implement compensation logic for failed sagas

## Integration with Other Modules

### Saga Step Module

- Saga instances contain multiple steps
- Steps reference saga instance ID
- Step status changes can trigger saga instance status updates

### Saga Log Module

- Saga instance events automatically create logs
- Logs track saga instance lifecycle
- Logs can be filtered by saga instance ID
