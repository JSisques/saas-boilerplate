import { SagaLogUpdatedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-log-updated/saga-log-updated.event-handler';
import { AssertSagaLogViewModelExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-view-model-exists/assert-saga-log-view-model-exists.service';
import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogUpdatedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-updated/saga-log-updated.event';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { Test } from '@nestjs/testing';

describe('SagaLogUpdatedEventHandler', () => {
  let handler: SagaLogUpdatedEventHandler;
  let mockSagaLogReadRepository: jest.Mocked<SagaLogReadRepository>;
  let mockAssertSagaLogViewModelExistsService: jest.Mocked<AssertSagaLogViewModelExistsService>;

  beforeEach(async () => {
    mockSagaLogReadRepository = {
      findById: jest.fn(),
      findBySagaInstanceId: jest.fn(),
      findBySagaStepId: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaLogReadRepository>;

    mockAssertSagaLogViewModelExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaLogViewModelExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        SagaLogUpdatedEventHandler,
        {
          provide: SAGA_LOG_READ_REPOSITORY_TOKEN,
          useValue: mockSagaLogReadRepository,
        },
        {
          provide: AssertSagaLogViewModelExistsService,
          useValue: mockAssertSagaLogViewModelExistsService,
        },
      ],
    }).compile();

    handler = module.get<SagaLogUpdatedEventHandler>(
      SagaLogUpdatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save saga log view model from event data', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.ERROR,
        message: 'Updated log message',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      };

      const event = new SagaLogUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaLogAggregate',
          eventType: 'SagaLogUpdatedEvent',
        },
        eventData,
      );

      const existingViewModel = new SagaLogViewModel({
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Original message',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      const updateSpy = jest.spyOn(existingViewModel, 'update');

      mockAssertSagaLogViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSagaLogReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertSagaLogViewModelExistsService.execute,
      ).toHaveBeenCalledWith(aggregateId);
      expect(updateSpy).toHaveBeenCalledWith(eventData);
      expect(mockSagaLogReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
      expect(mockSagaLogReadRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
