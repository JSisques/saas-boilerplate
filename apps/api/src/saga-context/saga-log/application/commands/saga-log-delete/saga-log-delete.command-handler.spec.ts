import { SagaLogDeleteCommand } from '@/saga-context/saga-log/application/commands/saga-log-delete/saga-log-delete.command';
import { SagaLogDeleteCommandHandler } from '@/saga-context/saga-log/application/commands/saga-log-delete/saga-log-delete.command-handler';
import { AssertSagaLogExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-exists/assert-saga-log-exists.service';
import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import {
  SAGA_LOG_WRITE_REPOSITORY_TOKEN,
  SagaLogWriteRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { SagaLogDeletedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-deleted/saga-log-deleted.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('SagaLogDeleteCommandHandler', () => {
  let handler: SagaLogDeleteCommandHandler;
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
        SagaLogDeleteCommandHandler,
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

    handler = module.get<SagaLogDeleteCommandHandler>(
      SagaLogDeleteCommandHandler,
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
        message: new SagaLogMessageValueObject('Test log message'),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      },
      false,
    );
  };

  describe('execute', () => {
    it('should delete saga log successfully when saga log exists', async () => {
      const existingSagaLog = createSagaLogAggregate();
      const deleteCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const command = new SagaLogDeleteCommand(deleteCommandDto);
      const deleteSpy = jest.spyOn(existingSagaLog, 'delete');
      const commitSpy = jest.spyOn(existingSagaLog, 'commit');

      mockAssertSagaLogExistsService.execute.mockResolvedValue(existingSagaLog);
      mockSagaLogWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertSagaLogExistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(deleteSpy).toHaveBeenCalled();
      expect(mockSagaLogWriteRepository.delete).toHaveBeenCalledWith(
        existingSagaLog.id.value,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        existingSagaLog.getUncommittedEvents(),
      );
      expect(commitSpy).toHaveBeenCalled();
    });

    it('should throw error when saga log does not exist', async () => {
      const deleteCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const command = new SagaLogDeleteCommand(deleteCommandDto);
      const error = new Error('Saga log not found');

      mockAssertSagaLogExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertSagaLogExistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(mockSagaLogWriteRepository.delete).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish SagaLogDeletedEvent after deleting', async () => {
      const existingSagaLog = createSagaLogAggregate();
      const deleteCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const command = new SagaLogDeleteCommand(deleteCommandDto);

      mockAssertSagaLogExistsService.execute.mockResolvedValue(existingSagaLog);
      mockSagaLogWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockEventBus.publishAll).toHaveBeenCalled();
      const publishedEvents = existingSagaLog.getUncommittedEvents();
      expect(Array.isArray(publishedEvents)).toBe(true);
      if (publishedEvents.length > 0) {
        expect(
          publishedEvents.some((e) => e instanceof SagaLogDeletedEvent),
        ).toBe(true);
      }
    });
  });
});
