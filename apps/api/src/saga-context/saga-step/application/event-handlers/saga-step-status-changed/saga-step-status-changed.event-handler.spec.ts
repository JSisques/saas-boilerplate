import { SagaStepStatusChangedEventHandler } from '@/saga-context/saga-step/application/event-handlers/saga-step-status-changed/saga-step-status-changed.event-handler';
import { AssertSagaStepViewModelExistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-view-model-exists/assert-saga-step-view-model-exists.service';
import { SagaStepViewModelFactory } from '@/saga-context/saga-step/domain/factories/saga-step-view-model/saga-step-view-model.factory';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-status-changed/saga-step-status-changed.event';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { Test } from '@nestjs/testing';

describe('SagaStepStatusChangedEventHandler', () => {
  let handler: SagaStepStatusChangedEventHandler;
  let mockSagaStepReadRepository: jest.Mocked<SagaStepReadRepository>;
  let mockSagaStepViewModelFactory: jest.Mocked<SagaStepViewModelFactory>;
  let mockAssertSagaStepViewModelExistsService: jest.Mocked<AssertSagaStepViewModelExistsService>;

  beforeEach(async () => {
    mockSagaStepReadRepository = {
      findById: jest.fn(),
      findBySagaInstanceId: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaStepReadRepository>;

    mockSagaStepViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<SagaStepViewModelFactory>;

    mockAssertSagaStepViewModelExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaStepViewModelExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        SagaStepStatusChangedEventHandler,
        {
          provide: SAGA_STEP_READ_REPOSITORY_TOKEN,
          useValue: mockSagaStepReadRepository,
        },
        {
          provide: SagaStepViewModelFactory,
          useValue: mockSagaStepViewModelFactory,
        },
        {
          provide: AssertSagaStepViewModelExistsService,
          useValue: mockAssertSagaStepViewModelExistsService,
        },
      ],
    }).compile();

    handler = module.get<SagaStepStatusChangedEventHandler>(
      SagaStepStatusChangedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update saga step view model status when event is handled', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const eventData = {
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Test Step',
        order: 1,
        status: SagaStepStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: {},
        result: {},
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      };

      const event = new SagaStepStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepStatusChangedEvent',
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

      const updateSpy = jest.spyOn(existingViewModel, 'update');

      mockAssertSagaStepViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSagaStepReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertSagaStepViewModelExistsService.execute,
      ).toHaveBeenCalledWith(aggregateId);
      expect(updateSpy).toHaveBeenCalledWith({
        status: eventData.status,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        errorMessage: eventData.errorMessage,
      });
      expect(mockSagaStepReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
      expect(mockSagaStepReadRepository.save).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });

    it('should update view model with failed status and error message', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const eventData = {
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Test Step',
        order: 1,
        status: SagaStepStatusEnum.FAILED,
        startDate: startDate,
        endDate: endDate,
        errorMessage: 'Payment processing failed',
        retryCount: 0,
        maxRetries: 3,
        payload: {},
        result: {},
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      };

      const event = new SagaStepStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepStatusChangedEvent',
        },
        eventData,
      );

      const existingViewModel = new SagaStepViewModel({
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Test Step',
        order: 1,
        status: SagaStepStatusEnum.RUNNING,
        startDate: startDate,
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

      mockAssertSagaStepViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSagaStepReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(updateSpy).toHaveBeenCalledWith({
        status: eventData.status,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        errorMessage: eventData.errorMessage,
      });
      expect(mockSagaStepReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );

      updateSpy.mockRestore();
    });

    it('should handle status change with null optional fields', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Test Step',
        order: 1,
        status: SagaStepStatusEnum.STARTED,
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

      const event = new SagaStepStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepStatusChangedEvent',
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

      const updateSpy = jest.spyOn(existingViewModel, 'update');

      mockAssertSagaStepViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSagaStepReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(updateSpy).toHaveBeenCalledWith({
        status: eventData.status,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        errorMessage: eventData.errorMessage,
      });

      updateSpy.mockRestore();
    });
  });
});
