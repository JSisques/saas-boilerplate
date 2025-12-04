import { SagaStepViewModelFactory } from '@/saga-context/saga-step/domain/factories/saga-step-view-model/saga-step-view-model.factory';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepMongoDBMapper } from '@/saga-context/saga-step/infrastructure/database/mongodb/mappers/saga-step-mongodb.mapper';
import { SagaStepMongoDbDto } from '@/saga-context/saga-step/infrastructure/database/mongodb/dtos/saga-step-mongodb.dto';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { Test } from '@nestjs/testing';

describe('SagaStepMongoDBMapper', () => {
  let mapper: SagaStepMongoDBMapper;
  let mockSagaStepViewModelFactory: jest.Mocked<SagaStepViewModelFactory>;

  beforeEach(async () => {
    mockSagaStepViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<SagaStepViewModelFactory>;

    const module = await Test.createTestingModule({
      providers: [
        SagaStepMongoDBMapper,
        {
          provide: SagaStepViewModelFactory,
          useValue: mockSagaStepViewModelFactory,
        },
      ],
    }).compile();

    mapper = module.get<SagaStepMongoDBMapper>(SagaStepMongoDBMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const mongoDoc: SagaStepMongoDbDto = {
        id: sagaStepId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        errorMessage: null,
        retryCount: 2,
        maxRetries: 5,
        payload: { orderId: '12345' },
        result: { success: true },
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const mockViewModel = new SagaStepViewModel({
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

      mockSagaStepViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockSagaStepViewModelFactory.create).toHaveBeenCalledWith({
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
      expect(mockSagaStepViewModelFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should convert MongoDB document to view model with null optional properties', () => {
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

      const mockViewModel = new SagaStepViewModel({
        id: sagaStepId,
        sagaInstanceId: mongoDoc.sagaInstanceId,
        name: mongoDoc.name,
        order: mongoDoc.order,
        status: mongoDoc.status,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: mongoDoc.retryCount,
        maxRetries: mongoDoc.maxRetries,
        payload: mongoDoc.payload,
        result: mongoDoc.result,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      mockSagaStepViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockSagaStepViewModelFactory.create).toHaveBeenCalledWith({
        id: sagaStepId,
        sagaInstanceId: mongoDoc.sagaInstanceId,
        name: mongoDoc.name,
        order: mongoDoc.order,
        status: mongoDoc.status,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: mongoDoc.retryCount,
        maxRetries: mongoDoc.maxRetries,
        payload: mongoDoc.payload,
        result: mongoDoc.result,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should convert MongoDB document with failed status and error message', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const mongoDoc: SagaStepMongoDbDto = {
        id: sagaStepId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.FAILED,
        startDate: startDate,
        endDate: endDate,
        errorMessage: 'Payment processing failed',
        retryCount: 3,
        maxRetries: 3,
        payload: { orderId: '12345' },
        result: {},
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const mockViewModel = new SagaStepViewModel({
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

      mockSagaStepViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockSagaStepViewModelFactory.create).toHaveBeenCalledWith({
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
  });

  describe('toMongoData', () => {
    it('should convert view model to MongoDB data with all properties', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const viewModel = new SagaStepViewModel({
        id: sagaStepId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        errorMessage: null,
        retryCount: 2,
        maxRetries: 5,
        payload: { orderId: '12345' },
        result: { success: true },
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
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
      });
    });

    it('should convert view model to MongoDB data with null optional properties', () => {
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

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: sagaStepId,
        sagaInstanceId: viewModel.sagaInstanceId,
        name: viewModel.name,
        order: viewModel.order,
        status: viewModel.status,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: viewModel.retryCount,
        maxRetries: viewModel.maxRetries,
        payload: viewModel.payload,
        result: viewModel.result,
        createdAt: viewModel.createdAt,
        updatedAt: viewModel.updatedAt,
      });
    });

    it('should convert view model with complex payload and result', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');

      const complexPayload = {
        orderId: '12345',
        userId: '67890',
        items: [{ id: 1, quantity: 2 }],
      };
      const complexResult = {
        success: true,
        transactionId: 'tx-12345',
        data: { processed: true },
      };

      const viewModel = new SagaStepViewModel({
        id: sagaStepId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.COMPLETED,
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: complexPayload,
        result: complexResult,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result.payload).toEqual(complexPayload);
      expect(result.result).toEqual(complexResult);
    });
  });
});
