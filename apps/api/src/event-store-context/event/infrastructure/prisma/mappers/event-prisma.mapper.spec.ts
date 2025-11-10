import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { EventAggregateFactory } from '@/event-store-context/event/domain/factories/event-aggregate.factory';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/event/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/event/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { EventPrismaDto } from '@/event-store-context/event/infrastructure/prisma/dtos/event-prisma.dto';
import { EventPrismaMapper } from '@/event-store-context/event/infrastructure/prisma/mappers/event-prisma.mapper';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

describe('EventPrismaMapper', () => {
  let mapper: EventPrismaMapper;
  let mockEventAggregateFactory: jest.Mocked<EventAggregateFactory>;

  const prismaData: EventPrismaDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    eventType: 'UserCreatedEvent',
    aggregateType: 'UserAggregate',
    aggregateId: '123e4567-e89b-12d3-a456-426614174001',
    payload: { foo: 'bar' },
    timestamp: new Date('2024-01-01T10:00:00Z'),
  };

  const aggregate = new EventAggregate(
    {
      id: new EventUuidValueObject(prismaData.id),
      aggregateId: new EventAggregateIdValueObject(prismaData.aggregateId),
      aggregateType: new EventAggregateTypeValueObject(
        prismaData.aggregateType,
      ),
      eventType: new EventTypeValueObject(prismaData.eventType),
      payload: new EventPayloadValueObject(prismaData.payload),
      timestamp: new EventTimestampValueObject(prismaData.timestamp),
    },
    false,
  );

  beforeEach(() => {
    mockEventAggregateFactory = {
      fromPrimitives: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<EventAggregateFactory>;
    mapper = new EventPrismaMapper(mockEventAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should convert prisma data to domain entity using factory', () => {
    mockEventAggregateFactory.fromPrimitives.mockReturnValue(aggregate);

    const result = mapper.toDomainEntity(prismaData);

    expect(result).toBe(aggregate);
    expect(mockEventAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
      id: prismaData.id,
      eventType: prismaData.eventType,
      aggregateType: prismaData.aggregateType,
      aggregateId: prismaData.aggregateId,
      payload: prismaData.payload,
      timestamp: prismaData.timestamp,
    });
  });

  it('should convert domain entity to prisma data', () => {
    const result = mapper.toPrismaData(aggregate);

    expect(result).toEqual({
      id: aggregate.id.value,
      eventType: aggregate.eventType.value,
      aggregateType: aggregate.aggregateType.value,
      aggregateId: aggregate.aggregateId.value,
      payload: aggregate.payload?.value ?? null,
      timestamp: aggregate.timestamp.value,
    });
  });
});
