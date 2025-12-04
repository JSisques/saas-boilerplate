# Saga Step Module

A comprehensive module for managing individual steps within saga instances. This module handles step creation, execution, retries, and status management following Clean Architecture principles, CQRS pattern, and Domain-Driven Design.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Saga Step Status](#saga-step-status)
- [Commands](#commands)
- [Queries](#queries)
- [Events](#events)
- [Repositories](#repositories)
- [GraphQL API](#graphql-api)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

The Saga Step Module provides a complete solution for managing individual steps within saga workflows. It handles step creation, execution, retries, error handling, and status management.

### Features

- ✅ Step creation, update, and deletion
- ✅ Ordered execution with step ordering
- ✅ Status management (PENDING, STARTED, RUNNING, COMPLETED, FAILED)
- ✅ Retry mechanism with configurable max retries
- ✅ Error message tracking
- ✅ Payload and result storage
- ✅ Start and end date tracking
- ✅ GraphQL API for step operations
- ✅ Event-driven architecture
- ✅ CQRS pattern with separate read/write repositories
- ✅ Domain-driven design with value objects and aggregates

## Architecture

The module is organized following Clean Architecture principles:

```
saga-step/
├── application/              # Application layer (CQRS)
│   ├── commands/            # Command handlers
│   │   ├── saga-step-create/
│   │   ├── saga-step-update/
│   │   ├── saga-step-delete/
│   │   └── saga-step-change-status/
│   ├── queries/             # Query handlers
│   │   ├── saga-step-find-by-id/
│   │   ├── saga-step-find-by-criteria/
│   │   ├── saga-step-find-by-saga-instance-id/
│   │   ├── saga-step-find-view-model-by-id/
│   │   └── saga-step-find-view-model-by-saga-instance-id/
│   ├── event-handlers/      # Event handlers
│   │   ├── saga-step-created/
│   │   ├── saga-step-updated/
│   │   ├── saga-step-deleted/
│   │   └── saga-step-status-changed/
│   ├── services/           # Application services
│   │   ├── assert-saga-step-exists/
│   │   ├── assert-saga-step-not-exists/
│   │   └── assert-saga-step-view-model-exists/
│   └── dtos/               # Data transfer objects
├── domain/                  # Domain layer
│   ├── aggregates/         # Domain aggregates
│   │   └── saga-step.aggregate.ts
│   ├── value-objects/      # Value objects
│   │   ├── saga-step-name/
│   │   ├── saga-step-order/
│   │   ├── saga-step-status/
│   │   ├── saga-step-start-date/
│   │   ├── saga-step-end-date/
│   │   ├── saga-step-error-message/
│   │   ├── saga-step-retry-count/
│   │   ├── saga-step-max-retries/
│   │   ├── saga-step-payload/
│   │   └── saga-step-result/
│   ├── repositories/       # Repository interfaces
│   │   ├── saga-step-read.repository.ts
│   │   └── saga-step-write.repository.ts
│   ├── factories/          # Aggregate factories
│   │   ├── saga-step-aggregate/
│   │   └── saga-step-view-model/
│   ├── enums/              # Domain enums
│   │   └── saga-step-status/
│   └── primitives/         # Primitive types
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

### Saga Step Aggregate

The `SagaStepAggregate` is the core domain entity that represents an individual step within a saga workflow.

**Properties:**

- `id`: Unique identifier (SagaStepUuidValueObject)
- `sagaInstanceId`: Parent saga instance ID (SagaInstanceUuidValueObject)
- `name`: Step name (SagaStepNameValueObject)
- `order`: Execution order (SagaStepOrderValueObject)
- `status`: Current status (SagaStepStatusValueObject)
- `startDate`: When the step started (SagaStepStartDateValueObject | null)
- `endDate`: When the step ended (SagaStepEndDateValueObject | null)
- `errorMessage`: Error message if failed (SagaStepErrorMessageValueObject | null)
- `retryCount`: Current retry count (SagaStepRetryCountValueObject)
- `maxRetries`: Maximum retry attempts (SagaStepMaxRetriesValueObject)
- `payload`: Step input data (SagaStepPayloadValueObject)
- `result`: Step output data (SagaStepResultValueObject | null)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

**Methods:**

- `update(props)`: Update step properties
- `delete()`: Delete the step
- `markAsPending()`: Set status to PENDING
- `markAsStarted()`: Set status to STARTED and set start date
- `markAsRunning()`: Set status to RUNNING
- `markAsCompleted()`: Set status to COMPLETED and set end date
- `markAsFailed(errorMessage?)`: Set status to FAILED, set end date and optional error message
- `incrementRetryCount()`: Increment the retry count

## Saga Step Status

Saga steps can have one of the following statuses:

### PENDING

The step is created but not yet started.

**Characteristics:**

- Initial state when step is created
- No start or end date
- No error message
- Can be started or deleted

### STARTED

The step has started execution.

**Characteristics:**

- Start date is set when status changes to STARTED
- End date is cleared
- Can transition to RUNNING, COMPLETED, or FAILED

### RUNNING

The step is actively executing.

**Characteristics:**

- Step is in progress
- Business logic is executing
- Can transition to COMPLETED or FAILED

### COMPLETED

The step completed successfully.

**Characteristics:**

- End date is set when status changes to COMPLETED
- Result may be stored
- Step execution is complete

### FAILED

The step failed during execution.

**Characteristics:**

- End date is set when status changes to FAILED
- Error message is stored
- Can be retried if retry count < max retries

## Commands

### Create Saga Step

Creates a new saga step.

**Command:** `SagaStepCreateCommand`

**Handler:** `SagaStepCreateCommandHandler`

**Input:**

```typescript
{
  sagaInstanceId: string;
  name: string;
  order: number;
  payload: any;
  maxRetries?: number;
}
```

**Process:**

1. Validates step properties
2. Asserts saga instance exists
3. Creates saga step aggregate
4. Saves to write repository (Prisma)
5. Publishes `SagaStepCreatedEvent`

**Business Rules:**

- Saga instance must exist
- Name is required
- Order is required and must be unique within saga instance
- Payload is required
- Max retries defaults to 0 if not provided

### Update Saga Step

Updates an existing saga step.

**Command:** `SagaStepUpdateCommand`

**Handler:** `SagaStepUpdateCommandHandler`

**Input:**

```typescript
{
  id: string;
  name?: string;
  order?: number;
  status?: SagaStepStatusEnum;
  startDate?: Date;
  endDate?: Date;
  errorMessage?: string;
  retryCount?: number;
  maxRetries?: number;
  payload?: any;
  result?: any;
}
```

**Process:**

1. Asserts saga step exists
2. Updates saga step aggregate
3. Saves to write repository (Prisma)
4. Publishes `SagaStepUpdatedEvent`

**Business Rules:**

- Saga step must exist
- All provided fields are validated

### Change Saga Step Status

Changes the status of a saga step.

**Command:** `SagaStepChangeStatusCommand`

**Handler:** `SagaStepChangeStatusCommandHandler`

**Input:**

```typescript
{
  id: string;
  status: SagaStepStatusEnum;
  errorMessage?: string;
}
```

**Process:**

1. Asserts saga step exists
2. Updates saga step status using appropriate method
3. Saves to write repository (Prisma)
4. Publishes `SagaStepStatusChangedEvent`

**Business Rules:**

- Saga step must exist
- Status must be valid
- Error message is required when status is FAILED

### Delete Saga Step

Deletes a saga step.

**Command:** `SagaStepDeleteCommand`

**Handler:** `SagaStepDeleteCommandHandler`

**Input:**

```typescript
{
  id: string;
}
```

**Process:**

1. Asserts saga step exists
2. Deletes saga step aggregate
3. Removes from write repository (Prisma)
4. Publishes `SagaStepDeletedEvent`

**Business Rules:**

- Saga step must exist

## Queries

### Find Saga Step by ID

Finds a saga step by its ID.

**Query:** `FindSagaStepByIdQuery`

**Handler:** `FindSagaStepByIdQueryHandler`

**Returns:** `SagaStepAggregate | null`

### Find Saga Steps by Criteria

Finds saga steps matching criteria with pagination.

**Query:** `FindSagaStepsByCriteriaQuery`

**Handler:** `FindSagaStepsByCriteriaQueryHandler`

**Input:**

```typescript
{
  criteria: Criteria; // filters, sorts, pagination
}
```

**Returns:** `PaginatedResult<SagaStepViewModel>`

### Find Saga Steps by Saga Instance ID

Finds all steps for a specific saga instance.

**Query:** `FindSagaStepsBySagaInstanceIdQuery`

**Handler:** `FindSagaStepsBySagaInstanceIdQueryHandler`

**Input:**

```typescript
{
  sagaInstanceId: string;
}
```

**Returns:** `SagaStepAggregate[]`

### Find Saga Step View Model by ID

Finds a saga step view model by ID (from read repository).

**Query:** `FindSagaStepViewModelByIdQuery`

**Handler:** `FindSagaStepViewModelByIdQueryHandler`

**Returns:** `SagaStepViewModel | null`

### Find Saga Step View Models by Saga Instance ID

Finds all step view models for a specific saga instance.

**Query:** `FindSagaStepViewModelsBySagaInstanceIdQuery`

**Handler:** `FindSagaStepViewModelsBySagaInstanceIdQueryHandler`

**Input:**

```typescript
{
  sagaInstanceId: string;
}
```

**Returns:** `SagaStepViewModel[]`

## Events

The module publishes the following domain events:

### SagaStepCreatedEvent

Published when a saga step is created.

**Handler:** `SagaStepCreatedEventHandler`

**Process:**

1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

### SagaStepUpdatedEvent

Published when a saga step is updated.

**Handler:** `SagaStepUpdatedEventHandler`

**Process:**

1. Creates or updates view model from event data
2. Saves view model to read repository (MongoDB)

### SagaStepDeletedEvent

Published when a saga step is deleted.

**Handler:** `SagaStepDeletedEventHandler`

**Process:**

1. Asserts view model exists
2. Deletes view model from read repository (MongoDB)

### SagaStepStatusChangedEvent

Published when a saga step status changes.

**Handler:** `SagaStepStatusChangedEventHandler`

**Process:**

1. Creates or updates view model from event data
2. Saves view model to read repository (MongoDB)

## Repositories

The module uses a dual repository pattern:

### Write Repository (Prisma)

- Used for command operations (create, update, delete)
- Implements `SagaStepWriteRepository`
- Uses Prisma ORM for database operations
- Stores data in PostgreSQL

**Operations:**

- `findById(id: string): Promise<SagaStepAggregate | null>`
- `findBySagaInstanceId(sagaInstanceId: string): Promise<SagaStepAggregate[]>`
- `save(sagaStep: SagaStepAggregate): Promise<SagaStepAggregate>`
- `delete(id: string): Promise<boolean>`

### Read Repository (MongoDB)

- Used for query operations (find by id, find by criteria)
- Implements `SagaStepReadRepository`
- Uses MongoDB for optimized read performance

**Operations:**

- `findById(id: string): Promise<SagaStepViewModel | null>`
- `findBySagaInstanceId(sagaInstanceId: string): Promise<SagaStepViewModel[]>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<SagaStepViewModel>>`
- `save(sagaStepViewModel: SagaStepViewModel): Promise<void>`
- `delete(id: string): Promise<boolean>`

## GraphQL API

### Queries

#### sagaStepFindById

Finds a saga step by ID.

```graphql
query FindSagaStepById($input: SagaStepFindByIdRequestDto!) {
  sagaStepFindById(input: $input) {
    id
    sagaInstanceId
    name
    order
    status
    startDate
    endDate
    errorMessage
    retryCount
    maxRetries
    payload
    result
    createdAt
    updatedAt
  }
}
```

**Variables:**

```json
{
  "input": {
    "id": "saga-step-uuid"
  }
}
```

#### sagaStepFindByCriteria

Finds saga steps by criteria with pagination.

```graphql
query FindSagaStepsByCriteria($input: SagaStepFindByCriteriaRequestDto) {
  sagaStepFindByCriteria(input: $input) {
    items {
      id
      sagaInstanceId
      name
      order
      status
      retryCount
      maxRetries
    }
    total
    page
    limit
  }
}
```

#### sagaStepFindBySagaInstanceId

Finds all steps for a specific saga instance.

```graphql
query FindSagaStepsBySagaInstanceId(
  $input: SagaStepFindBySagaInstanceIdRequestDto!
) {
  sagaStepFindBySagaInstanceId(input: $input) {
    id
    name
    order
    status
    startDate
    endDate
    errorMessage
    retryCount
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

### Mutations

#### sagaStepCreate

Creates a new saga step.

```graphql
mutation CreateSagaStep($input: SagaStepCreateRequestDto!) {
  sagaStepCreate(input: $input) {
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
    "name": "Reserve Inventory",
    "order": 1,
    "payload": {
      "productId": "123",
      "quantity": 2
    },
    "maxRetries": 3
  }
}
```

#### sagaStepUpdate

Updates an existing saga step.

```graphql
mutation UpdateSagaStep($input: SagaStepUpdateRequestDto!) {
  sagaStepUpdate(input: $input) {
    success
    message
    id
  }
}
```

#### sagaStepChangeStatus

Changes the status of a saga step.

```graphql
mutation ChangeSagaStepStatus($input: SagaStepChangeStatusRequestDto!) {
  sagaStepChangeStatus(input: $input) {
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
    "id": "saga-step-uuid",
    "status": "COMPLETED"
  }
}
```

#### sagaStepDelete

Deletes a saga step.

```graphql
mutation DeleteSagaStep($input: SagaStepDeleteRequestDto!) {
  sagaStepDelete(input: $input) {
    success
    message
    id
  }
}
```

## Examples

### Complete Saga Step Lifecycle

```typescript
// 1. Create saga step
const stepId = await commandBus.execute(
  new SagaStepCreateCommand({
    sagaInstanceId: 'saga-instance-uuid',
    name: 'Process Payment',
    order: 1,
    payload: { amount: 100, currency: 'USD' },
    maxRetries: 3,
  }),
);

// 2. Start the step
await commandBus.execute(
  new SagaStepChangeStatusCommand({
    id: stepId,
    status: SagaStepStatusEnum.STARTED,
  }),
);

// 3. Mark as running
await commandBus.execute(
  new SagaStepChangeStatusCommand({
    id: stepId,
    status: SagaStepStatusEnum.RUNNING,
  }),
);

// 4. Complete the step
await commandBus.execute(
  new SagaStepChangeStatusCommand({
    id: stepId,
    status: SagaStepStatusEnum.COMPLETED,
  }),
);
```

### Retry Mechanism

```typescript
// If step fails, increment retry count
const step = await queryBus.execute(new FindSagaStepByIdQuery({ id: stepId }));

if (step.retryCount.value < step.maxRetries.value) {
  step.incrementRetryCount();
  await writeRepository.save(step);

  // Retry the step
  await commandBus.execute(
    new SagaStepChangeStatusCommand({
      id: stepId,
      status: SagaStepStatusEnum.PENDING,
    }),
  );
} else {
  // Max retries exceeded, mark as failed
  step.markAsFailed('Max retries exceeded');
  await writeRepository.save(step);
}
```

## Value Objects

The module uses value objects to ensure data integrity:

- **SagaStepNameValueObject** - Validates step name
- **SagaStepOrderValueObject** - Validates step order
- **SagaStepStatusValueObject** - Validates step status enum
- **SagaStepStartDateValueObject** - Validates start date
- **SagaStepEndDateValueObject** - Validates end date
- **SagaStepErrorMessageValueObject** - Validates error message
- **SagaStepRetryCountValueObject** - Validates retry count
- **SagaStepMaxRetriesValueObject** - Validates max retries
- **SagaStepPayloadValueObject** - Validates payload
- **SagaStepResultValueObject** - Validates result

## Troubleshooting

### Common Issues

1. **Step Not Found:**
   - Solution: Verify the step ID exists
   - Check if the step was deleted

2. **Invalid Order:**
   - Solution: Ensure step order is unique within saga instance
   - Steps should be ordered sequentially

3. **Retry Count Exceeded:**
   - Solution: Check max retries configuration
   - Implement proper error handling

### Debugging

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed logs for:

- Step create/update/delete operations
- Repository operations
- Event handling
- Status transitions
- Retry attempts

## Best Practices

1. **Step Ordering** - Always set proper order values to ensure correct execution sequence
2. **Error Handling** - Always handle step failures and store error messages
3. **Retries** - Configure appropriate max retries for steps that might fail transiently
4. **Payload/Result** - Store all necessary data in payload and result for debugging
5. **Status Management** - Use the provided status change methods to maintain consistency

## Integration with Other Modules

### Saga Instance Module

- Steps belong to saga instances
- Step status changes can trigger saga instance status updates
- Steps are ordered within a saga instance

### Saga Log Module

- Step events automatically create logs
- Logs track step lifecycle
- Logs can be filtered by step ID
