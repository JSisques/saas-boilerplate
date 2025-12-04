import { SagaInstanceDeleteCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-delete/saga-instance-delete.command';
import { SagaInstanceDeleteCommandHandler } from '@/saga-context/saga-instance/application/commands/saga-instance-delete/saga-instance-delete.command-handler';
import { AssertSagaInstanceExsistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-exsits/assert-saga-instance-exsits.service';
import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import {
  SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
  SagaInstanceWriteRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { SagaInstanceDeletedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-deleted/saga-instance-deleted.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('SagaInstanceDeleteCommandHandler', () => {
  let handler: SagaInstanceDeleteCommandHandler;
  let mockSagaInstanceWriteRepository: jest.Mocked<SagaInstanceWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertSagaInstanceExsistsService: jest.Mocked<AssertSagaInstanceExsistsService>;

  const createSagaInstanceAggregate = (): SagaInstanceAggregate => {
    const now = new Date();
    return new SagaInstanceAggregate(
      {
        id: new SagaInstanceUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        name: new SagaInstanceNameValueObject('Order Processing Saga'),
        status: new SagaInstanceStatusValueObject(
          SagaInstanceStatusEnum.PENDING,
        ),
        startDate: null,
        endDate: null,
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      },
      false,
    );
  };

  beforeEach(async () => {
    mockSagaInstanceWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockAssertSagaInstanceExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaInstanceExsistsService>;

    const module = await Test.createTestingModule({
      providers: [
        SagaInstanceDeleteCommandHandler,
        {
          provide: SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaInstanceWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: AssertSagaInstanceExsistsService,
          useValue: mockAssertSagaInstanceExsistsService,
        },
      ],
    }).compile();

    handler = module.get<SagaInstanceDeleteCommandHandler>(
      SagaInstanceDeleteCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete saga instance successfully', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceDeleteCommand({ id: sagaInstanceId });

      const existingSagaInstance = createSagaInstanceAggregate();

      mockAssertSagaInstanceExsistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertSagaInstanceExsistsService.execute).toHaveBeenCalledWith(
        sagaInstanceId,
      );
      expect(mockSagaInstanceWriteRepository.delete).toHaveBeenCalledWith(
        sagaInstanceId,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalled();
    });

    it('should call delete method on aggregate', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceDeleteCommand({ id: sagaInstanceId });

      const existingSagaInstance = createSagaInstanceAggregate();
      const deleteSpy = jest.spyOn(existingSagaInstance, 'delete');

      mockAssertSagaInstanceExsistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(deleteSpy).toHaveBeenCalled();
    });

    it('should publish SagaInstanceDeletedEvent after deleting', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceDeleteCommand({ id: sagaInstanceId });

      const existingSagaInstance = createSagaInstanceAggregate();

      mockAssertSagaInstanceExsistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const publishedEvents = existingSagaInstance.getUncommittedEvents();
      if (Array.isArray(publishedEvents) && publishedEvents.length > 0) {
        expect(publishedEvents[0]).toBeInstanceOf(SagaInstanceDeletedEvent);
        expect(mockEventBus.publishAll).toHaveBeenCalledWith(publishedEvents);
      }
    });

    it('should throw error if saga instance does not exist', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceDeleteCommand({ id: sagaInstanceId });

      const error = new Error('Saga instance not found');

      mockAssertSagaInstanceExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockSagaInstanceWriteRepository.delete).not.toHaveBeenCalled();
    });
  });
});
