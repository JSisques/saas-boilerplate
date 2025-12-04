import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceMongoDbDto } from '@/saga-context/saga-instance/infrastructure/database/mongodb/dtos/saga-instance-mongodb.dto';
import { SagaInstanceMongoDBMapper } from '@/saga-context/saga-instance/infrastructure/database/mongodb/mappers/saga-instance-mongodb.mapper';
import { SagaInstanceMongoRepository } from '@/saga-context/saga-instance/infrastructure/database/mongodb/repositories/saga-instance-mongodb.repository';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Collection } from 'mongodb';

describe('SagaInstanceMongoRepository', () => {
  let repository: SagaInstanceMongoRepository;
  let mockMongoMasterService: jest.Mocked<MongoMasterService>;
  let mockSagaInstanceMongoDBMapper: jest.Mocked<SagaInstanceMongoDBMapper>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn(),
      replaceOne: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    mockMongoMasterService = {
      getCollection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<MongoMasterService>;

    mockSagaInstanceMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceMongoDBMapper>;

    repository = new SagaInstanceMongoRepository(
      mockMongoMasterService,
      mockSagaInstanceMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return saga instance view model when saga instance exists', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const mongoDoc: SagaInstanceMongoDbDto = {
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const viewModel = new SagaInstanceViewModel({
        id: sagaInstanceId,
        name: mongoDoc.name,
        status: mongoDoc.status,
        startDate: mongoDoc.startDate,
        endDate: mongoDoc.endDate,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockSagaInstanceMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findById(sagaInstanceId);

      expect(result).toBe(viewModel);
      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'saga-instances',
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: sagaInstanceId,
      });
      expect(mockSagaInstanceMongoDBMapper.toViewModel).toHaveBeenCalledWith({
        id: sagaInstanceId,
        name: mongoDoc.name,
        status: mongoDoc.status,
        startDate: mongoDoc.startDate,
        endDate: mongoDoc.endDate,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should return null when saga instance does not exist', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(sagaInstanceId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        id: sagaInstanceId,
      });
      expect(mockSagaInstanceMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result of saga instance view models', async () => {
      const criteria = new Criteria();
      criteria.pagination.page = 1;
      criteria.pagination.perPage = 10;
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');

      const mongoDocs: SagaInstanceMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Order Processing Saga',
          status: SagaInstanceStatusEnum.PENDING,
          startDate: null,
          endDate: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Payment Processing Saga',
          status: SagaInstanceStatusEnum.COMPLETED,
          startDate: new Date('2024-01-01T10:00:00Z'),
          endDate: new Date('2024-01-01T11:00:00Z'),
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new SagaInstanceViewModel({
            id: doc.id,
            name: doc.name,
            status: doc.status,
            startDate: doc.startDate,
            endDate: doc.endDate,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(2);
      mockSagaInstanceMongoDBMapper.toViewModel.mockImplementation((doc) => {
        const found = mongoDocs.find((d) => d.id === doc.id);
        return found
          ? new SagaInstanceViewModel({
              id: found.id,
              name: found.name,
              status: found.status,
              startDate: found.startDate,
              endDate: found.endDate,
              createdAt: found.createdAt,
              updatedAt: found.updatedAt,
            })
          : viewModels[0];
      });

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockCollection.countDocuments).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save saga instance view model', async () => {
      const viewModel = new SagaInstanceViewModel({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      const mongoData: SagaInstanceMongoDbDto = {
        id: viewModel.id,
        name: viewModel.name,
        status: viewModel.status,
        startDate: viewModel.startDate,
        endDate: viewModel.endDate,
        createdAt: viewModel.createdAt,
        updatedAt: viewModel.updatedAt,
      };

      mockSagaInstanceMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      } as any);

      await repository.save(viewModel);

      expect(mockSagaInstanceMongoDBMapper.toMongoData).toHaveBeenCalledWith(
        viewModel,
      );
      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: viewModel.id },
        mongoData,
        { upsert: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete saga instance view model by id', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      } as any);

      const result = await repository.delete(sagaInstanceId);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        id: sagaInstanceId,
      });
    });
  });
});
