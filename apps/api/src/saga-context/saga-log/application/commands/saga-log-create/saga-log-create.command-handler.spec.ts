import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogCreateCommandHandler } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command-handler';
import { AssertSagaLogNotExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-not-exists/assert-saga-log-not-exists.service';
import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogAggregateFactory } from '@/saga-context/saga-log/domain/factories/saga-log-aggregate/saga-log-aggregate.factory';
import {
  SAGA_LOG_WRITE_REPOSITORY_TOKEN,
  SagaLogWriteRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { SagaLogCreatedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-created/saga-log-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('SagaLogCreateCommandHandler', () => {
  let handler: SagaLogCreateCommandHandler;
  let mockSagaLogWriteRepository: jest.Mocked<SagaLogWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockSagaLogAggregateFactory: jest.Mocked<SagaLogAggregateFactory>;
  let mockAssertSagaLogNotExistsService: jest.Mocked<AssertSagaLogNotExistsService>;

  beforeEach(async () => {
    mockSagaLogWriteRepository = {
      findById: jest.fn(),
      findBySagaInstanceId: jest.fn(),
      findBySagaStepId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaLogWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockSagaLogAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SagaLogAggregateFactory>;

    mockAssertSagaLogNotExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaLogNotExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        SagaLogCreateCommandHandler,
        {
          provide: SAGA_LOG_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaLogWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: SagaLogAggregateFactory,
          useValue: mockSagaLogAggregateFactory,
        },
        {
          provide: AssertSagaLogNotExistsService,
          useValue: mockAssertSagaLogNotExistsService,
        },
      ],
    }).compile();

    handler = module.get<SagaLogCreateCommandHandler>(
      SagaLogCreateCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create saga log successfully when saga log does not exist', async () => {
      const commandDto = {
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
      };

      const command = new SagaLogCreateCommand(commandDto);
      const mockSagaLog = new SagaLogAggregate(
        {
          id: command.id,
          sagaInstanceId: command.sagaInstanceId,
          sagaStepId: command.sagaStepId,
          type: command.type,
          message: command.message,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertSagaLogNotExistsService.execute.mockResolvedValue(undefined);
      mockSagaLogAggregateFactory.create.mockReturnValue(mockSagaLog);
      mockSagaLogWriteRepository.save.mockResolvedValue(mockSagaLog);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockSagaLog.id.value);
      expect(mockAssertSagaLogNotExistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(mockAssertSagaLogNotExistsService.execute).toHaveBeenCalledTimes(
        1,
      );
      expect(mockSagaLogAggregateFactory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: command.id,
          sagaInstanceId: command.sagaInstanceId,
          sagaStepId: command.sagaStepId,
          type: command.type,
          message: command.message,
        }),
      );
      const createCall = mockSagaLogAggregateFactory.create.mock.calls[0][0];
      expect(createCall.createdAt).toBeInstanceOf(DateValueObject);
      expect(createCall.updatedAt).toBeInstanceOf(DateValueObject);
      expect(mockSagaLogWriteRepository.save).toHaveBeenCalledWith(mockSagaLog);
      expect(mockSagaLogWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should publish SagaLogCreatedEvent after creating', async () => {
      const commandDto = {
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.ERROR,
        message: 'Error log message',
      };

      const command = new SagaLogCreateCommand(commandDto);
      const mockSagaLog = new SagaLogAggregate(
        {
          id: command.id,
          sagaInstanceId: command.sagaInstanceId,
          sagaStepId: command.sagaStepId,
          type: command.type,
          message: command.message,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertSagaLogNotExistsService.execute.mockResolvedValue(undefined);
      mockSagaLogAggregateFactory.create.mockReturnValue(mockSagaLog);
      mockSagaLogWriteRepository.save.mockResolvedValue(mockSagaLog);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const publishedEvents = mockSagaLog.getUncommittedEvents();
      expect(Array.isArray(publishedEvents)).toBe(true);
      if (publishedEvents.length > 0) {
        expect(publishedEvents[0]).toBeInstanceOf(SagaLogCreatedEvent);
        const event = publishedEvents[0] as SagaLogCreatedEvent;
        expect(event.aggregateId).toBe(mockSagaLog.id.value);
        expect(event.data).toEqual(mockSagaLog.toPrimitives());
      }
    });

    it('should throw error when saga log already exists', async () => {
      const commandDto = {
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
      };

      const command = new SagaLogCreateCommand(commandDto);

      mockAssertSagaLogNotExistsService.execute.mockRejectedValue(
        new Error('Saga log already exists'),
      );

      await expect(handler.execute(command)).rejects.toThrow(
        'Saga log already exists',
      );
      expect(mockAssertSagaLogNotExistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(mockSagaLogAggregateFactory.create).not.toHaveBeenCalled();
      expect(mockSagaLogWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });
  });
});
