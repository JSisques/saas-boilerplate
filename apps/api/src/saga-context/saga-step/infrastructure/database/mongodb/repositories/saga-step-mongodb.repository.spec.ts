import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepMongoDbDto } from '@/saga-context/saga-step/infrastructure/database/mongodb/dtos/saga-step-mongodb.dto';
import { SagaStepMongoDBMapper } from '@/saga-context/saga-step/infrastructure/database/mongodb/mappers/saga-step-mongodb.mapper';
import { SagaStepMongoRepository } from '@/saga-context/saga-step/infrastructure/database/mongodb/repositories/saga-step-mongodb.repository';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Collection } from 'mongodb';

describe('SagaStepMongoRepository', () => {
  let repository: SagaStepMongoRepository;
  let mockMongoMasterService: jest.Mocked<MongoMasterService>;
  let mockSagaStepMongoDBMapper: jest.Mocked<SagaStepMongoDBMapper>;
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

    mockSagaStepMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<SagaStepMongoDBMapper>;

    repository = new SagaStepMongoRepository(
      mockMongoMasterService,
      mockSagaStepMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return saga step view model when saga step exists', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const mongoDoc: SagaStepMongoDbDto = {
        id: sagaStepId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: {},
        result: {},
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const viewModel = new SagaStepViewModel({
        id: sagaStepId,
        sagaInstanceId: mongoDoc.sagaInstanceId,
        name: mongoDoc.name,
        order: mongoDoc.order,
        status: mongoDoc.status,
        startDate: mongoDoc.startDate,
        endDate: mongoDoc.endDate,
        errorMessage: mongoDoc.errorMessage,
        retryCount: mongoDoc.retryCount,
        maxRetries: mongoDoc.maxRetries,
        payload: mongoDoc.payload,
        result: mongoDoc.result,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockSagaStepMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findById(sagaStepId);

      expect(result).toBe(viewModel);
      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'saga-steps',
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: sagaStepId });
      expect(mockSagaStepMongoDBMapper.toViewModel).toHaveBeenCalledWith({
        id: sagaStepId,
        sagaInstanceId: mongoDoc.sagaInstanceId,
        name: mongoDoc.name,
        order: mongoDoc.order,
        status: mongoDoc.status,
        startDate: mongoDoc.startDate,
        endDate: mongoDoc.endDate,
        errorMessage: mongoDoc.errorMessage,
        retryCount: mongoDoc.retryCount,
        maxRetries: mongoDoc.maxRetries,
        payload: mongoDoc.payload,
        result: mongoDoc.result,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should return null when saga step does not exist', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(sagaStepId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: sagaStepId });
      expect(mockSagaStepMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });
  });

  describe('findBySagaInstanceId', () => {
    it('should return array of saga step view models when saga steps exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const mongoDocs: SagaStepMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: sagaInstanceId,
          name: 'Process Payment',
          order: 1,
          status: SagaStepStatusEnum.PENDING,
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          payload: {},
          result: {},
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
        {
          id: '323e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId: sagaInstanceId,
          name: 'Send Email',
          order: 2,
          status: SagaStepStatusEnum.COMPLETED,
          startDate: new Date('2024-01-01T10:00:00Z'),
          endDate: new Date('2024-01-01T11:00:00Z'),
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          payload: {},
          result: {},
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new SagaStepViewModel({
            id: doc.id,
            sagaInstanceId: doc.sagaInstanceId,
            name: doc.name,
            order: doc.order,
            status: doc.status,
            startDate: doc.startDate,
            endDate: doc.endDate,
            errorMessage: doc.errorMessage,
            retryCount: doc.retryCount,
            maxRetries: doc.maxRetries,
            payload: doc.payload,
            result: doc.result,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const findMock = jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      });
      mockCollection.find = findMock;
      mockSagaStepMongoDBMapper.toViewModel
        .mockReturnValueOnce(viewModels[0])
        .mockReturnValueOnce(viewModels[1]);

      const result = await repository.findBySagaInstanceId(sagaInstanceId);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe(viewModels[0]);
      expect(result[1]).toBe(viewModels[1]);
      expect(mockCollection.find).toHaveBeenCalledWith({
        sagaInstanceId: sagaInstanceId,
      });
      expect(mockSagaStepMongoDBMapper.toViewModel).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no saga steps exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';

      const findMock = jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([]),
      });
      mockCollection.find = findMock;

      const result = await repository.findBySagaInstanceId(sagaInstanceId);

      expect(result).toEqual([]);
      expect(mockCollection.find).toHaveBeenCalledWith({
        sagaInstanceId: sagaInstanceId,
      });
      expect(mockSagaStepMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result with saga steps when criteria matches', async () => {
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mongoDocs: SagaStepMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          name: 'Process Payment',
          order: 1,
          status: SagaStepStatusEnum.PENDING,
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          payload: {},
          result: {},
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new SagaStepViewModel({
            id: doc.id,
            sagaInstanceId: doc.sagaInstanceId,
            name: doc.name,
            order: doc.order,
            status: doc.status,
            startDate: doc.startDate,
            endDate: doc.endDate,
            errorMessage: doc.errorMessage,
            retryCount: doc.retryCount,
            maxRetries: doc.maxRetries,
            payload: doc.payload,
            result: doc.result,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const sortMock = jest.fn().mockReturnThis();
      const skipMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockReturnThis();
      const toArrayMock = jest.fn().mockResolvedValue(mongoDocs);
      const findMock = jest.fn().mockReturnValue({
        sort: sortMock,
      });
      sortMock.mockReturnValue({
        skip: skipMock,
      });
      skipMock.mockReturnValue({
        limit: limitMock,
      });
      limitMock.mockReturnValue({
        toArray: toArrayMock,
      });

      mockCollection.find = findMock;
      mockCollection.countDocuments.mockResolvedValue(1);
      mockSagaStepMongoDBMapper.toViewModel.mockReturnValue(viewModels[0]);

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockSagaStepMongoDBMapper.toViewModel).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    it('should save saga step view model using upsert', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');

      const viewModel = new SagaStepViewModel({
        id: sagaStepId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: {},
        result: {},
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const mongoData: SagaStepMongoDbDto = {
        id: sagaStepId,
        sagaInstanceId: viewModel.sagaInstanceId,
        name: viewModel.name,
        order: viewModel.order,
        status: viewModel.status,
        startDate: viewModel.startDate,
        endDate: viewModel.endDate,
        errorMessage: viewModel.errorMessage,
        retryCount: viewModel.retryCount,
        maxRetries: viewModel.maxRetries,
        payload: viewModel.payload,
        result: viewModel.result,
        createdAt: viewModel.createdAt,
        updatedAt: viewModel.updatedAt,
      };

      mockSagaStepMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      } as any);

      await repository.save(viewModel);

      expect(mockSagaStepMongoDBMapper.toMongoData).toHaveBeenCalledWith(
        viewModel,
      );
      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: sagaStepId },
        mongoData,
        { upsert: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete saga step view model by id', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      } as any);

      const result = await repository.delete(sagaStepId);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: sagaStepId });
    });
  });
});
