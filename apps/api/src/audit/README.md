# Audit Module

## Overview

The Audit Module is a comprehensive auditing system designed to track and log all domain events that occur within the application. It follows the CQRS (Command Query Responsibility Segregation) pattern and implements event-driven architecture to maintain a complete audit trail of system activities.

## Purpose

This module serves several critical purposes:

- **Event Tracking**: Automatically captures and logs all domain events that occur in the system
- **Audit Trail**: Maintains a complete history of changes for compliance and debugging purposes
- **Read/Write Separation**: Uses separate repositories for write operations (Prisma) and read operations (MongoDB)
- **Event Sourcing**: Provides a foundation for event sourcing capabilities by storing event data
- **Monitoring**: Enables monitoring and analysis of system behavior through event logs

## Architecture

The module follows Domain-Driven Design (DDD) principles with clear separation of concerns:

```
src/audit/
├── application/
│   └── event-handlers/          # Event handlers for different domains
│       ├── audit/              # Audit-specific events
│       └── users/              # User-related events
├── domain/
│   ├── entities/               # Audit aggregate root
│   ├── factories/              # Entity and view model factories
│   ├── primitives/             # Data transfer objects
│   ├── repositories/           # Repository interfaces
│   ├── value-objects/          # Domain value objects
│   └── view-models/            # Read model representations
└── infrastructure/
    ├── mongodb/                # Read repository implementation
    └── prisma/                 # Write repository implementation
```

## Key Components

### 1. Audit Entity

The core domain entity that represents an audit record with the following properties:

- `id`: Unique identifier for the audit record
- `eventType`: Type of event that occurred (e.g., "UserCreated", "UserDeleted")
- `aggregateType`: Type of aggregate that triggered the event (e.g., "User")
- `aggregateId`: Unique identifier of the aggregate instance
- `payload`: Event data containing the details of what changed
- `timestamp`: When the event occurred

### 2. Event Handlers

Event handlers are responsible for capturing domain events and creating audit records. Each domain event should have a corresponding audit event handler.

#### Current Event Handlers:

- `AuditCreatedEventHandler`: Handles audit creation events for read model synchronization
- `UserCreatedEventHandler`: Handles user creation events
- `UserUpdatedEventHandler`: Handles user update events
- `UserDeletedEventHandler`: Handles user deletion events

### 3. Repositories

- **Write Repository (Prisma)**: Handles persistence of audit entities to the primary database
- **Read Repository (MongoDB)**: Handles read operations and view model storage for optimized queries

### 4. Factories

- `AuditFactory`: Creates audit domain entities from event data
- `AuditViewModelFactory`: Creates view models for read operations

## Event Handler Pattern

When a domain event is published anywhere in the system, the corresponding audit event handler:

1. **Receives the Event**: Listens for specific domain events using `@EventsHandler` decorator
2. **Creates Audit Entity**: Uses `AuditFactory` to create an audit record from event data
3. **Persists to Write Store**: Saves the audit entity using `AuditWriteRepository`
4. **Publishes Audit Event**: Triggers `AuditCreatedEvent` for read model synchronization
5. **Updates Read Store**: `AuditCreatedEventHandler` updates the read repository with view models

## Adding New Event Handlers

**⚠️ IMPORTANT**: Whenever you create a new domain event in any module, you MUST create a corresponding audit event handler to maintain the audit trail.

### Step-by-Step Process:

#### 1. Create the Event Handler

Create a new event handler file following the naming convention:

```
src/audit/application/event-handlers/{domain}/{event-name}/{event-name}.event-handler.ts
```

Example structure:

