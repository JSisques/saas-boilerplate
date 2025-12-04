---
title: Saga Log
description: Complete guide to saga log management
---

The **Saga Log** module provides comprehensive logging and audit trail capabilities for saga operations. It automatically creates logs for saga instance and step events, providing complete traceability and debugging capabilities following Clean Architecture principles, CQRS pattern, and Domain-Driven Design.

> **Important:** Saga logs are automatically created for saga events. You can also manually create logs for custom events or debugging purposes.

## Overview

The Saga Log Module provides a complete solution for logging and auditing saga operations. It automatically creates logs for saga instance and step events, providing comprehensive traceability.

### Features

- ✅ Automatic log creation for saga events
- ✅ Multiple log types (INFO, WARNING, ERROR, DEBUG)
- ✅ Filtering by saga instance or step
- ✅ Complete audit trail
- ✅ GraphQL API for log operations
- ✅ Event-driven architecture
- ✅ CQRS pattern with separate read/write repositories

## Saga Log Entity

A saga log represents a log entry for saga operations. Each log has:

- **Unique identifier** - UUID-based saga log ID
- **Saga instance ID** - Parent saga instance reference
- **Saga step ID** - Parent saga step reference
- **Type** - Log type (INFO, WARNING, ERROR, DEBUG)
- **Message** - Log message describing the event
- **Lifecycle events** - Created, Updated, Deleted events

## Log Types

Saga logs can have one of the following types:

### INFO

Informational log entry.

**Use Cases:**

- Saga instance created
- Step started
- Step completed
- Status changes

### WARNING

Warning log entry.

**Use Cases:**

- Retry attempts
- Non-critical errors
- Performance warnings

### ERROR

Error log entry.

**Use Cases:**

- Step failures
- Saga failures
- Critical errors

### DEBUG

Debug log entry.

**Use Cases:**

- Detailed execution information
- Debugging information
- Development logs

## Automatic Log Creation

Logs are automatically created when saga events occur:

### Saga Instance Events

- **SagaInstanceCreatedEvent** → Creates INFO log
- **SagaInstanceUpdatedEvent** → Creates INFO log
- **SagaInstanceDeletedEvent** → Creates INFO log
- **SagaInstanceStatusChangedEvent** → Creates INFO log with status change details

### Saga Step Events

- **SagaStepCreatedEvent** → Creates INFO log
- **SagaStepUpdatedEvent** → Creates INFO log
- **SagaStepDeletedEvent** → Creates INFO log
- **SagaStepStatusChangedEvent** → Creates INFO/ERROR log based on status

## GraphQL API

### Queries

#### sagaLogFindById

Finds a saga log by ID.

```graphql
query FindSagaLogById($input: SagaLogFindByIdRequestDto!) {
  sagaLogFindById(input: $input) {
    id
    sagaInstanceId
    sagaStepId
    type
    message
    createdAt
    updatedAt
  }
}
```

**Variables:**

```json
{
  "input": {
    "id": "saga-log-uuid"
  }
}
```

**Response:**

```json
{
  "data": {
    "sagaLogFindById": {
      "id": "saga-log-uuid",
      "sagaInstanceId": "saga-instance-uuid",
      "sagaStepId": "saga-step-uuid",
      "type": "INFO",
      "message": "Saga instance created",
      "createdAt": "2025-01-01T09:00:00.000Z",
      "updatedAt": "2025-01-01T09:00:00.000Z"
    }
  }
}
```

#### sagaLogFindByCriteria

Finds saga logs by criteria with pagination.

```graphql
query FindSagaLogsByCriteria($input: SagaLogFindByCriteriaRequestDto) {
  sagaLogFindByCriteria(input: $input) {
    items {
      id
      sagaInstanceId
      sagaStepId
      type
      message
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
        "field": "type",
        "operator": "EQUALS",
        "value": "ERROR"
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
    "sagaLogFindByCriteria": {
      "items": [
        {
          "id": "saga-log-uuid",
          "sagaInstanceId": "saga-instance-uuid",
          "sagaStepId": "saga-step-uuid",
          "type": "ERROR",
          "message": "Step failed: Connection timeout",
          "createdAt": "2025-01-01T10:00:00.000Z"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
}
```

