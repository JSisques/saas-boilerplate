import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { IEventFilterDto } from '@/event-store-context/event/domain/dtos/filters/event-filter.dto';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/event/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/event/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { EventTypeormEntity } from '@/event-store-context/event/infrastructure/database/typeorm/entities/event-typeorm.entity';
import { EventTypeormMapper } from '@/event-store-context/event/infrastructure/database/typeorm/mappers/event-typeorm.mapper';
import { EventTypeormRepository } from '@/event-store-context/event/infrastructure/database/typeorm/repositories/event-typeorm.repository';
import { Repository } from 'typeorm';

describe('EventTypeormRepository', () => {
  let repository: EventTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockEventTypeormMapper: jest.Mocked<EventTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<EventTypeormEntity>>;
  let mockFindOne: jest.Mock;
  let mockFind: jest.Mock;
  let mockSave: jest.Mock;
  let mockSoftDelete: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockFind = jest.fn();
    mockSave = jest.fn();
    mockSoftDelete = jest.fn();

    mockTypeormRepository = {
      findOne: mockFindOne,
      find: mockFind,
      save: mockSave,
      softDelete: mockSoftDelete,
    } as unknown as jest.Mocked<Repository<EventTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockEventTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<EventTypeormMapper>;

    repository = new EventTypeormRepository(
      mockTypeormMasterService,
      mockEventTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return event aggregate when event exists', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';
      const aggregateId = '876e4567-e89b-12d3-a456-426614174001';
      const now = new Date();
      const timestamp = new Date();

      const typeormEntity = new EventTypeormEntity();
      typeormEntity.id = eventId;
      typeormEntity.eventType = 'EventCreated';
      typeormEntity.aggregateType = 'UserAggregate';
      typeormEntity.aggregateId = aggregateId;
      typeormEntity.payload = { key: 'value' };
      typeormEntity.timestamp = timestamp;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const eventAggregate = new EventAggregate(
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

      mockFindOne.mockResolvedValue(typeormEntity);
      mockEventTypeormMapper.toDomainEntity.mockReturnValue(eventAggregate);

      const result = await repository.findById(eventId);

      expect(result).toBe(eventAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: eventId },
      });
      expect(mockEventTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockEventTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when event does not exist', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(eventId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: eventId },
      });
      expect(mockEventTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findByCriteria', () => {
    it('should return event aggregates when events match criteria', async () => {
      const aggregateId = '876e4567-e89b-12d3-a456-426614174001';
      const now = new Date();
      const timestamp = new Date();
      const from = new Date(timestamp.getTime() - 1000);
      const to = new Date(timestamp.getTime() + 1000);

      const filters: IEventFilterDto = {
        eventType: 'EventCreated',
        aggregateId: aggregateId,
        aggregateType: 'UserAggregate',
        from,
        to,
        pagination: {
          page: 1,
          perPage: 10,
        },
      };

      const typeormEntity = new EventTypeormEntity();
      typeormEntity.id = '123e4567-e89b-12d3-a456-426614174000';
      typeormEntity.eventType = 'EventCreated';
      typeormEntity.aggregateType = 'UserAggregate';
      typeormEntity.aggregateId = aggregateId;
      typeormEntity.payload = { key: 'value' };
      typeormEntity.timestamp = timestamp;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const eventAggregate = new EventAggregate(
        {
          id: new EventUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
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

      mockFind.mockResolvedValue([typeormEntity]);
      mockEventTypeormMapper.toDomainEntity.mockReturnValue(eventAggregate);

      const result = await repository.findByCriteria(filters);

      expect(result).toEqual([eventAggregate]);
      expect(mockFind).toHaveBeenCalled();
      expect(mockEventTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
    });

    it('should return empty array when no events match criteria', async () => {
      const filters: IEventFilterDto = {
        eventType: 'EventCreated',
        from: new Date(),
        to: new Date(),
      };

      mockFind.mockResolvedValue([]);

      const result = await repository.findByCriteria(filters);

      expect(result).toEqual([]);
      expect(mockFind).toHaveBeenCalled();
      expect(mockEventTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save event aggregate and return saved aggregate', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';
      const aggregateId = '876e4567-e89b-12d3-a456-426614174001';
      const now = new Date();
      const timestamp = new Date();

      const eventAggregate = new EventAggregate(
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

      const typeormEntity = new EventTypeormEntity();
      typeormEntity.id = eventId;
      typeormEntity.eventType = 'EventCreated';
      typeormEntity.aggregateType = 'UserAggregate';
      typeormEntity.aggregateId = aggregateId;
      typeormEntity.payload = { key: 'value' };
      typeormEntity.timestamp = timestamp;

      const savedTypeormEntity = new EventTypeormEntity();
      savedTypeormEntity.id = eventId;
      savedTypeormEntity.eventType = 'EventCreated';
      savedTypeormEntity.aggregateType = 'UserAggregate';
      savedTypeormEntity.aggregateId = aggregateId;
      savedTypeormEntity.payload = { key: 'value' };
      savedTypeormEntity.timestamp = timestamp;

      const savedEventAggregate = new EventAggregate(
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

      mockEventTypeormMapper.toTypeormEntity.mockReturnValue(typeormEntity);
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockEventTypeormMapper.toDomainEntity.mockReturnValue(
        savedEventAggregate,
      );

      const result = await repository.save(eventAggregate);

      expect(result).toBe(savedEventAggregate);
      expect(mockEventTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
        eventAggregate,
      );
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockEventTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
      expect(mockFindOne).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete event and return true', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(eventId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(eventId);
      expect(mockSoftDelete).toHaveBeenCalledTimes(1);
    });

    it('should return false when event does not exist', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(eventId);

      expect(result).toBe(false);
      expect(mockSoftDelete).toHaveBeenCalledWith(eventId);
    });

    it('should handle delete errors correctly', async () => {
      const eventId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Event not found');

      mockSoftDelete.mockRejectedValue(error);

      await expect(repository.delete(eventId)).rejects.toThrow(error);
      expect(mockSoftDelete).toHaveBeenCalledWith(eventId);
    });
  });
});
