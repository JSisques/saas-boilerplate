import { SagaInstanceUpdatedEventHandler } from '@/saga-context/saga-instance/application/event-handlers/saga-instance-updated/tenant-member-updated.event-handler';
import { AssertSagaInstanceViewModelExistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exists/assert-saga-instance-view-model-exists.service';
import {
  SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
  SagaInstanceReadRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceUpdatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-updated/saga-instance-updated.event';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { Test } from '@nestjs/testing';

describe('SagaInstanceUpdatedEventHandler', () => {
  let handler: SagaInstanceUpdatedEventHandler;
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
        SagaInstanceUpdatedEventHandler,
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

    handler = module.get<SagaInstanceUpdatedEventHandler>(
      SagaInstanceUpdatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save saga instance view model when event is handled', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        name: 'Updated Saga Name',
        status: SagaInstanceStatusEnum.RUNNING,
        startDate: new Date('2024-01-01T10:00:00Z') as any,
        endDate: null as any,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      };

      const event = new SagaInstanceUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceUpdatedEvent',
        },
        eventData,
      );

      const existingViewModel = new SagaInstanceViewModel({
        id: aggregateId,
        name: 'Original Saga Name',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      const updateSpy = jest.spyOn(existingViewModel, 'update');

      mockAssertSagaInstanceViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockSagaInstanceReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertSagaInstanceViewModelExistsService.execute,
      ).toHaveBeenCalledWith(aggregateId);
      expect(updateSpy).toHaveBeenCalledWith(eventData);
      expect(mockSagaInstanceReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
    });
  });
});
