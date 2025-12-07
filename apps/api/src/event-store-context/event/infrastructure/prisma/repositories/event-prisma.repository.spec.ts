import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/event/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/event/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { EventPrismaDto } from '@/event-store-context/event/infrastructure/prisma/dtos/event-prisma.dto';
import { EventPrismaMapper } from '@/event-store-context/event/infrastructure/prisma/mappers/event-prisma.mapper';
import { EventPrismaRepository } from '@/event-store-context/event/infrastructure/prisma/repositories/event-prisma.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

describe('EventPrismaRepository', () => {
  let repository: EventPrismaRepository;
  let mockPrismaService: any;
  let mockEventPrismaMapper: jest.Mocked<EventPrismaMapper>;
  let mockFindUnique: jest.Mock;
  let mockFindMany: jest.Mock;
  let mockUpsert: jest.Mock;
  let mockDelete: jest.Mock;

  const prismaEvent: EventPrismaDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    eventType: 'UserCreatedEvent',
    aggregateType: 'UserAggregate',
    aggregateId: '123e4567-e89b-12d3-a456-426614174001',
    payload: { foo: 'bar' },
    timestamp: new Date('2024-01-01T10:00:00Z'),
    createdAt: new Date('2024-01-02T12:00:00Z'),
    updatedAt: new Date('2024-01-02T12:00:00Z'),
  };

  const eventAggregate = new EventAggregate(
    {
      id: new EventUuidValueObject(prismaEvent.id),
      aggregateId: new EventAggregateIdValueObject(prismaEvent.aggregateId),
      aggregateType: new EventAggregateTypeValueObject(
        prismaEvent.aggregateType,
      ),
      eventType: new EventTypeValueObject(prismaEvent.eventType),
      payload: new EventPayloadValueObject(prismaEvent.payload),
      timestamp: new EventTimestampValueObject(prismaEvent.timestamp),
      createdAt: new DateValueObject(prismaEvent.createdAt),
      updatedAt: new DateValueObject(prismaEvent.updatedAt),
    },
    false,
  );

  beforeEach(() => {
    mockFindUnique = jest.fn();
    mockFindMany = jest.fn();
    mockUpsert = jest.fn();
    mockDelete = jest.fn();

    mockPrismaService = {
      client: {
        event: {
          findUnique: mockFindUnique,
          findMany: mockFindMany,
          upsert: mockUpsert,
          delete: mockDelete,
        },
      },
    };

    mockEventPrismaMapper = {
      toDomainEntity: jest.fn(),
      toPrismaData: jest.fn(),
    } as unknown as jest.Mocked<EventPrismaMapper>;

    repository = new EventPrismaRepository(
      mockPrismaService,
      mockEventPrismaMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return domain aggregate when event exists', async () => {
      mockFindUnique.mockResolvedValue(prismaEvent);
      mockEventPrismaMapper.toDomainEntity.mockReturnValue(eventAggregate);

      const result = await repository.findById(prismaEvent.id);

      expect(result).toBe(eventAggregate);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: prismaEvent.id },
      });
      expect(mockEventPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaEvent,
      );
    });

    it('should return null when event does not exist', async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await repository.findById(prismaEvent.id);

      expect(result).toBeNull();
      expect(mockEventPrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findByCriteria', () => {
    it('should query prisma with filters and return mapped aggregates', async () => {
      const filters = {
        id: prismaEvent.id,
        eventType: prismaEvent.eventType,
        aggregateType: prismaEvent.aggregateType,
        aggregateId: prismaEvent.aggregateId,
        from: new Date('2024-01-01T00:00:00Z'),
        to: new Date('2024-01-31T23:59:59Z'),
        pagination: { page: 5, perPage: 10 },
      };

      mockFindMany.mockResolvedValue([prismaEvent]);
      mockEventPrismaMapper.toDomainEntity.mockReturnValue(eventAggregate);

      const result = await repository.findByCriteria(filters);

      expect(result).toEqual([eventAggregate]);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: {
          eventType: filters.eventType,
          aggregateId: filters.aggregateId,
          aggregateType: filters.aggregateType,
          timestamp: {
            gte: filters.from,
            lte: filters.to,
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
        take: filters.pagination?.perPage,
        skip: filters.pagination?.page,
      });
      expect(mockEventPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaEvent,
      );
    });
  });

  describe('save', () => {
    it('should upsert event and return mapped aggregate', async () => {
      mockEventPrismaMapper.toPrismaData.mockReturnValue(prismaEvent);
      mockUpsert.mockResolvedValue(prismaEvent);
      mockEventPrismaMapper.toDomainEntity.mockReturnValue(eventAggregate);

      const result = await repository.save(eventAggregate);

      expect(result).toBe(eventAggregate);
      expect(mockEventPrismaMapper.toPrismaData).toHaveBeenCalledWith(
        eventAggregate,
      );
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: eventAggregate.id.value },
        update: prismaEvent,
        create: prismaEvent,
      });
      expect(mockEventPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaEvent,
      );
    });
  });

  describe('delete', () => {
    it('should delete event and return true', async () => {
      mockDelete.mockResolvedValue(prismaEvent);

      const result = await repository.delete(prismaEvent.id);

      expect(result).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: prismaEvent.id },
      });
    });

    it('should propagate errors from prisma delete', async () => {
      const error = new Error('Delete failed');
      mockDelete.mockRejectedValue(error);

      await expect(repository.delete(prismaEvent.id)).rejects.toThrow(error);
    });
  });
});
