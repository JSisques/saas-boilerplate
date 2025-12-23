import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { EventAggregateFactory } from '@/event-store-context/event/domain/factories/event-aggregate/event-aggregate.factory';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/event/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/event/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { EventTypeormEntity } from '@/event-store-context/event/infrastructure/database/typeorm/entities/event-typeorm.entity';
import { EventTypeormMapper } from '@/event-store-context/event/infrastructure/database/typeorm/mappers/event-typeorm.mapper';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

describe('EventTypeormMapper', () => {
  let mapper: EventTypeormMapper;
  let mockEventAggregateFactory: jest.Mocked<EventAggregateFactory>;

  beforeEach(() => {
    mockEventAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<EventAggregateFactory>;

    mapper = new EventTypeormMapper(mockEventAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const timestamp = new Date();

      const aggregateId = '876e4567-e89b-12d3-a456-426614174001';
      const typeormEntity = new EventTypeormEntity();
      typeormEntity.id = eventId;
      typeormEntity.eventType = 'EventCreated';
      typeormEntity.aggregateType = 'UserAggregate';
      typeormEntity.aggregateId = aggregateId;
      typeormEntity.payload = { key: 'value' };
      typeormEntity.timestamp = timestamp;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockEventAggregate = new EventAggregate(
        {
          id: new EventUuidValueObject(eventId),
          eventType: new EventTypeValueObject('EventCreated'),
          aggregateType: new EventAggregateTypeValueObject('UserAggregate'),
          aggregateId: new EventAggregateIdValueObject(aggregateId),
          payload: new EventPayloadValueObject({ key: 'value' }),
          timestamp: new EventTimestampValueObject(timestamp),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockEventAggregateFactory.fromPrimitives.mockReturnValue(
        mockEventAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockEventAggregate);
      expect(mockEventAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: eventId,
        eventType: 'EventCreated',
        aggregateType: 'UserAggregate',
        aggregateId: aggregateId,
        payload: { key: 'value' },
        timestamp: timestamp,
        createdAt: now,
        updatedAt: now,
      });
      expect(mockEventAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(1);
    });

    it('should convert TypeORM entity with null payload', () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';
      const aggregateId = '876e4567-e89b-12d3-a456-426614174001';
      const now = new Date();
      const timestamp = new Date();

      const typeormEntity = new EventTypeormEntity();
      typeormEntity.id = eventId;
      typeormEntity.eventType = 'EventCreated';
      typeormEntity.aggregateType = 'UserAggregate';
      typeormEntity.aggregateId = aggregateId;
      typeormEntity.payload = null;
      typeormEntity.timestamp = timestamp;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockEventAggregate = new EventAggregate(
        {
          id: new EventUuidValueObject(eventId),
          eventType: new EventTypeValueObject('EventCreated'),
          aggregateType: new EventAggregateTypeValueObject('UserAggregate'),
          aggregateId: new EventAggregateIdValueObject(aggregateId),
          payload: new EventPayloadValueObject({}),
          timestamp: new EventTimestampValueObject(timestamp),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockEventAggregateFactory.fromPrimitives.mockReturnValue(
        mockEventAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockEventAggregate);
      expect(mockEventAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: eventId,
        eventType: 'EventCreated',
        aggregateType: 'UserAggregate',
        aggregateId: aggregateId,
        payload: {},
        timestamp: timestamp,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';
      const aggregateId = '876e4567-e89b-12d3-a456-426614174001';
      const now = new Date();
      const timestamp = new Date();

      const mockEventAggregate = new EventAggregate(
        {
          id: new EventUuidValueObject(eventId),
          eventType: new EventTypeValueObject('EventCreated'),
          aggregateType: new EventAggregateTypeValueObject('UserAggregate'),
          aggregateId: new EventAggregateIdValueObject(aggregateId),
          payload: new EventPayloadValueObject({ key: 'value' }),
          timestamp: new EventTimestampValueObject(timestamp),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockEventAggregate, 'toPrimitives')
        .mockReturnValue({
          id: eventId,
          eventType: 'EventCreated',
          aggregateType: 'UserAggregate',
          aggregateId: aggregateId,
          payload: { key: 'value' },
          timestamp: timestamp,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockEventAggregate);

      expect(result).toBeInstanceOf(EventTypeormEntity);
      expect(result.id).toBe(eventId);
      expect(result.eventType).toBe('EventCreated');
      expect(result.aggregateType).toBe('UserAggregate');
      expect(result.aggregateId).toBe(aggregateId);
      expect(result.payload).toEqual({ key: 'value' });
      expect(result.timestamp).toEqual(timestamp);
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });

    it('should convert domain entity with null payload', () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';
      const aggregateId = '876e4567-e89b-12d3-a456-426614174001';
      const now = new Date();
      const timestamp = new Date();

      const mockEventAggregate = new EventAggregate(
        {
          id: new EventUuidValueObject(eventId),
          eventType: new EventTypeValueObject('EventCreated'),
          aggregateType: new EventAggregateTypeValueObject('UserAggregate'),
          aggregateId: new EventAggregateIdValueObject(aggregateId),
          payload: new EventPayloadValueObject({}),
          timestamp: new EventTimestampValueObject(timestamp),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockEventAggregate, 'toPrimitives')
        .mockReturnValue({
          id: eventId,
          eventType: 'EventCreated',
          aggregateType: 'UserAggregate',
          aggregateId: aggregateId,
          payload: null,
          timestamp: timestamp,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockEventAggregate);

      expect(result).toBeInstanceOf(EventTypeormEntity);
      expect(result.id).toBe(eventId);
      expect(result.eventType).toBe('EventCreated');
      expect(result.aggregateType).toBe('UserAggregate');
      expect(result.aggregateId).toBe(aggregateId);
      expect(result.payload).toBeNull();
      expect(result.timestamp).toEqual(timestamp);
      expect(result.deletedAt).toBeNull();

      toPrimitivesSpy.mockRestore();
    });
  });
});
