import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogMongoDbDto } from '@/saga-context/saga-log/infrastructure/database/mongodb/dtos/saga-log-mongodb.dto';
import { SagaLogMongoDBMapper } from '@/saga-context/saga-log/infrastructure/database/mongodb/mappers/saga-log-mongodb.mapper';
import { SagaLogMongoRepository } from '@/saga-context/saga-log/infrastructure/database/mongodb/repositories/saga-log-mongodb.repository';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Collection } from 'mongodb';

describe('SagaLogMongoRepository', () => {
  let repository: SagaLogMongoRepository;
  let mockMongoMasterService: jest.Mocked<MongoMasterService>;
  let mockSagaLogMongoDBMapper: jest.Mocked<SagaLogMongoDBMapper>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn(),
      replaceOne: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    const mockFindCursor = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
    };

    mockCollection.find = jest.fn().mockReturnValue(mockFindCursor) as any;

    mockMongoMasterService = {
      getCollection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<MongoMasterService>;

    mockSagaLogMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<SagaLogMongoDBMapper>;

    repository = new SagaLogMongoRepository(
      mockMongoMasterService,
      mockSagaLogMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return saga log view model when saga log exists', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const mongoDoc: SagaLogMongoDbDto = {
        id: sagaLogId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const viewModel = new SagaLogViewModel({
        id: sagaLogId,
        sagaInstanceId: mongoDoc.sagaInstanceId,
        sagaStepId: mongoDoc.sagaStepId,
        type: mongoDoc.type,
        message: mongoDoc.message,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockSagaLogMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findById(sagaLogId);

      expect(result).toBe(viewModel);
      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'saga-logs',
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: sagaLogId });
      expect(mockSagaLogMongoDBMapper.toViewModel).toHaveBeenCalledWith({
        id: sagaLogId,
        sagaInstanceId: mongoDoc.sagaInstanceId,
        sagaStepId: mongoDoc.sagaStepId,
        type: mongoDoc.type,
        message: mongoDoc.message,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should return null when saga log does not exist', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(sagaLogId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: sagaLogId });
      expect(mockSagaLogMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });
  });

  describe('findBySagaInstanceId', () => {
    it('should return array of saga log view models when saga logs exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const mongoDocs: SagaLogMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: sagaInstanceId,
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.INFO,
          message: 'Log message 1',
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId: sagaInstanceId,
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.ERROR,
          message: 'Log message 2',
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new SagaLogViewModel({
            id: doc.id,
            sagaInstanceId: doc.sagaInstanceId,
            sagaStepId: doc.sagaStepId,
            type: doc.type,
            message: doc.message,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const mockFindCursor = {
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find = jest.fn().mockReturnValue(mockFindCursor) as any;
      mongoDocs.forEach((doc, index) => {
        mockSagaLogMongoDBMapper.toViewModel.mockReturnValueOnce(
          viewModels[index],
        );
      });

      const result = await repository.findBySagaInstanceId(sagaInstanceId);

      expect(result).toHaveLength(2);
      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'saga-logs',
      );
      expect(mockCollection.find).toHaveBeenCalledWith({ sagaInstanceId });
      expect(mockSagaLogMongoDBMapper.toViewModel).toHaveBeenCalledTimes(2);
    });
  });

  describe('findBySagaStepId', () => {
    it('should return array of saga log view models when saga logs exist', async () => {
      const sagaStepId = '323e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const mongoDocs: SagaLogMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: sagaStepId,
          type: SagaLogTypeEnum.INFO,
          message: 'Log message 1',
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new SagaLogViewModel({
            id: doc.id,
            sagaInstanceId: doc.sagaInstanceId,
            sagaStepId: doc.sagaStepId,
            type: doc.type,
            message: doc.message,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const mockFindCursor = {
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find = jest.fn().mockReturnValue(mockFindCursor) as any;
      mongoDocs.forEach((doc, index) => {
        mockSagaLogMongoDBMapper.toViewModel.mockReturnValueOnce(
          viewModels[index],
        );
      });

      const result = await repository.findBySagaStepId(sagaStepId);

      expect(result).toHaveLength(1);
      expect(mockCollection.find).toHaveBeenCalledWith({ sagaStepId });
      expect(mockSagaLogMongoDBMapper.toViewModel).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result with saga log view models', async () => {
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const mongoDocs: SagaLogMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.INFO,
          message: 'Log message 1',
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new SagaLogViewModel({
            id: doc.id,
            sagaInstanceId: doc.sagaInstanceId,
            sagaStepId: doc.sagaStepId,
            type: doc.type,
            message: doc.message,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const mockFindCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find = jest.fn().mockReturnValue(mockFindCursor) as any;
      mockCollection.countDocuments.mockResolvedValue(1);
      mongoDocs.forEach((doc, index) => {
        mockSagaLogMongoDBMapper.toViewModel.mockReturnValueOnce(
          viewModels[index],
        );
      });

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });
  });

  describe('save', () => {
    it('should save saga log view model', async () => {
      const now = new Date('2024-01-01T10:00:00Z');
      const viewModel = new SagaLogViewModel({
        id: '123e4567-e89b-12d3-a456-426614174000',
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
        createdAt: now,
        updatedAt: now,
      });

      const mongoData: SagaLogMongoDbDto = {
        id: viewModel.id,
        sagaInstanceId: viewModel.sagaInstanceId,
        sagaStepId: viewModel.sagaStepId,
        type: viewModel.type,
        message: viewModel.message,
        createdAt: viewModel.createdAt,
        updatedAt: viewModel.updatedAt,
      };

      mockSagaLogMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({} as any);

      await repository.save(viewModel);

      expect(mockSagaLogMongoDBMapper.toMongoData).toHaveBeenCalledWith(
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
    it('should delete saga log view model by id', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 } as any);

      const result = await repository.delete(sagaLogId);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: sagaLogId });
    });
  });
});