#### sagaLogFindBySagaInstanceId

Finds all logs for a specific saga instance.

```graphql
query FindSagaLogsBySagaInstanceId(
  $input: SagaLogFindBySagaInstanceIdRequestDto!
) {
  sagaLogFindBySagaInstanceId(input: $input) {
    id
    sagaStepId
    type
    message
    createdAt
  }
}
```

**Variables:**

```json
{
  "input": {
    "sagaInstanceId": "saga-instance-uuid"
  }
}
```

**Response:**

```json
{
  "data": {
    "sagaLogFindBySagaInstanceId": [
      {
        "id": "saga-log-uuid-1",
        "sagaStepId": "saga-step-uuid-1",
        "type": "INFO",
        "message": "Saga instance created",
        "createdAt": "2025-01-01T09:00:00.000Z"
      },
      {
        "id": "saga-log-uuid-2",
        "sagaStepId": "saga-step-uuid-1",
        "type": "INFO",
        "message": "Step started",
        "createdAt": "2025-01-01T10:00:00.000Z"
      },
      {
        "id": "saga-log-uuid-3",
        "sagaStepId": "saga-step-uuid-1",
        "type": "INFO",
        "message": "Step completed",
        "createdAt": "2025-01-01T10:05:00.000Z"
      }
    ]
  }
}
```

#### sagaLogFindBySagaStepId

Finds all logs for a specific saga step.

```graphql
query FindSagaLogsBySagaStepId($input: SagaLogFindBySagaStepIdRequestDto!) {
  sagaLogFindBySagaStepId(input: $input) {
    id
    type
    message
    createdAt
  }
}
```

**Variables:**

```json
{
  "input": {
    "sagaStepId": "saga-step-uuid"
  }
}
```

**Response:**

```json
{
  "data": {
    "sagaLogFindBySagaStepId": [
      {
        "id": "saga-log-uuid-1",
        "type": "INFO",
        "message": "Step started",
        "createdAt": "2025-01-01T10:00:00.000Z"
      },
      {
        "id": "saga-log-uuid-2",
        "type": "ERROR",
        "message": "Step failed: Connection timeout",
        "createdAt": "2025-01-01T10:02:00.000Z"
      }
    ]
  }
}
```

### Mutations

#### sagaLogCreate

Creates a new saga log entry.

```graphql
mutation CreateSagaLog($input: SagaLogCreateRequestDto!) {
  sagaLogCreate(input: $input) {
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
    "sagaInstanceId": "saga-instance-uuid",
    "sagaStepId": "saga-step-uuid",
    "type": "INFO",
    "message": "Step execution started"
  }
}
```

**Response:**

```json
{
  "data": {
    "sagaLogCreate": {
      "success": true,
      "message": "Saga log created successfully",
      "id": "saga-log-uuid"
    }
  }
}
```

**Business Rules:**

- Saga instance must exist
- Saga step must exist
- Type is required
- Message is required

**Events Published:**

- `SagaLogCreatedEvent` - Published when saga log is created

#### sagaLogUpdate

Updates an existing saga log entry.

```graphql
mutation UpdateSagaLog($input: SagaLogUpdateRequestDto!) {
  sagaLogUpdate(input: $input) {
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
    "id": "saga-log-uuid",
    "type": "ERROR",
    "message": "Updated error message"
  }
}
```

**Business Rules:**

- Saga log must exist
- All provided fields are validated

**Events Published:**

- `SagaLogUpdatedEvent` - Published when saga log is updated

#### sagaLogDelete

Deletes a saga log entry.

