---
title: Saga Step
description: Complete guide to saga step management
---

The **Saga Step** module provides comprehensive step management capabilities within saga workflows. It handles step creation, execution, retries, and status management following Clean Architecture principles, CQRS pattern, and Domain-Driven Design.

> **Important:** Saga steps represent individual operations within a saga workflow. Steps are executed in order and can have dependencies on previous steps.

## Overview

The Saga Step Module manages individual steps within saga instances. Each step represents a single operation in a distributed transaction, with support for ordering, retries, error handling, and status tracking.

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

## Saga Step Entity

A saga step represents an individual operation within a saga workflow. Each step has:

- **Unique identifier** - UUID-based saga step ID
- **Saga instance ID** - Parent saga instance reference
- **Name** - Descriptive name for the step
- **Order** - Execution order within the saga
- **Status** - Current execution status
- **Start date** - When the step started execution
- **End date** - When the step completed or failed
- **Error message** - Error details if the step failed
- **Retry count** - Current number of retry attempts
- **Max retries** - Maximum allowed retry attempts
- **Payload** - Input data for the step
- **Result** - Output data from the step
- **Lifecycle events** - Created, Updated, Deleted, StatusChanged events

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

**Response:**

```json
{
  "data": {
    "sagaStepFindById": {
      "id": "saga-step-uuid",
      "sagaInstanceId": "saga-instance-uuid",
      "name": "Reserve Inventory",
      "order": 1,
      "status": "RUNNING",
      "startDate": "2025-01-01T10:00:00.000Z",
      "endDate": null,
      "errorMessage": null,
      "retryCount": 0,
      "maxRetries": 3,
      "payload": {
        "productId": "123",
        "quantity": 2
      },
      "result": null,
      "createdAt": "2025-01-01T09:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
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

**Response:**

```json
{
  "data": {
    "sagaStepFindBySagaInstanceId": [
      {
        "id": "saga-step-uuid-1",
        "name": "Reserve Inventory",
        "order": 1,
        "status": "COMPLETED",
        "startDate": "2025-01-01T10:00:00.000Z",
        "endDate": "2025-01-01T10:05:00.000Z",
        "errorMessage": null,
        "retryCount": 0
      },
      {
        "id": "saga-step-uuid-2",
        "name": "Process Payment",
        "order": 2,
        "status": "RUNNING",
        "startDate": "2025-01-01T10:05:00.000Z",
        "endDate": null,
        "errorMessage": null,
        "retryCount": 0
      }
    ]
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

**Response:**

```json
{
  "data": {
    "sagaStepCreate": {
      "success": true,
      "message": "Saga step created successfully",
      "id": "saga-step-uuid"
    }
  }
}
```

**Business Rules:**

- Saga instance must exist
- Name is required
- Order is required and must be unique within saga instance
- Payload is required
- Max retries defaults to 0 if not provided

**Events Published:**

- `SagaStepCreatedEvent` - Published when saga step is created

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

**Variables:**

```json
{
  "input": {
    "id": "saga-step-uuid",
    "name": "Updated Step Name",
    "result": {
      "reservationId": "reservation-123"
    }
  }
}
```

**Business Rules:**

- Saga step must exist
- All provided fields are validated

**Events Published:**

- `SagaStepUpdatedEvent` - Published when saga step is updated

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

**Response:**

```json
{
  "data": {
    "sagaStepChangeStatus": {
      "success": true,
      "message": "Saga step status changed successfully",
      "id": "saga-step-uuid"
    }
  }
}
```

**Business Rules:**

- Saga step must exist
- Status must be valid
- Error message is required when status is FAILED

**Events Published:**

- `SagaStepStatusChangedEvent` - Published when saga step status changes

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

**Variables:**

```json
{
  "input": {
    "id": "saga-step-uuid"
  }
}
```

**Business Rules:**

- Saga step must exist

**Events Published:**

- `SagaStepDeletedEvent` - Published when saga step is deleted

## Domain Events

The Saga Step module publishes the following domain events:

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

## Example Usage

### Complete Saga Step Lifecycle

```graphql
# 1. Create saga step
mutation {
  sagaStepCreate(
    input: {
      sagaInstanceId: "saga-instance-uuid"
      name: "Process Payment"
      order: 1
      payload: { amount: 100, currency: "USD" }
      maxRetries: 3
    }
  ) {
    success
    message
    id
  }
}

# 2. Start the step
mutation {
  sagaStepChangeStatus(input: { id: "saga-step-uuid", status: STARTED }) {
    success
    message
  }
}

# 3. Mark as running
mutation {
  sagaStepChangeStatus(input: { id: "saga-step-uuid", status: RUNNING }) {
    success
    message
  }
}

# 4. Complete the step
mutation {
  sagaStepChangeStatus(input: { id: "saga-step-uuid", status: COMPLETED }) {
    success
    message
  }
}
```

### Retry Mechanism

When a step fails, you can retry it if the retry count is less than max retries:

```graphql
# 1. Mark step as failed
mutation {
  sagaStepChangeStatus(input: { id: "saga-step-uuid", status: FAILED }) {
    success
    message
  }
}

# 2. Query step to check retry count
query {
  sagaStepFindById(input: { id: "saga-step-uuid" }) {
    retryCount
    maxRetries
  }
}

# 3. If retry count < max retries, reset to PENDING and retry
mutation {
  sagaStepChangeStatus(input: { id: "saga-step-uuid", status: PENDING }) {
    success
    message
  }
}
```

## Repositories

The module uses a dual repository pattern:

### Write Repository (Prisma)

- Used for command operations (create, update, delete)
- Implements `SagaStepWriteRepository`
- Uses Prisma ORM for database operations
- Stores data in PostgreSQL

### Read Repository (MongoDB)

- Used for query operations (find by id, find by criteria)
- Implements `SagaStepReadRepository`
- Uses MongoDB for optimized read performance

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
