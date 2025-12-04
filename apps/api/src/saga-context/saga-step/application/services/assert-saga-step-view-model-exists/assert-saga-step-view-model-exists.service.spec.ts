import { SagaStepNotFoundException } from '@/saga-context/saga-step/application/exceptions/saga-step-not-found/saga-step-not-found.exception';
import { AssertSagaStepViewModelExistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-view-model-exists/assert-saga-step-view-model-exists.service';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { Test } from '@nestjs/testing';

describe('AssertSagaStepViewModelExistsService', () => {
  let service: AssertSagaStepViewModelExistsService;
  let mockSagaStepReadRepository: jest.Mocked<SagaStepReadRepository>;

  beforeEach(async () => {
    mockSagaStepReadRepository = {
      findById: jest.fn(),
      findBySagaInstanceId: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaStepReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        AssertSagaStepViewModelExistsService,
        {
          provide: SAGA_STEP_READ_REPOSITORY_TOKEN,
          useValue: mockSagaStepReadRepository,
        },
      ],
    }).compile();

    service = module.get<AssertSagaStepViewModelExistsService>(
      AssertSagaStepViewModelExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return saga step view model when it exists', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const existingViewModel = new SagaStepViewModel({
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
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      mockSagaStepReadRepository.findById.mockResolvedValue(existingViewModel);

      const result = await service.execute(sagaStepId);

      expect(result).toBe(existingViewModel);
      expect(mockSagaStepReadRepository.findById).toHaveBeenCalledWith(
        sagaStepId,
      );
      expect(mockSagaStepReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw SagaStepNotFoundException when saga step view model does not exist', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      mockSagaStepReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(sagaStepId)).rejects.toThrow(
        SagaStepNotFoundException,
      );
      expect(mockSagaStepReadRepository.findById).toHaveBeenCalledWith(
        sagaStepId,
      );
    });

    it('should throw SagaStepNotFoundException with correct message', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      mockSagaStepReadRepository.findById.mockResolvedValue(null);

      try {
        await service.execute(sagaStepId);
        fail('Should have thrown SagaStepNotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(SagaStepNotFoundException);
        expect(error.message).toContain(sagaStepId);
      }
    });

    it('should return view model with all fields populated', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const existingViewModel = new SagaStepViewModel({
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
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      });

      mockSagaStepReadRepository.findById.mockResolvedValue(existingViewModel);

      const result = await service.execute(sagaStepId);

      expect(result.id).toBe(sagaStepId);
      expect(result.name).toBe('Process Payment');
      expect(result.status).toBe(SagaStepStatusEnum.COMPLETED);
      expect(result.startDate).toEqual(startDate);
      expect(result.endDate).toEqual(endDate);
      expect(result.retryCount).toBe(2);
      expect(result.maxRetries).toBe(5);
      expect(result.payload).toEqual({ orderId: '12345' });
      expect(result.result).toEqual({ success: true });
    });
  });
});
