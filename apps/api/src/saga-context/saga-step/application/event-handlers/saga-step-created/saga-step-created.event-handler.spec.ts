import { SagaStepCreatedEventHandler } from '@/saga-context/saga-step/application/event-handlers/saga-step-created/saga-step-created.event-handler';
import { SagaStepViewModelFactory } from '@/saga-context/saga-step/domain/factories/saga-step-view-model/saga-step-view-model.factory';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepCreatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-created/saga-step-created.event';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { Test } from '@nestjs/testing';

describe('SagaStepCreatedEventHandler', () => {
  let handler: SagaStepCreatedEventHandler;
  let mockSagaStepReadRepository: jest.Mocked<SagaStepReadRepository>;
  let mockSagaStepViewModelFactory: jest.Mocked<SagaStepViewModelFactory>;

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

    const module = await Test.createTestingModule({
      providers: [
        SagaStepCreatedEventHandler,
        {
          provide: SAGA_STEP_READ_REPOSITORY_TOKEN,
          useValue: mockSagaStepReadRepository,
        },
        {
          provide: SagaStepViewModelFactory,
          useValue: mockSagaStepViewModelFactory,
        },
      ],
    }).compile();

    handler = module.get<SagaStepCreatedEventHandler>(
      SagaStepCreatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save saga step view model from event data', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: { orderId: '12345' },
        result: {},
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaStepCreatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepCreatedEvent',
        },
        eventData,
      );

      const viewModel = new SagaStepViewModel({
        ...eventData,
        createdAt: eventData.createdAt,
        updatedAt: eventData.updatedAt,
      });

      mockSagaStepViewModelFactory.fromPrimitives.mockReturnValue(viewModel);
      mockSagaStepReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockSagaStepViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        eventData,
      );
      expect(mockSagaStepViewModelFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
      expect(mockSagaStepReadRepository.save).toHaveBeenCalledWith(viewModel);
      expect(mockSagaStepReadRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle event with all optional fields set', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const eventData = {
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        errorMessage: null,
        retryCount: 2,
        maxRetries: 5,
        payload: { orderId: '12345', userId: '67890' },
        result: { success: true, transactionId: 'tx-123' },
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaStepCreatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepCreatedEvent',
        },
        eventData,
      );

      const viewModel = new SagaStepViewModel({
        ...eventData,
        createdAt: eventData.createdAt,
        updatedAt: eventData.updatedAt,
      });

      mockSagaStepViewModelFactory.fromPrimitives.mockReturnValue(viewModel);
      mockSagaStepReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockSagaStepViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        eventData,
      );
      expect(mockSagaStepReadRepository.save).toHaveBeenCalledWith(viewModel);
    });
  });
});
