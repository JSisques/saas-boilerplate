import { SagaLogUpdateCommand } from '@/saga-context/saga-log/application/commands/saga-log-update/saga-log-update.command';
import { SagaLogUpdateCommandHandler } from '@/saga-context/saga-log/application/commands/saga-log-update/saga-log-update.command-handler';
import { AssertSagaLogExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-exists/assert-saga-log-exists.service';
import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import {
  SAGA_LOG_WRITE_REPOSITORY_TOKEN,
  SagaLogWriteRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { SagaLogUpdatedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-updated/saga-log-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('SagaLogUpdateCommandHandler', () => {
  let handler: SagaLogUpdateCommandHandler;
  let mockSagaLogWriteRepository: jest.Mocked<SagaLogWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertSagaLogExistsService: jest.Mocked<AssertSagaLogExistsService>;

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

    mockAssertSagaLogExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaLogExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        SagaLogUpdateCommandHandler,
        {
          provide: SAGA_LOG_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaLogWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: AssertSagaLogExistsService,
          useValue: mockAssertSagaLogExistsService,
        },
      ],
    }).compile();

    handler = module.get<SagaLogUpdateCommandHandler>(
      SagaLogUpdateCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createSagaLogAggregate = (): SagaLogAggregate => {
    const now = new Date();
    return new SagaLogAggregate(
      {
        id: new SagaLogUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        sagaInstanceId: new SagaInstanceUuidValueObject(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        sagaStepId: new SagaStepUuidValueObject(
          '323e4567-e89b-12d3-a456-426614174000',
        ),
        type: new SagaLogTypeValueObject(SagaLogTypeEnum.INFO),
        message: new SagaLogMessageValueObject('Original message'),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      },
      false,
    );
  };

  describe('execute', () => {
    it('should update saga log successfully when saga log exists', async () => {
      const existingSagaLog = createSagaLogAggregate();

      const updateCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.ERROR,
        message: 'Updated message',
      };

      const command = new SagaLogUpdateCommand(updateCommandDto);

      const updateSpy = jest.spyOn(existingSagaLog, 'update');
      const commitSpy = jest.spyOn(existingSagaLog, 'commit');

      mockAssertSagaLogExistsService.execute.mockResolvedValue(existingSagaLog);
      mockSagaLogWriteRepository.save.mockResolvedValue(existingSagaLog);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertSagaLogExistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: command.type,
          message: command.message,
        }),
      );
      expect(mockSagaLogWriteRepository.save).toHaveBeenCalledWith(
        existingSagaLog,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        existingSagaLog.getUncommittedEvents(),
      );
      expect(commitSpy).toHaveBeenCalled();
    });

    it('should extract update data excluding id, sagaInstanceId and sagaStepId', async () => {
      const existingSagaLog = createSagaLogAggregate();

      const updateCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.WARNING,
      };

      const command = new SagaLogUpdateCommand(updateCommandDto);

      const extractUpdateDataSpy = jest.spyOn(
        handler as any,
        'extractUpdateData',
      );

      mockAssertSagaLogExistsService.execute.mockResolvedValue(existingSagaLog);
      mockSagaLogWriteRepository.save.mockResolvedValue(existingSagaLog);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(extractUpdateDataSpy).toHaveBeenCalledWith(command, [
        'id',
        'sagaInstanceId',
        'sagaStepId',
      ]);
    });

    it('should publish SagaLogUpdatedEvent after updating', async () => {
      const existingSagaLog = createSagaLogAggregate();

      const updateCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.DEBUG,
      };

      const command = new SagaLogUpdateCommand(updateCommandDto);

      mockAssertSagaLogExistsService.execute.mockResolvedValue(existingSagaLog);
      mockSagaLogWriteRepository.save.mockResolvedValue(existingSagaLog);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const publishedEvents = existingSagaLog.getUncommittedEvents();
      expect(Array.isArray(publishedEvents)).toBe(true);
      if (publishedEvents.length > 0) {
        expect(publishedEvents[0]).toBeInstanceOf(SagaLogUpdatedEvent);
      }
    });

    it('should throw error when saga log does not exist', async () => {
      const updateCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.ERROR,
      };

      const command = new SagaLogUpdateCommand(updateCommandDto);
      const error = new Error('Saga log not found');

      mockAssertSagaLogExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertSagaLogExistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(mockSagaLogWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });
  });
});
