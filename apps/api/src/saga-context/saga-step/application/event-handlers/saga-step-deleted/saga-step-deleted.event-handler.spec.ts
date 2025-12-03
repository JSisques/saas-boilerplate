import { SagaStepDeletedEventHandler } from '@/saga-context/saga-step/application/event-handlers/saga-step-deleted/saga-step-deleted.event-handler';
import { AssertSagaStepViewModelExsistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-view-model-exsits/assert-saga-step-view-model-exsits.service';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepDeletedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-deleted/saga-step-deleted.event';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { Test } from '@nestjs/testing';

describe('SagaStepDeletedEventHandler', () => {
  let handler: SagaStepDeletedEventHandler;
  let mockSagaStepReadRepository: jest.Mocked<SagaStepReadRepository>;
  let mockAssertSagaStepViewModelExsistsService: jest.Mocked<AssertSagaStepViewModelExsistsService>;

  beforeEach(async () => {
    mockSagaStepReadRepository = {
      findById: jest.fn(),
      findBySagaInstanceId: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaStepReadRepository>;

    mockAssertSagaStepViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaStepViewModelExsistsService>;

    const module = await Test.createTestingModule({
      providers: [
        SagaStepDeletedEventHandler,
        {
          provide: SAGA_STEP_READ_REPOSITORY_TOKEN,
          useValue: mockSagaStepReadRepository,
        },
        {
          provide: AssertSagaStepViewModelExsistsService,
          useValue: mockAssertSagaStepViewModelExsistsService,
        },
      ],
    }).compile();

    handler = module.get<SagaStepDeletedEventHandler>(
      SagaStepDeletedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete saga step view model when event is handled', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Test Step',
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
      };

      const event = new SagaStepDeletedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepDeletedEvent',
        },
        eventData,
      );

      const existingViewModel = new SagaStepViewModel({
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Test Step',
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

      mockAssertSagaStepViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSagaStepReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertSagaStepViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(aggregateId);
      expect(
        mockAssertSagaStepViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(mockSagaStepReadRepository.delete).toHaveBeenCalledWith(
        existingViewModel.id,
      );
      expect(mockSagaStepReadRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw error when view model does not exist', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Test Step',
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
      };

      const event = new SagaStepDeletedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepDeletedEvent',
        },
        eventData,
      );

      const error = new Error('Saga step view model not found');
      mockAssertSagaStepViewModelExsistsService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.handle(event)).rejects.toThrow(error);
      expect(
        mockAssertSagaStepViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(aggregateId);
      expect(mockSagaStepReadRepository.delete).not.toHaveBeenCalled();
    });
  });
});
