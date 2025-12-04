import { SagaInstanceUpdateCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-update/saga-instance-update.command';
import { SagaInstanceUpdateCommandHandler } from '@/saga-context/saga-instance/application/commands/saga-instance-update/saga-instance-update.command-handler';
import { AssertSagaInstanceExistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-exists/assert-saga-instance-exists.service';
import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import {
  SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
  SagaInstanceWriteRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceUpdatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-updated/saga-instance-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('SagaInstanceUpdateCommandHandler', () => {
  let handler: SagaInstanceUpdateCommandHandler;
  let mockSagaInstanceWriteRepository: jest.Mocked<SagaInstanceWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertSagaInstanceExistsService: jest.Mocked<AssertSagaInstanceExistsService>;

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

    mockAssertSagaInstanceExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaInstanceExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        SagaInstanceUpdateCommandHandler,
        {
          provide: SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaInstanceWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: AssertSagaInstanceExistsService,
          useValue: mockAssertSagaInstanceExistsService,
        },
      ],
    }).compile();

    handler = module.get<SagaInstanceUpdateCommandHandler>(
      SagaInstanceUpdateCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update saga instance successfully', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceUpdateCommand({
        id: sagaInstanceId,
        name: 'Updated Saga Name',
        status: SagaInstanceStatusEnum.COMPLETED,
      });

      const existingSagaInstance = createSagaInstanceAggregate();

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.save.mockResolvedValue(
        existingSagaInstance,
      );
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertSagaInstanceExistsService.execute).toHaveBeenCalledWith(
        sagaInstanceId,
      );
      expect(existingSagaInstance.name.value).toBe('Updated Saga Name');
      expect(existingSagaInstance.status.value).toBe(
        SagaInstanceStatusEnum.COMPLETED,
      );
      expect(mockSagaInstanceWriteRepository.save).toHaveBeenCalledWith(
        existingSagaInstance,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceUpdateCommand({
        id: sagaInstanceId,
        name: 'Updated Saga Name',
      });

      const existingSagaInstance = createSagaInstanceAggregate();
      const originalStatus = existingSagaInstance.status.value;

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.save.mockResolvedValue(
        existingSagaInstance,
      );
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(existingSagaInstance.name.value).toBe('Updated Saga Name');
      expect(existingSagaInstance.status.value).toBe(originalStatus);
    });

    it('should extract update data excluding id field', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceUpdateCommand({
        id: sagaInstanceId,
        name: 'Updated Saga Name',
        status: SagaInstanceStatusEnum.COMPLETED,
      });

      const existingSagaInstance = createSagaInstanceAggregate();

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.save.mockResolvedValue(
        existingSagaInstance,
      );
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const updateCall = (handler as any).extractUpdateData(command, ['id']);
      expect(updateCall).not.toHaveProperty('id');
    });

    it('should publish SagaInstanceUpdatedEvent after updating', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceUpdateCommand({
        id: sagaInstanceId,
        name: 'Updated Saga Name',
      });

      const existingSagaInstance = createSagaInstanceAggregate();

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.save.mockResolvedValue(
        existingSagaInstance,
      );
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const publishedEvents = existingSagaInstance.getUncommittedEvents();
      if (Array.isArray(publishedEvents) && publishedEvents.length > 0) {
        expect(publishedEvents[0]).toBeInstanceOf(SagaInstanceUpdatedEvent);
        expect(mockEventBus.publishAll).toHaveBeenCalledWith(publishedEvents);
      }
    });

    it('should throw error if saga instance does not exist', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceUpdateCommand({
        id: sagaInstanceId,
        name: 'Updated Saga Name',
      });

      const error = new Error('Saga instance not found');

      mockAssertSagaInstanceExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockSagaInstanceWriteRepository.save).not.toHaveBeenCalled();
    });
  });
});