```typescript
import {
  AUDIT_FACTORY_TOKEN,
  AuditFactory,
} from '@/audit/domain/factories/audit.factory';
import {
  AUDIT_WRITE_REPOSITORY_TOKEN,
  AuditWriteRepository,
} from '@/audit/domain/repositories/audit-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { YourDomainEvent } from '@/shared/domain/events/your-domain/your-event/your-event.event';

@EventsHandler(YourDomainEvent)
export class YourEventEventHandler implements IEventHandler<YourDomainEvent> {
  private readonly logger = new Logger(YourEventEventHandler.name);

  constructor(
    @Inject(AUDIT_WRITE_REPOSITORY_TOKEN)
    private readonly auditWriteRepository: AuditWriteRepository,
    @Inject(AUDIT_FACTORY_TOKEN)
    private readonly auditFactory: AuditFactory,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: YourDomainEvent) {
    this.logger.log(`Handling your event: ${event.aggregateId}`);

    // Create the audit entity
    const newAudit = this.auditFactory.create({
      eventType: event.eventType,
      aggregateType: event.aggregateType,
      aggregateId: event.aggregateId,
      payload: event.data, // or null if no data
      timestamp: event.ocurredAt,
    });

    // Save the audit entity
    await this.auditWriteRepository.save(newAudit);

    // Publish the audit events
    await this.eventBus.publishAll(newAudit.getUncommittedEvents());

    // Mark the audit events as committed
    newAudit.commit();
  }
}
```

#### 2. Register the Event Handler

Add your new event handler to the `EVENT_HANDLERS` array in `src/audit/audit.module.ts`:

```typescript
const EVENT_HANDLERS = [
  AuditCreatedEventHandler,
  UserCreatedEventHandler,
  UserDeletedEventHandler,
  UserUpdatedEventHandler,
  YourEventEventHandler, // Add your handler here
];
```

#### 3. Import the Handler

Add the import statement at the top of the `audit.module.ts` file:

```typescript
import { YourEventEventHandler } from '@/audit/application/event-handlers/your-domain/your-event/your-event.event-handler';
```

### Event Handler Types

There are two main patterns for event handlers based on the event data:

#### 1. Events with Data (Create/Update operations)

For events that contain data (like user creation or updates), include the event data in the audit payload:

```typescript
const newAudit = this.auditFactory.create({
  eventType: event.eventType,
  aggregateType: event.aggregateType,
  aggregateId: event.aggregateId,
  payload: event.data, // Include the event data
  timestamp: event.ocurredAt,
});
```

#### 2. Events without Data (Delete operations)

For events that don't contain data (like deletions), set payload to null:

```typescript
const newAudit = this.auditFactory.create({
  eventType: event.eventType,
  aggregateType: event.aggregateType,
  aggregateId: event.aggregateId,
  payload: null, // No data for delete operations
  timestamp: event.ocurredAt,
});
```

## Database Configuration

The audit module uses two different databases:

- **Write Database (Prisma/PostgreSQL)**: Primary storage for audit entities
- **Read Database (MongoDB)**: Optimized storage for audit view models and queries

Ensure both databases are properly configured in your environment.

## Best Practices

1. **Always Create Event Handlers**: Never skip creating an audit event handler for new domain events
2. **Consistent Naming**: Follow the established naming conventions for files and classes
3. **Proper Logging**: Include appropriate logging statements for debugging and monitoring
4. **Error Handling**: Implement proper error handling in event handlers
5. **Testing**: Write unit tests for each event handler
6. **Documentation**: Update this README when adding new event handler patterns

## Troubleshooting

### Common Issues:

1. **Missing Event Handler**: If events are not being audited, check that the event handler is properly registered in the module
2. **Database Connection**: Ensure both Prisma and MongoDB connections are properly configured
3. **Event Publishing**: Verify that domain events are being published correctly from the source modules
4. **Circular Dependencies**: Be careful of circular dependencies when importing event classes

## Monitoring

The audit module provides comprehensive logging through NestJS Logger. Monitor the following:

- Event handler execution logs
- Database operation logs
- Error logs for failed audit operations

## Contributing

When contributing to the audit module:

1. Follow the established patterns and conventions
2. Add appropriate tests for new functionality
3. Update this documentation for any changes
4. Ensure all event handlers follow the standard pattern
5. Test both write and read operations

---

**Remember**: The audit trail is critical for system integrity. Always ensure that new domain events have corresponding audit event handlers to maintain a complete audit history.
