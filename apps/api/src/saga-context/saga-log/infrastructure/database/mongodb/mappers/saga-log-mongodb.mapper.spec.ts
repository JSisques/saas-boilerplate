import { SagaLogViewModelFactory } from '@/saga-context/saga-log/domain/factories/saga-log-view-model/saga-log-view-model.factory';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogMongoDbDto } from '@/saga-context/saga-log/infrastructure/database/mongodb/dtos/saga-log-mongodb.dto';
import { SagaLogMongoDBMapper } from '@/saga-context/saga-log/infrastructure/database/mongodb/mappers/saga-log-mongodb.mapper';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { Test } from '@nestjs/testing';

describe('SagaLogMongoDBMapper', () => {
  let mapper: SagaLogMongoDBMapper;
  let mockSagaLogViewModelFactory: jest.Mocked<SagaLogViewModelFactory>;

  beforeEach(async () => {
    mockSagaLogViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<SagaLogViewModelFactory>;

    const module = await Test.createTestingModule({
      providers: [
        SagaLogMongoDBMapper,
        {
          provide: SagaLogViewModelFactory,
          useValue: mockSagaLogViewModelFactory,
        },
      ],
    }).compile();

    mapper = module.get<SagaLogMongoDBMapper>(SagaLogMongoDBMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');

      const mongoData: SagaLogMongoDbDto = {
        id: sagaLogId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
        createdAt: now,
        updatedAt: now,
      };

      const mockViewModel = new SagaLogViewModel({
        id: sagaLogId,
        sagaInstanceId: mongoData.sagaInstanceId,
        sagaStepId: mongoData.sagaStepId,
        type: mongoData.type,
        message: mongoData.message,
        createdAt: now,
        updatedAt: now,
      });

      mockSagaLogViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoData);

      expect(result).toBe(mockViewModel);
      expect(mockSagaLogViewModelFactory.create).toHaveBeenCalledWith({
        id: sagaLogId,
        sagaInstanceId: mongoData.sagaInstanceId,
        sagaStepId: mongoData.sagaStepId,
        type: mongoData.type,
        message: mongoData.message,
        createdAt: now,
        updatedAt: now,
      });
      expect(mockSagaLogViewModelFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should convert MongoDB document with different log types', () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');
      const types = [
        SagaLogTypeEnum.INFO,
        SagaLogTypeEnum.WARNING,
        SagaLogTypeEnum.ERROR,
        SagaLogTypeEnum.DEBUG,
      ];

      types.forEach((type) => {
        const mongoData: SagaLogMongoDbDto = {
          id: sagaLogId,
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: type,
          message: `Test message for ${type}`,
          createdAt: now,
          updatedAt: now,
        };

        const mockViewModel = new SagaLogViewModel({
          id: sagaLogId,
          sagaInstanceId: mongoData.sagaInstanceId,
          sagaStepId: mongoData.sagaStepId,
          type: type,
          message: mongoData.message,
          createdAt: now,
          updatedAt: now,
        });

        mockSagaLogViewModelFactory.create.mockReturnValue(mockViewModel);

        const result = mapper.toViewModel(mongoData);

        expect(result).toBe(mockViewModel);
        expect(mockSagaLogViewModelFactory.create).toHaveBeenCalledWith({
          id: sagaLogId,
          sagaInstanceId: mongoData.sagaInstanceId,
          sagaStepId: mongoData.sagaStepId,
          type: type,
          message: mongoData.message,
          createdAt: now,
          updatedAt: now,
        });
      });
    });
  });

  describe('toMongoData', () => {
    it('should convert view model to MongoDB data with all properties', () => {
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

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: viewModel.id,
        sagaInstanceId: viewModel.sagaInstanceId,
        sagaStepId: viewModel.sagaStepId,
        type: viewModel.type,
        message: viewModel.message,
        createdAt: viewModel.createdAt,
        updatedAt: viewModel.updatedAt,
      });
    });

    it('should convert view model with different log types', () => {
      const now = new Date();
      const types = [
        SagaLogTypeEnum.INFO,
        SagaLogTypeEnum.WARNING,
        SagaLogTypeEnum.ERROR,
        SagaLogTypeEnum.DEBUG,
      ];

      types.forEach((type) => {
        const viewModel = new SagaLogViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: type,
          message: `Test message for ${type}`,
          createdAt: now,
          updatedAt: now,
        });

        const result = mapper.toMongoData(viewModel);

        expect(result.type).toBe(type);
        expect(result.message).toBe(`Test message for ${type}`);
      });
    });
  });
});
