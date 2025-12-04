---
title: Saga Instance
description: Complete guide to saga instance management
---

The **Saga Instance** module provides comprehensive saga workflow management capabilities in a distributed transaction system. It handles saga instance lifecycle, status management, and compensation support following Clean Architecture principles, CQRS pattern, and Domain-Driven Design.

> **Important:** Saga instance operations manage distributed transactions using the Saga orchestration pattern. Each saga instance represents a single execution of a workflow that may span multiple services.

## Overview

The Saga Instance Module manages the lifecycle of saga workflows. Each saga instance represents a single execution of a distributed transaction, tracking its status, start/end dates, and supporting compensation for rollback scenarios.

### Features

- ✅ Saga instance creation, update, and deletion
- ✅ Status management with automatic transitions
- ✅ Start and end date tracking
- ✅ Compensation support (COMPENSATING, COMPENSATED)
- ✅ GraphQL API for saga operations
- ✅ Event-driven architecture
- ✅ CQRS pattern with separate read/write repositories

## Saga Instance Entity

A saga instance represents a single execution of a distributed transaction workflow. Each instance has:

- **Unique identifier** - UUID-based saga instance ID
- **Name** - Descriptive name for the saga workflow
- **Status** - Current execution status
- **Start date** - When the saga started execution
- **End date** - When the saga completed or failed
- **Lifecycle events** - Created, Updated, Deleted, StatusChanged events

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

**Response:**

```json
{
  "data": {
    "sagaInstanceFindById": {
      "id": "saga-instance-uuid",
      "name": "Order Processing Saga",
      "status": "RUNNING",
      "startDate": "2025-01-01T10:00:00.000Z",
      "endDate": null,
      "createdAt": "2025-01-01T09:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
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

**Response:**

```json
{
  "data": {
    "sagaInstanceFindByCriteria": {
      "items": [
        {
          "id": "saga-instance-uuid",
          "name": "Order Processing Saga",
          "status": "RUNNING",
          "startDate": "2025-01-01T10:00:00.000Z",
          "endDate": null,
          "createdAt": "2025-01-01T09:00:00.000Z"
        }
      ],
      "total": 1,
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

**Response:**

```json
{
  "data": {
    "sagaInstanceCreate": {
      "success": true,
      "message": "Saga instance created successfully",
      "id": "saga-instance-uuid"
    }
  }
}
```

**Business Rules:**

- Name is required
- Name must be valid (validated by SagaInstanceNameValueObject)

**Events Published:**

- `SagaInstanceCreatedEvent` - Published when saga instance is created

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

**Response:**

```json
{
  "data": {
    "sagaInstanceUpdate": {
      "success": true,
      "message": "Saga instance updated successfully",
      "id": "saga-instance-uuid"
    }
  }
}
```

**Business Rules:**

- Saga instance must exist
- All provided fields are validated

**Events Published:**

- `SagaInstanceUpdatedEvent` - Published when saga instance is updated

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

**Response:**

```json
{
  "data": {
    "sagaInstanceChangeStatus": {
      "success": true,
      "message": "Saga instance deleted successfully",
      "id": "saga-instance-uuid"
    }
  }
}
```

**Business Rules:**

- Saga instance must exist
- Status must be valid
- Status transitions follow business rules

**Events Published:**

- `SagaInstanceStatusChangedEvent` - Published when saga instance status changes

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

**Response:**

```json
{
  "data": {
    "sagaInstanceDelete": {
      "success": true,
      "message": "Saga instance deleted successfully",
      "id": "saga-instance-uuid"
    }
  }
}
```

**Business Rules:**

- Saga instance must exist

**Events Published:**

- `SagaInstanceDeletedEvent` - Published when saga instance is deleted

## Domain Events

The Saga Instance module publishes the following domain events:

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

## Example Usage

### Complete Saga Instance Lifecycle

```graphql
# 1. Create saga instance
mutation {
  sagaInstanceCreate(input: { name: "Order Processing Saga" }) {
    success
    message
    id
  }
}

# 2. Start the saga
mutation {
  sagaInstanceChangeStatus(
    input: { id: "saga-instance-uuid", status: STARTED }
  ) {
    success
    message
  }
}

# 3. Mark as running
mutation {
  sagaInstanceChangeStatus(
    input: { id: "saga-instance-uuid", status: RUNNING }
  ) {
    success
    message
  }
}

# 4. Complete the saga
mutation {
  sagaInstanceChangeStatus(
    input: { id: "saga-instance-uuid", status: COMPLETED }
  ) {
    success
    message
  }
}
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

## Repositories

The module uses a dual repository pattern:

### Write Repository (Prisma)

- Used for command operations (create, update, delete)
- Implements `SagaInstanceWriteRepository`
- Uses Prisma ORM for database operations
- Stores data in PostgreSQL

### Read Repository (MongoDB)

- Used for query operations (find by id, find by criteria)
- Implements `SagaInstanceReadRepository`
- Uses MongoDB for optimized read performance

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
