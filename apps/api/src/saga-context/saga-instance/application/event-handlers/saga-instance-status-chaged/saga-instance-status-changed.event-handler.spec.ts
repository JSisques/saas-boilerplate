import { SagaInstanceStatusChangedEventHandler } from '@/saga-context/saga-instance/application/event-handlers/saga-instance-status-chaged/saga-instance-status-changed.event-handler';
import { AssertSagaInstanceViewModelExsistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exsits/assert-saga-instance-view-model-exsits.service';
import {
  SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
  SagaInstanceReadRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceViewModelFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-view-model/saga-instance-view-model.factory';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-status-changed/saga-instance-status-changed.event';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { Test } from '@nestjs/testing';

describe('SagaInstanceStatusChangedEventHandler', () => {
  let handler: SagaInstanceStatusChangedEventHandler;
  let mockSagaInstanceReadRepository: jest.Mocked<SagaInstanceReadRepository>;
  let mockAssertSagaInstanceViewModelExsistsService: jest.Mocked<AssertSagaInstanceViewModelExsistsService>;
  let mockSagaInstanceViewModelFactory: jest.Mocked<SagaInstanceViewModelFactory>;

  beforeEach(async () => {
    mockSagaInstanceReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceReadRepository>;

    mockAssertSagaInstanceViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaInstanceViewModelExsistsService>;

    mockSagaInstanceViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceViewModelFactory>;

    const module = await Test.createTestingModule({
      providers: [
        SagaInstanceStatusChangedEventHandler,
        {
          provide: SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
          useValue: mockSagaInstanceReadRepository,
        },
        {
          provide: AssertSagaInstanceViewModelExsistsService,
          useValue: mockAssertSagaInstanceViewModelExsistsService,
        },
        {
          provide: SagaInstanceViewModelFactory,
          useValue: mockSagaInstanceViewModelFactory,
        },
      ],
    }).compile();

    handler = module.get<SagaInstanceStatusChangedEventHandler>(
      SagaInstanceStatusChangedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update saga instance view model status when event is handled', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: new Date('2024-01-01T10:00:00Z') as any,
        endDate: new Date('2024-01-01T11:00:00Z') as any,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      };

      const event = new SagaInstanceStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceStatusChangedEvent',
        },
        eventData,
      );

      const existingViewModel = new SagaInstanceViewModel({
        id: aggregateId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      const updateSpy = jest.spyOn(existingViewModel, 'update');

      mockAssertSagaInstanceViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSagaInstanceReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertSagaInstanceViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(aggregateId);
      expect(updateSpy).toHaveBeenCalledWith({
        status: eventData.status,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
      });
      expect(mockSagaInstanceReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
    });
  });
});
