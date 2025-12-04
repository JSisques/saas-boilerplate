import { SagaLogCreatedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-log-created/saga-log-created.event-handler';
import { SagaLogViewModelFactory } from '@/saga-context/saga-log/domain/factories/saga-log-view-model/saga-log-view-model.factory';
import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogCreatedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-created/saga-log-created.event';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { Test } from '@nestjs/testing';

describe('SagaLogCreatedEventHandler', () => {
  let handler: SagaLogCreatedEventHandler;
  let mockSagaLogReadRepository: jest.Mocked<SagaLogReadRepository>;
  let mockSagaLogViewModelFactory: jest.Mocked<SagaLogViewModelFactory>;

  beforeEach(async () => {
    mockSagaLogReadRepository = {
      findById: jest.fn(),
      findBySagaInstanceId: jest.fn(),
      findBySagaStepId: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaLogReadRepository>;

    mockSagaLogViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<SagaLogViewModelFactory>;

    const module = await Test.createTestingModule({
      providers: [
        SagaLogCreatedEventHandler,
        {
          provide: SAGA_LOG_READ_REPOSITORY_TOKEN,
          useValue: mockSagaLogReadRepository,
        },
        {
          provide: SagaLogViewModelFactory,
          useValue: mockSagaLogViewModelFactory,
        },
      ],
    }).compile();

    handler = module.get<SagaLogCreatedEventHandler>(
      SagaLogCreatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save saga log view model from event data', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaLogCreatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaLogAggregate',
          eventType: 'SagaLogCreatedEvent',
        },
        eventData,
      );

      const viewModel = new SagaLogViewModel({
        ...eventData,
        createdAt: eventData.createdAt,
        updatedAt: eventData.updatedAt,
      });

      mockSagaLogViewModelFactory.fromPrimitives.mockReturnValue(viewModel);
      mockSagaLogReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockSagaLogViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        eventData,
      );
      expect(mockSagaLogViewModelFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
      expect(mockSagaLogReadRepository.save).toHaveBeenCalledWith(viewModel);
      expect(mockSagaLogReadRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle event with different log types', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const types = [
        SagaLogTypeEnum.INFO,
        SagaLogTypeEnum.WARNING,
        SagaLogTypeEnum.ERROR,
        SagaLogTypeEnum.DEBUG,
      ];

      for (const type of types) {
        const eventData = {
          id: aggregateId,
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: type,
          message: `Test message for ${type}`,
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        };

        const event = new SagaLogCreatedEvent(
          {
            aggregateId: aggregateId,
            aggregateType: 'SagaLogAggregate',
            eventType: 'SagaLogCreatedEvent',
          },
          eventData,
        );

        const viewModel = new SagaLogViewModel({
          ...eventData,
          createdAt: eventData.createdAt,
          updatedAt: eventData.updatedAt,
        });

        mockSagaLogViewModelFactory.fromPrimitives.mockReturnValue(viewModel);
        mockSagaLogReadRepository.save.mockResolvedValue(undefined);

        await handler.handle(event);

        expect(mockSagaLogViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
          eventData,
        );
        expect(mockSagaLogReadRepository.save).toHaveBeenCalledWith(viewModel);
      }
    });
  });
});
