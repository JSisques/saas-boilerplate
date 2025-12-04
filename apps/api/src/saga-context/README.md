# Saga Context

A comprehensive module for managing distributed transactions using the Saga pattern. This context provides a complete solution for orchestrating long-running business processes across multiple services, with support for compensation, retries, and comprehensive logging.

## Overview

The Saga Context implements the Saga orchestration pattern, which is essential for managing distributed transactions in microservices architectures. It provides three main modules that work together to track and manage complex business workflows:

- **Saga Instance**: Represents a single execution of a saga workflow
- **Saga Step**: Represents individual steps within a saga instance
- **Saga Log**: Provides detailed logging and audit trail for saga operations

### Features

- ✅ Complete saga lifecycle management (create, update, delete, status changes)
- ✅ Step-by-step orchestration with ordering and dependencies
- ✅ Status tracking (PENDING, STARTED, RUNNING, COMPLETED, FAILED, COMPENSATING, COMPENSATED)
- ✅ Automatic compensation support for rollback scenarios
- ✅ Retry mechanism with configurable max retries
- ✅ Comprehensive logging with different log types (INFO, WARNING, ERROR, DEBUG)
- ✅ Event-driven architecture
- ✅ CQRS pattern with separate read/write repositories
- ✅ GraphQL API for all operations
- ✅ Support for both Prisma (write) and MongoDB (read) repositories

## Architecture

The Saga Context follows Clean Architecture principles with clear separation of concerns:

```
saga-context/
├── saga-instance/     # Saga instance management
├── saga-step/         # Step orchestration
├── saga-log/          # Logging and audit trail
└── saga-context.module.ts
```

Each module is organized following the same structure:

```
module/
├── application/       # Application layer (CQRS)
│   ├── commands/     # Command handlers
│   ├── queries/      # Query handlers
│   ├── event-handlers/ # Event handlers
│   ├── services/     # Application services
│   └── dtos/         # Data transfer objects
├── domain/           # Domain layer
│   ├── aggregates/   # Domain aggregates
│   ├── value-objects/ # Value objects
│   ├── repositories/ # Repository interfaces
│   ├── factories/    # Aggregate factories
│   ├── enums/        # Domain enums
│   └── primitives/   # Primitive types
├── infrastructure/   # Infrastructure layer
│   └── database/     # Database implementations
│       ├── prisma/   # Prisma write repository
│       └── mongodb/  # MongoDB read repository
└── transport/        # Transport layer
    └── graphql/      # GraphQL resolvers and DTOs
```

## Modules

### Saga Instance

Manages the lifecycle of saga workflows. Each saga instance represents a single execution of a distributed transaction.

**Key Features:**

- Status management (PENDING, STARTED, RUNNING, COMPLETED, FAILED, COMPENSATING, COMPENSATED)
- Start and end date tracking
- Automatic status transitions
- Compensation support

See [Saga Instance README](./saga-instance/README.md) for detailed documentation.

### Saga Step

Manages individual steps within a saga instance. Steps are executed in order and can have dependencies.

**Key Features:**

- Ordered execution (step ordering)
- Status tracking per step
- Retry mechanism with configurable max retries
- Error message tracking
- Payload and result storage
- Start and end date tracking

See [Saga Step README](./saga-step/README.md) for detailed documentation.

### Saga Log

Provides comprehensive logging and audit trail for saga operations. Logs are automatically created for saga instance and step events.

**Key Features:**

- Automatic log creation for saga events
- Multiple log types (INFO, WARNING, ERROR, DEBUG)
- Filtering by saga instance or step
- Complete audit trail

See [Saga Log README](./saga-log/README.md) for detailed documentation.

## Saga Pattern

The Saga pattern is used to manage distributed transactions across multiple services. Instead of using a traditional two-phase commit, sagas break down transactions into a series of local transactions, each with a compensating action.

### Saga Lifecycle