```graphql
mutation DeleteSagaLog($input: SagaLogDeleteRequestDto!) {
  sagaLogDelete(input: $input) {
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
    "id": "saga-log-uuid"
  }
}
```

**Business Rules:**

- Saga log must exist

**Events Published:**

- `SagaLogDeletedEvent` - Published when saga log is deleted

## Domain Events

The Saga Log module publishes the following domain events:

### SagaLogCreatedEvent

Published when a saga log is created.

**Handler:** `SagaLogCreatedEventHandler`

**Process:**

1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

### SagaLogUpdatedEvent

Published when a saga log is updated.

**Handler:** `SagaLogUpdatedEventHandler`

**Process:**

1. Creates or updates view model from event data
2. Saves view model to read repository (MongoDB)

### SagaLogDeletedEvent

Published when a saga log is deleted.

**Handler:** `SagaLogDeletedEventHandler`

**Process:**

1. Asserts view model exists
2. Deletes view model from read repository (MongoDB)

## Example Usage

### Query Logs by Saga Instance

```graphql
query {
  sagaLogFindBySagaInstanceId(input: { sagaInstanceId: "saga-instance-uuid" }) {
    id
    sagaStepId
    type
    message
    createdAt
  }
}
```

### Query Logs by Type

```graphql
query {
  sagaLogFindByCriteria(
    input: {
      filters: [{ field: "type", operator: EQUALS, value: "ERROR" }]
      sorts: [{ field: "createdAt", direction: DESC }]
      pagination: { page: 1, limit: 20 }
    }
  ) {
    items {
      id
      sagaInstanceId
      sagaStepId
      type
      message
      createdAt
    }
    total
  }
}
```

### Query Logs by Saga Step

```graphql
query {
  sagaLogFindBySagaStepId(input: { sagaStepId: "saga-step-uuid" }) {
    id
    type
    message
    createdAt
  }
}
```

### Create Custom Log

```graphql
mutation {
  sagaLogCreate(
    input: {
      sagaInstanceId: "saga-instance-uuid"
      sagaStepId: "saga-step-uuid"
      type: DEBUG
      message: "Custom debug information"
    }
  ) {
    success
    message
    id
  }
}
```

## Repositories

The module uses a dual repository pattern:

### Write Repository (Prisma)

- Used for command operations (create, update, delete)
- Implements `SagaLogWriteRepository`
- Uses Prisma ORM for database operations
- Stores data in PostgreSQL

### Read Repository (MongoDB)

- Used for query operations (find by id, find by criteria)
- Implements `SagaLogReadRepository`
- Uses MongoDB for optimized read performance

## Troubleshooting

### Common Issues

1. **Log Not Found:**
   - Solution: Verify the log ID exists
   - Check if the log was deleted

2. **Logs Not Created Automatically:**
   - Solution: Check event handlers are registered
   - Verify event bus is configured correctly
   - Check saga instance and step events are being published

3. **Missing Logs for Saga Instance:**
   - Solution: Verify saga instance ID is correct
   - Check if logs were created for the saga instance
   - Verify read repository is synced with write repository

### Debugging

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed logs for:

- Log create/update/delete operations
- Repository operations
- Event handling
- Automatic log creation

## Best Practices

1. **Log Types** - Use appropriate log types (INFO, WARNING, ERROR, DEBUG)
2. **Messages** - Include descriptive messages for debugging
3. **Automatic Logging** - Rely on automatic log creation for saga events
4. **Filtering** - Use filters to find specific logs (by type, saga instance, step)
5. **Audit Trail** - Logs provide complete audit trail for saga operations

## Integration with Other Modules

### Saga Instance Module

- Logs are automatically created for saga instance events
- Logs can be filtered by saga instance ID
- Logs track saga instance lifecycle

### Saga Step Module

- Logs are automatically created for saga step events
- Logs can be filtered by saga step ID
- Logs track step execution and failures
