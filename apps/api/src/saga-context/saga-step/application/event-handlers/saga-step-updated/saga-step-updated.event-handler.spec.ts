import { SagaStepUpdatedEventHandler } from '@/saga-context/saga-step/application/event-handlers/saga-step-updated/saga-step-updated.event-handler';
import { AssertSagaStepViewModelExsistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-view-model-exsits/assert-saga-step-view-model-exsits.service';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepUpdatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-updated/saga-step-updated.event';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { Test } from '@nestjs/testing';

describe('SagaStepUpdatedEventHandler', () => {
  let handler: SagaStepUpdatedEventHandler;
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
        SagaStepUpdatedEventHandler,
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

    handler = module.get<SagaStepUpdatedEventHandler>(
      SagaStepUpdatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save saga step view model when event is handled', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Name',
        order: 5,
        status: SagaStepStatusEnum.RUNNING,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: 2,
        maxRetries: 5,
        payload: { orderId: '12345' },
        result: {},
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      };

      const event = new SagaStepUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepUpdatedEvent',
        },
        eventData,
      );

      const existingViewModel = new SagaStepViewModel({
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Original Name',
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

      const updateSpy = jest.spyOn(existingViewModel, 'update');

      mockAssertSagaStepViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSagaStepReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertSagaStepViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(aggregateId);
      expect(
        mockAssertSagaStepViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(eventData);
      expect(mockSagaStepReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
      expect(mockSagaStepReadRepository.save).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });

    it('should update view model with partial data', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Name',
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
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      };

      const event = new SagaStepUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepUpdatedEvent',
        },
        eventData,
      );

      const existingViewModel = new SagaStepViewModel({
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Original Name',
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

      const updateSpy = jest.spyOn(existingViewModel, 'update');

      mockAssertSagaStepViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSagaStepReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(updateSpy).toHaveBeenCalledWith(eventData);
      expect(mockSagaStepReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );

      updateSpy.mockRestore();
    });
  });
});
