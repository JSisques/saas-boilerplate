import { EventPublishService } from '@/event-store-context/event/application/services/event-publish/event-publish.service';
import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { DomainEventFactory } from '@/event-store-context/event/domain/factories/event-domain/event-domain.factory';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/event/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/event/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';
import { EventBus } from '@nestjs/cqrs';

describe('EventPublishService', () => {
  let service: EventPublishService;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockDomainEventFactory: jest.Mocked<DomainEventFactory>;

  beforeEach(() => {
    mockEventBus = {
      publish: jest.fn(),
      publishAll: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockDomainEventFactory = {
      create: jest.fn(),
    } as unknown as jest.Mocked<DomainEventFactory>;

    service = new EventPublishService(mockEventBus, mockDomainEventFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createAggregate = () =>
    new EventAggregate(
      {
        id: new EventUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        aggregateId: new EventAggregateIdValueObject(
          '123e4567-e89b-12d3-a456-426614174001',
        ),
        aggregateType: new EventAggregateTypeValueObject('UserAggregate'),
        eventType: new EventTypeValueObject('UserCreatedEvent'),
        payload: new EventPayloadValueObject({ foo: 'bar' }),
        timestamp: new EventTimestampValueObject(
          new Date('2024-01-01T10:00:00Z'),
        ),
        createdAt: new DateValueObject(new Date('2024-01-02T12:00:00Z')),
        updatedAt: new DateValueObject(new Date('2024-01-02T12:00:00Z')),
      },
      false,
    );

  it('should publish domain event created by factory', async () => {
    const aggregate = createAggregate();
    const mockDomainEvent = { eventType: 'UserCreatedEvent' };
    mockDomainEventFactory.create.mockReturnValue(mockDomainEvent as any);

    await service.execute(aggregate);

    expect(mockDomainEventFactory.create).toHaveBeenCalledWith(
      aggregate.eventType.value,
      {
        aggregateId: aggregate.aggregateId.value,
        aggregateType: aggregate.aggregateType.value,
        eventType: aggregate.eventType.value,
        isReplay: true,
      },
      aggregate.payload?.value ?? null,
    );
    expect(mockEventBus.publish).toHaveBeenCalledWith(mockDomainEvent);
    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
  });

  it('should handle aggregates with null payloads', async () => {
    const aggregate = new EventAggregate(
      {
        id: new EventUuidValueObject('123e4567-e89b-12d3-a456-426614174002'),
        aggregateId: new EventAggregateIdValueObject(
          '123e4567-e89b-12d3-a456-426614174003',
        ),
        aggregateType: new EventAggregateTypeValueObject('InvoiceAggregate'),
        eventType: new EventTypeValueObject('InvoiceCreatedEvent'),
        payload: null,
        timestamp: new EventTimestampValueObject(
          new Date('2024-02-01T10:00:00Z'),
        ),
        createdAt: new DateValueObject(new Date('2024-01-02T12:00:00Z')),
        updatedAt: new DateValueObject(new Date('2024-01-02T12:00:00Z')),
      },
      false,
    );
    const mockDomainEvent = { eventType: 'InvoiceCreatedEvent' };
    mockDomainEventFactory.create.mockReturnValue(mockDomainEvent as any);

    await service.execute(aggregate);

    expect(mockDomainEventFactory.create).toHaveBeenCalledWith(
      aggregate.eventType.value,
      {
        aggregateId: aggregate.aggregateId.value,
        aggregateType: aggregate.aggregateType.value,
        eventType: aggregate.eventType.value,
        isReplay: true,
      },
      null,
    );
    expect(mockEventBus.publish).toHaveBeenCalledWith(mockDomainEvent);
  });
});
