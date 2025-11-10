import { EventMongoMapper } from '@/event-store-context/event/infrastructure/mongodb/mappers/event-mongodb.mapper';
import { EventMongoRepository } from '@/event-store-context/event/infrastructure/mongodb/repositories/event-mongodb.repository';
import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import { Criteria, Pagination, Sort } from '@/shared/domain/entities/criteria';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('EventMongoRepository', () => {
  let repository: EventMongoRepository;
  let mockMongoService: any;
  let mockEventMongoMapper: jest.Mocked<EventMongoMapper>;
  let mockCollection: any;

  const mongoDoc = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    eventType: 'UserCreatedEvent',
    aggregateType: 'UserAggregate',
    aggregateId: '123e4567-e89b-12d3-a456-426614174001',
    payload: { foo: 'bar' },
    timestamp: new Date('2024-01-01T10:00:00Z'),
    createdAt: new Date('2024-01-02T12:00:00Z'),
    updatedAt: new Date('2024-01-03T15:00:00Z'),
  };

  const eventViewModel = new EventViewModel({
    id: mongoDoc.id,
    eventType: mongoDoc.eventType,
    aggregateType: mongoDoc.aggregateType,
    aggregateId: mongoDoc.aggregateId,
    payload: mongoDoc.payload,
    timestamp: mongoDoc.timestamp,
    createdAt: mongoDoc.createdAt,
    updatedAt: mongoDoc.updatedAt,
  });

  beforeEach(() => {
    const cursorMock = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([mongoDoc]),
    };

    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn().mockReturnValue(cursorMock),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn().mockResolvedValue(1),
      cursorMock,
    };

    mockMongoService = {
      getCollection: jest.fn().mockReturnValue(mockCollection),
    };

    mockEventMongoMapper = {
      toViewModel: jest.fn().mockReturnValue(eventViewModel),
      toMongoData: jest.fn().mockReturnValue(mongoDoc),
    } as unknown as jest.Mocked<EventMongoMapper>;

    repository = new EventMongoRepository(
      mockMongoService,
      mockEventMongoMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return view model when document exists', async () => {
      mockCollection.findOne.mockResolvedValue(mongoDoc);

      const result = await repository.findById(mongoDoc.id);

      expect(result).toBe(eventViewModel);
      expect(mockMongoService.getCollection).toHaveBeenCalledWith('events');
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: mongoDoc.id });
      expect(mockEventMongoMapper.toViewModel).toHaveBeenCalledWith({
        id: mongoDoc.id,
        eventType: mongoDoc.eventType,
        aggregateType: mongoDoc.aggregateType,
        aggregateId: mongoDoc.aggregateId,
        payload: mongoDoc.payload,
        timestamp: mongoDoc.timestamp,
        createdAt: mongoDoc.createdAt,
        updatedAt: mongoDoc.updatedAt,
      });
    });

    it('should return null when document does not exist', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(mongoDoc.id);

      expect(result).toBeNull();
      expect(mockEventMongoMapper.toViewModel).not.toHaveBeenCalled();
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result mapped to view models', async () => {
      const filters = [
        {
          field: 'eventType',
          operator: FilterOperator.EQUALS,
          value: 'UserCreatedEvent',
        },
      ];
      const sorts: Sort[] = [
        {
          field: 'timestamp',
          direction: SortDirection.ASC,
        },
      ];
      const pagination: Pagination = { page: 2, perPage: 5 };
      const criteria = new Criteria(filters, sorts, pagination);

      mockEventMongoMapper.toViewModel.mockReturnValue(eventViewModel);

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toEqual([eventViewModel]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(2);
      expect(result.perPage).toBe(5);
      expect(mockCollection.find).toHaveBeenCalledWith({
        eventType: 'UserCreatedEvent',
      });
      expect(mockCollection.cursorMock.sort).toHaveBeenCalledWith({
        timestamp: 1,
      });
      expect(mockCollection.cursorMock.skip).toHaveBeenCalledWith(5);
      expect(mockCollection.cursorMock.limit).toHaveBeenCalledWith(5);
      expect(mockEventMongoMapper.toViewModel).toHaveBeenCalledWith({
        id: mongoDoc.id,
        eventType: mongoDoc.eventType,
        aggregateType: mongoDoc.aggregateType,
        aggregateId: mongoDoc.aggregateId,
        payload: mongoDoc.payload,
        timestamp: mongoDoc.timestamp,
        createdAt: mongoDoc.createdAt,
        updatedAt: mongoDoc.updatedAt,
      });
    });
  });

  describe('save', () => {
    it('should upsert document with mapper output', async () => {
      await repository.save(eventViewModel);

      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { id: mongoDoc.id },
        {
          $set: {
            eventType: mongoDoc.eventType,
            aggregateType: mongoDoc.aggregateType,
            aggregateId: mongoDoc.aggregateId,
            payload: mongoDoc.payload,
            timestamp: mongoDoc.timestamp,
            updatedAt: expect.any(Date),
          },
          $setOnInsert: {
            id: mongoDoc.id,
            createdAt: mongoDoc.createdAt ?? expect.any(Date),
          },
        },
        { upsert: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete document by id', async () => {
      const result = await repository.delete(mongoDoc.id);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        id: mongoDoc.id,
      });
    });
  });
});