1. **PENDING**: Saga instance is created but not yet started
2. **STARTED**: Saga instance has started execution
3. **RUNNING**: Saga instance is actively executing steps
4. **COMPLETED**: All steps completed successfully
5. **FAILED**: One or more steps failed
6. **COMPENSATING**: Compensation actions are being executed
7. **COMPENSATED**: All compensation actions completed

### Compensation

When a step fails, the saga can enter compensation mode. Each step can have a compensating action that undoes the work done by that step. The saga executes compensation actions in reverse order.

## Usage Example

```typescript
// 1. Create a saga instance
const sagaInstance = await sagaInstanceService.create({
  name: 'Order Processing Saga',
});

// 2. Create steps for the saga
const step1 = await sagaStepService.create({
  sagaInstanceId: sagaInstance.id,
  name: 'Reserve Inventory',
  order: 1,
  payload: { productId: '123', quantity: 2 },
});

const step2 = await sagaStepService.create({
  sagaInstanceId: sagaInstance.id,
  name: 'Process Payment',
  order: 2,
  payload: { amount: 100, currency: 'USD' },
});

// 3. Start the saga
await sagaInstanceService.markAsStarted(sagaInstance.id);

// 4. Execute steps in order
await sagaStepService.markAsStarted(step1.id);
// ... execute step logic ...
await sagaStepService.markAsCompleted(step1.id);

await sagaStepService.markAsStarted(step2.id);
// ... execute step logic ...
await sagaStepService.markAsCompleted(step2.id);

// 5. Complete the saga
await sagaInstanceService.markAsCompleted(sagaInstance.id);
```

## GraphQL API

All modules expose GraphQL queries and mutations. See individual module documentation for detailed API reference.

### Common Operations

- **Create**: Create new saga instances, steps, or logs
- **Update**: Update existing entities
- **Delete**: Delete entities
- **Find by ID**: Retrieve a single entity by ID
- **Find by Criteria**: Search entities with filters, sorting, and pagination
- **Change Status**: Update entity status (for instances and steps)

## Events

The Saga Context publishes domain events for all operations:

- `SagaInstanceCreatedEvent`, `SagaInstanceUpdatedEvent`, `SagaInstanceDeletedEvent`, `SagaInstanceStatusChangedEvent`
- `SagaStepCreatedEvent`, `SagaStepUpdatedEvent`, `SagaStepDeletedEvent`, `SagaStepStatusChangedEvent`
- `SagaLogCreatedEvent`, `SagaLogUpdatedEvent`, `SagaLogDeletedEvent`

These events are automatically handled to maintain read models and create logs.

## Repositories

The Saga Context uses a dual repository pattern:

- **Write Repository (Prisma)**: Used for command operations, stores data in PostgreSQL
- **Read Repository (MongoDB)**: Used for query operations, optimized for read performance

## Integration

The Saga Context integrates with:

- **Event Store**: All domain events are stored in MongoDB
- **Shared Module**: Uses shared value objects, aggregates, and utilities
- **GraphQL**: Exposes all operations via GraphQL API

## Best Practices

1. **Step Ordering**: Always set proper order values for steps to ensure correct execution sequence
2. **Error Handling**: Always handle step failures and trigger compensation when needed
3. **Logging**: Use saga logs to track execution and debug issues
4. **Retries**: Configure appropriate max retries for steps that might fail transiently
5. **Status Management**: Use the provided status change methods to maintain consistency
6. **Compensation**: Always implement compensating actions for steps that modify external state

## Troubleshooting

### Common Issues

1. **Steps Not Executing in Order**
   - Solution: Verify step order values are set correctly
   - Check that previous steps are completed before starting next step

2. **Compensation Not Triggering**
   - Solution: Ensure saga instance status is set to FAILED
   - Verify compensation logic is implemented for each step

3. **Logs Not Appearing**
   - Solution: Check event handlers are registered
   - Verify MongoDB connection for read repository

## Related Documentation

- [Saga Instance Module](./saga-instance/README.md)
- [Saga Step Module](./saga-step/README.md)
- [Saga Log Module](./saga-log/README.md)
