# Saga Log Module

A comprehensive module for managing logs and audit trails for saga operations. This module automatically creates logs for saga instance and step events, providing complete traceability and debugging capabilities following Clean Architecture principles, CQRS pattern, and Domain-Driven Design.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Log Types](#log-types)
- [Commands](#commands)
- [Queries](#queries)
- [Events](#events)
- [Repositories](#repositories)
- [GraphQL API](#graphql-api)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

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
- ✅ Domain-driven design with value objects and aggregates

## Architecture

The module is organized following Clean Architecture principles:

```
saga-log/
├── application/              # Application layer (CQRS)
│   ├── commands/            # Command handlers
│   │   ├── saga-log-create/
│   │   ├── saga-log-update/
│   │   └── saga-log-delete/
│   ├── queries/             # Query handlers
│   │   ├── saga-log-find-by-id/
│   │   ├── saga-log-find-by-criteria/
│   │   ├── saga-log-find-by-saga-instance-id/
│   │   ├── saga-log-find-by-saga-step-id/
│   │   ├── saga-log-find-view-model-by-id/
│   │   ├── saga-log-find-view-model-by-saga-instance-id/
│   │   └── saga-log-find-view-model-by-saga-step-id/
│   ├── event-handlers/      # Event handlers
│   │   ├── saga-log-created/
│   │   ├── saga-log-updated/
│   │   ├── saga-log-deleted/
│   │   ├── saga-instance-created/
│   │   ├── saga-instance-updated/
│   │   ├── saga-instance-deleted/
│   │   ├── saga-instance-status-changed/
│   │   ├── saga-step-created/
│   │   ├── saga-step-updated/
│   │   ├── saga-step-deleted/
│   │   └── saga-step-status-changed/
│   ├── services/           # Application services
│   │   ├── assert-saga-log-exists/
│   │   ├── assert-saga-log-not-exists/
│   │   └── assert-saga-log-view-model-exists/
│   └── dtos/               # Data transfer objects
├── domain/                  # Domain layer
│   ├── aggregates/         # Domain aggregates
│   │   └── saga-log.aggregate.ts
│   ├── value-objects/      # Value objects
│   │   ├── saga-log-type/
│   │   └── saga-log-message/
│   ├── repositories/       # Repository interfaces
│   │   ├── saga-log-read.repository.ts
│   │   └── saga-log-write.repository.ts
│   ├── factories/          # Aggregate factories
│   │   ├── saga-log-aggregate/
│   │   └── saga-log-view-model/
│   ├── enums/              # Domain enums
│   │   └── saga-log-type/
│   └── primitives/         # Primitive types
│       ├── saga-log.primitives.ts
│       └── saga-step.primitives.ts
├── infrastructure/          # Infrastructure layer
│   └── database/          # Database implementations
│       ├── prisma/       # Prisma write repository
│       └── mongodb/      # MongoDB read repository
└── transport/              # Transport layer
    └── graphql/           # GraphQL resolvers and DTOs
        ├── resolvers/
        ├── dtos/
        └── mappers/
```

## Domain Model

### Saga Log Aggregate

The `SagaLogAggregate` is the core domain entity that represents a log entry for saga operations.

**Properties:**

- `id`: Unique identifier (SagaLogUuidValueObject)
- `sagaInstanceId`: Parent saga instance ID (SagaInstanceUuidValueObject)
- `sagaStepId`: Parent saga step ID (SagaStepUuidValueObject)
- `type`: Log type (SagaLogTypeValueObject)
- `message`: Log message (SagaLogMessageValueObject)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

**Methods:**

- `update(props)`: Update log properties
- `delete()`: Delete the log

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

## Commands

### Create Saga Log

Creates a new saga log entry.

**Command:** `SagaLogCreateCommand`

**Handler:** `SagaLogCreateCommandHandler`

**Input:**

```typescript
{
  sagaInstanceId: string;
  sagaStepId: string;
  type: SagaLogTypeEnum;
  message: string;
}
```

**Process:**

1. Validates log properties
2. Asserts saga instance exists
3. Asserts saga step exists
4. Creates saga log aggregate
5. Saves to write repository (Prisma)
6. Publishes `SagaLogCreatedEvent`

**Business Rules:**

- Saga instance must exist
- Saga step must exist
- Type is required
- Message is required

### Update Saga Log

Updates an existing saga log entry.

**Command:** `SagaLogUpdateCommand`

**Handler:** `SagaLogUpdateCommandHandler`

**Input:**

```typescript
{
  id: string;
  type?: SagaLogTypeEnum;
  message?: string;
}
```

**Process:**

1. Asserts saga log exists
2. Updates saga log aggregate
3. Saves to write repository (Prisma)
4. Publishes `SagaLogUpdatedEvent`

**Business Rules:**

- Saga log must exist
- All provided fields are validated

### Delete Saga Log

Deletes a saga log entry.

**Command:** `SagaLogDeleteCommand`

**Handler:** `SagaLogDeleteCommandHandler`

**Input:**

```typescript
{
  id: string;
}
```

**Process:**

1. Asserts saga log exists
2. Deletes saga log aggregate
3. Removes from write repository (Prisma)
4. Publishes `SagaLogDeletedEvent`

**Business Rules:**

- Saga log must exist

## Queries

### Find Saga Log by ID

Finds a saga log by its ID.

**Query:** `FindSagaLogByIdQuery`

**Handler:** `FindSagaLogByIdQueryHandler`

**Returns:** `SagaLogAggregate | null`

### Find Saga Logs by Criteria

Finds saga logs matching criteria with pagination.

**Query:** `FindSagaLogsByCriteriaQuery`

**Handler:** `FindSagaLogsByCriteriaQueryHandler`

**Input:**

```typescript
{
  criteria: Criteria; // filters, sorts, pagination
}
```

**Returns:** `PaginatedResult<SagaLogViewModel>`

### Find Saga Logs by Saga Instance ID

Finds all logs for a specific saga instance.

**Query:** `FindSagaLogsBySagaInstanceIdQuery`

**Handler:** `FindSagaLogsBySagaInstanceIdQueryHandler`

**Input:**

```typescript
{
  sagaInstanceId: string;
}
```

**Returns:** `SagaLogAggregate[]`

### Find Saga Logs by Saga Step ID

Finds all logs for a specific saga step.

**Query:** `FindSagaLogsBySagaStepIdQuery`

**Handler:** `FindSagaLogsBySagaStepIdQueryHandler`

**Input:**

```typescript
{
  sagaStepId: string;
}
```

**Returns:** `SagaLogAggregate[]`

### Find Saga Log View Model by ID

Finds a saga log view model by ID (from read repository).

**Query:** `FindSagaLogViewModelByIdQuery`

**Handler:** `FindSagaLogViewModelByIdQueryHandler`

**Returns:** `SagaLogViewModel | null`

### Find Saga Log View Models by Saga Instance ID

Finds all log view models for a specific saga instance.

**Query:** `FindSagaLogViewModelsBySagaInstanceIdQuery`

**Handler:** `FindSagaLogViewModelsBySagaInstanceIdQueryHandler`

**Input:**

```typescript
{
  sagaInstanceId: string;
}
```

**Returns:** `SagaLogViewModel[]`

### Find Saga Log View Models by Saga Step ID

Finds all log view models for a specific saga step.

**Query:** `FindSagaLogViewModelsBySagaStepIdQuery`

**Handler:** `FindSagaLogViewModelsBySagaStepIdQueryHandler`

**Input:**

```typescript
{
  sagaStepId: string;
}
```

**Returns:** `SagaLogViewModel[]`

## Events

The module publishes the following domain events:

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

### Automatic Log Creation

The module automatically creates logs for saga instance and step events:

#### Saga Instance Events

- **SagaInstanceCreatedEvent** → Creates INFO log
- **SagaInstanceUpdatedEvent** → Creates INFO log
- **SagaInstanceDeletedEvent** → Creates INFO log
- **SagaInstanceStatusChangedEvent** → Creates INFO log with status change details

**Handler:** `SagaInstanceCreatedEventHandler`, `SagaInstanceUpdatedEventHandler`, `SagaInstanceDeletedEventHandler`, `SagaInstanceStatusChangedEventHandler`

#### Saga Step Events

- **SagaStepCreatedEvent** → Creates INFO log
- **SagaStepUpdatedEvent** → Creates INFO log
- **SagaStepDeletedEvent** → Creates INFO log
- **SagaStepStatusChangedEvent** → Creates INFO/ERROR log based on status

**Handler:** `SagaStepCreatedEventHandler`, `SagaStepUpdatedEventHandler`, `SagaStepDeletedEventHandler`, `SagaStepStatusChangedEventHandler`

## Repositories

The module uses a dual repository pattern:

### Write Repository (Prisma)

- Used for command operations (create, update, delete)
- Implements `SagaLogWriteRepository`
- Uses Prisma ORM for database operations
- Stores data in PostgreSQL

**Operations:**

- `findById(id: string): Promise<SagaLogAggregate | null>`
- `findBySagaInstanceId(sagaInstanceId: string): Promise<SagaLogAggregate[]>`
- `findBySagaStepId(sagaStepId: string): Promise<SagaLogAggregate[]>`
- `save(sagaLog: SagaLogAggregate): Promise<SagaLogAggregate>`
- `delete(id: string): Promise<boolean>`

### Read Repository (MongoDB)

- Used for query operations (find by id, find by criteria)
- Implements `SagaLogReadRepository`
- Uses MongoDB for optimized read performance

**Operations:**

- `findById(id: string): Promise<SagaLogViewModel | null>`
- `findBySagaInstanceId(sagaInstanceId: string): Promise<SagaLogViewModel[]>`
- `findBySagaStepId(sagaStepId: string): Promise<SagaLogViewModel[]>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<SagaLogViewModel>>`
- `save(sagaLogViewModel: SagaLogViewModel): Promise<void>`
- `delete(id: string): Promise<boolean>`

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

## Examples

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

### Automatic Log Creation

Logs are automatically created when saga events occur:

```typescript
// When a saga instance is created
// → SagaInstanceCreatedEvent is published
// → SagaInstanceCreatedEventHandler creates INFO log
// → Log is saved to both write and read repositories

// When a step fails
// → SagaStepStatusChangedEvent is published with FAILED status
// → SagaStepStatusChangedEventHandler creates ERROR log
// → Log includes error message and step details
```

## Value Objects

The module uses value objects to ensure data integrity:

- **SagaLogTypeValueObject** - Validates log type enum
- **SagaLogMessageValueObject** - Validates log message

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
