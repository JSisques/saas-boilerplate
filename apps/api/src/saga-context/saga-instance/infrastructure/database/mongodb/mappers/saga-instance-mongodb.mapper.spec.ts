import { SagaInstanceViewModelFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-view-model/saga-instance-view-model.factory';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceMongoDbDto } from '@/saga-context/saga-instance/infrastructure/database/mongodb/dtos/saga-instance-mongodb.dto';
import { SagaInstanceMongoDBMapper } from '@/saga-context/saga-instance/infrastructure/database/mongodb/mappers/saga-instance-mongodb.mapper';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { Test } from '@nestjs/testing';

describe('SagaInstanceMongoDBMapper', () => {
  let mapper: SagaInstanceMongoDBMapper;
  let mockSagaInstanceViewModelFactory: jest.Mocked<SagaInstanceViewModelFactory>;

  beforeEach(async () => {
    mockSagaInstanceViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceViewModelFactory>;

    const module = await Test.createTestingModule({
      providers: [
        SagaInstanceMongoDBMapper,
        {
          provide: SagaInstanceViewModelFactory,
          useValue: mockSagaInstanceViewModelFactory,
        },
      ],
    }).compile();

    mapper = module.get<SagaInstanceMongoDBMapper>(SagaInstanceMongoDBMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const mongoDoc: SagaInstanceMongoDbDto = {
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      };

      const mockViewModel = new SagaInstanceViewModel({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      });

      mockSagaInstanceViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockSagaInstanceViewModelFactory.create).toHaveBeenCalledWith({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert MongoDB document to view model with null optional fields', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');

      const mongoDoc: SagaInstanceMongoDbDto = {
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: now,
        updatedAt: now,
      };

      const mockViewModel = new SagaInstanceViewModel({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: now,
        updatedAt: now,
      });

      mockSagaInstanceViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockSagaInstanceViewModelFactory.create).toHaveBeenCalledWith({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toMongoData', () => {
    it('should convert view model to MongoDB document with all properties', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const viewModel = new SagaInstanceViewModel({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert view model to MongoDB document with null optional fields', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');

      const viewModel = new SagaInstanceViewModel({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result.startDate).toBeNull();
      expect(result.endDate).toBeNull();
    });
  });
});
