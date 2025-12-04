import { SagaInstanceDeletedEventHandler } from '@/saga-context/saga-instance/application/event-handlers/saga-instance-deleted/saga-instance-deleted.event-handler';
import { AssertSagaInstanceViewModelExistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exists/assert-saga-instance-view-model-exists.service';
import {
  SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
  SagaInstanceReadRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceDeletedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-deleted/saga-instance-deleted.event';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { Test } from '@nestjs/testing';

describe('SagaInstanceDeletedEventHandler', () => {
  let handler: SagaInstanceDeletedEventHandler;
  let mockSagaInstanceReadRepository: jest.Mocked<SagaInstanceReadRepository>;
  let mockAssertSagaInstanceViewModelExistsService: jest.Mocked<AssertSagaInstanceViewModelExistsService>;

  beforeEach(async () => {
    mockSagaInstanceReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceReadRepository>;

    mockAssertSagaInstanceViewModelExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaInstanceViewModelExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        SagaInstanceDeletedEventHandler,
        {
          provide: SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
          useValue: mockSagaInstanceReadRepository,
        },
        {
          provide: AssertSagaInstanceViewModelExistsService,
          useValue: mockAssertSagaInstanceViewModelExistsService,
        },
      ],
    }).compile();

    handler = module.get<SagaInstanceDeletedEventHandler>(
      SagaInstanceDeletedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete saga instance view model when event is handled', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null as any,
        endDate: null as any,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaInstanceDeletedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceDeletedEvent',
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

      mockAssertSagaInstanceViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSagaInstanceReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertSagaInstanceViewModelExistsService.execute,
      ).toHaveBeenCalledWith(aggregateId);
      expect(mockSagaInstanceReadRepository.delete).toHaveBeenCalledWith(
        aggregateId,
      );
    });
  });
});
