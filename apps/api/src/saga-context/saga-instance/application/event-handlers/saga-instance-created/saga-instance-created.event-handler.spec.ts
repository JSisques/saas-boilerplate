import { SagaInstanceCreatedEventHandler } from '@/saga-context/saga-instance/application/event-handlers/saga-instance-created/saga-instance-created.event-handler';
import { SagaInstanceViewModelFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-view-model/saga-instance-view-model.factory';
import {
  SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
  SagaInstanceReadRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceCreatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-created/saga-instance-created.event';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { Test } from '@nestjs/testing';

describe('SagaInstanceCreatedEventHandler', () => {
  let handler: SagaInstanceCreatedEventHandler;
  let mockSagaInstanceReadRepository: jest.Mocked<SagaInstanceReadRepository>;
  let mockSagaInstanceViewModelFactory: jest.Mocked<SagaInstanceViewModelFactory>;

  beforeEach(async () => {
    mockSagaInstanceReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceReadRepository>;

    mockSagaInstanceViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceViewModelFactory>;

    const module = await Test.createTestingModule({
      providers: [
        SagaInstanceCreatedEventHandler,
        {
          provide: SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
          useValue: mockSagaInstanceReadRepository,
        },
        {
          provide: SagaInstanceViewModelFactory,
          useValue: mockSagaInstanceViewModelFactory,
        },
      ],
    }).compile();

    handler = module.get<SagaInstanceCreatedEventHandler>(
      SagaInstanceCreatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save saga instance view model from event data', async () => {
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

      const event = new SagaInstanceCreatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceCreatedEvent',
        },
        eventData,
      );

      const viewModel = new SagaInstanceViewModel({
        ...eventData,
        createdAt: eventData.createdAt,
        updatedAt: eventData.updatedAt,
      });

      mockSagaInstanceViewModelFactory.fromPrimitives.mockReturnValue(
        viewModel,
      );
      mockSagaInstanceReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockSagaInstanceViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledWith(eventData);
      expect(
        mockSagaInstanceViewModelFactory.fromPrimitives,
      ).toHaveBeenCalledTimes(1);
      expect(mockSagaInstanceReadRepository.save).toHaveBeenCalledWith(
        viewModel,
      );
      expect(mockSagaInstanceReadRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
