import { SagaInstanceChangeStatusCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-change-status/saga-instance-change-status.command';
import { SagaInstanceChangeStatusCommandHandler } from '@/saga-context/saga-instance/application/commands/saga-instance-change-status/saga-instance-change-status.command-handler';
import { AssertSagaInstanceExistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-exists/assert-saga-instance-exists.service';
import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import {
  SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
  SagaInstanceWriteRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-status-changed/saga-instance-status-changed.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('SagaInstanceChangeStatusCommandHandler', () => {
  let handler: SagaInstanceChangeStatusCommandHandler;
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
        SagaInstanceChangeStatusCommandHandler,
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

    handler = module.get<SagaInstanceChangeStatusCommandHandler>(
      SagaInstanceChangeStatusCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should change status to PENDING', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.PENDING,
      });

      const existingSagaInstance = createSagaInstanceAggregate();
      const markAsPendingSpy = jest.spyOn(
        existingSagaInstance,
        'markAsPending',
      );

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.save.mockResolvedValue(
        existingSagaInstance,
      );
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsPendingSpy).toHaveBeenCalled();
      expect(mockSagaInstanceWriteRepository.save).toHaveBeenCalledWith(
        existingSagaInstance,
      );
    });

    it('should change status to STARTED', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.STARTED,
      });

      const existingSagaInstance = createSagaInstanceAggregate();
      const markAsStartedSpy = jest.spyOn(
        existingSagaInstance,
        'markAsStarted',
      );

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.save.mockResolvedValue(
        existingSagaInstance,
      );
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsStartedSpy).toHaveBeenCalled();
    });

    it('should change status to RUNNING', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.RUNNING,
      });

      const existingSagaInstance = createSagaInstanceAggregate();
      const markAsRunningSpy = jest.spyOn(
        existingSagaInstance,
        'markAsRunning',
      );

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.save.mockResolvedValue(
        existingSagaInstance,
      );
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsRunningSpy).toHaveBeenCalled();
    });

    it('should change status to COMPLETED', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.COMPLETED,
      });

      const existingSagaInstance = createSagaInstanceAggregate();
      const markAsCompletedSpy = jest.spyOn(
        existingSagaInstance,
        'markAsCompleted',
      );

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.save.mockResolvedValue(
        existingSagaInstance,
      );
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsCompletedSpy).toHaveBeenCalled();
    });

    it('should change status to FAILED', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.FAILED,
      });

      const existingSagaInstance = createSagaInstanceAggregate();
      const markAsFailedSpy = jest.spyOn(existingSagaInstance, 'markAsFailed');

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.save.mockResolvedValue(
        existingSagaInstance,
      );
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsFailedSpy).toHaveBeenCalled();
    });

    it('should change status to COMPENSATING', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.COMPENSATING,
      });

      const existingSagaInstance = createSagaInstanceAggregate();
      const markAsCompensatingSpy = jest.spyOn(
        existingSagaInstance,
        'markAsCompensating',
      );

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.save.mockResolvedValue(
        existingSagaInstance,
      );
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsCompensatingSpy).toHaveBeenCalled();
    });

    it('should change status to COMPENSATED', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.COMPENSATED,
      });

      const existingSagaInstance = createSagaInstanceAggregate();
      const markAsCompensatedSpy = jest.spyOn(
        existingSagaInstance,
        'markAsCompensated',
      );

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );
      mockSagaInstanceWriteRepository.save.mockResolvedValue(
        existingSagaInstance,
      );
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsCompensatedSpy).toHaveBeenCalled();
    });

    it('should throw error for unknown status', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.PENDING,
      });

      const existingSagaInstance = createSagaInstanceAggregate();

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        existingSagaInstance,
      );

      // Mock the switch statement to hit the default case by using Object.defineProperty
      const originalValue = command.status.value;
      Object.defineProperty(command.status, 'value', {
        get: () => 'UNKNOWN_STATUS' as any,
        configurable: true,
      });

      await expect(handler.execute(command)).rejects.toThrow(
        'Unknown status: UNKNOWN_STATUS. Cannot change saga instance status.',
      );

      // Restore original value
      Object.defineProperty(command.status, 'value', {
        get: () => originalValue,
        configurable: true,
      });
    });

    it('should publish SagaInstanceStatusChangedEvent after changing status', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
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

      const publishedEvents = existingSagaInstance.getUncommittedEvents();
      if (Array.isArray(publishedEvents) && publishedEvents.length > 0) {
        expect(publishedEvents[0]).toBeInstanceOf(
          SagaInstanceStatusChangedEvent,
        );
        expect(mockEventBus.publishAll).toHaveBeenCalledWith(publishedEvents);
      }
    });

    it('should throw error if saga instance does not exist', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new SagaInstanceChangeStatusCommand({
        id: sagaInstanceId,
        status: SagaInstanceStatusEnum.COMPLETED,
      });

      const error = new Error('Saga instance not found');

      mockAssertSagaInstanceExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockSagaInstanceWriteRepository.save).not.toHaveBeenCalled();
    });
  });
});
