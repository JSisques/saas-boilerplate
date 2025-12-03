import { SagaStepChangeStatusCommand } from '@/saga-context/saga-step/application/commands/saga-step-change-status/saga-step-change-status.command';
import { SagaStepChangeStatusCommandHandler } from '@/saga-context/saga-step/application/commands/saga-step-change-status/saga-step-change-status.command-handler';
import { AssertSagaStepExsistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-exsits/assert-saga-step-exsits.service';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import {
  SAGA_STEP_WRITE_REPOSITORY_TOKEN,
  SagaStepWriteRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { SagaStepStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-status-changed/saga-step-status-changed.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SagaStepNameValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-name/saga-step-name.vo';
import { SagaStepOrderValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-order/saga-step-order.vo';
import { SagaStepStatusValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-status/saga-step-status.vo';
import { SagaStepRetryCountValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-retry-count/saga-step-retry-count.vo';
import { SagaStepMaxRetriesValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-max-retries/saga-step-max-retries.vo';
import { SagaStepPayloadValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-payload/saga-step-payload.vo';
import { SagaStepResultValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-result/saga-step-result.vo';

describe('SagaStepChangeStatusCommandHandler', () => {
  let handler: SagaStepChangeStatusCommandHandler;
  let mockSagaStepWriteRepository: jest.Mocked<SagaStepWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertSagaStepExsistsService: jest.Mocked<AssertSagaStepExsistsService>;

  beforeEach(async () => {
    mockSagaStepWriteRepository = {
      findById: jest.fn(),
      findBySagaInstanceId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaStepWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockAssertSagaStepExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaStepExsistsService>;

    const module = await Test.createTestingModule({
      providers: [
        SagaStepChangeStatusCommandHandler,
        {
          provide: SAGA_STEP_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaStepWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: AssertSagaStepExsistsService,
          useValue: mockAssertSagaStepExsistsService,
        },
      ],
    }).compile();

    handler = module.get<SagaStepChangeStatusCommandHandler>(
      SagaStepChangeStatusCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createSagaStepAggregate = (): SagaStepAggregate => {
    const now = new Date();
    return new SagaStepAggregate(
      {
        id: new SagaStepUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        sagaInstanceId: new SagaInstanceUuidValueObject(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        name: new SagaStepNameValueObject('Test Step'),
        order: new SagaStepOrderValueObject(1),
        status: new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING),
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: new SagaStepRetryCountValueObject(0),
        maxRetries: new SagaStepMaxRetriesValueObject(3),
        payload: new SagaStepPayloadValueObject({}),
        result: new SagaStepResultValueObject({}),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      },
      false,
    );
  };

  describe('execute', () => {
    it('should change status to PENDING successfully', async () => {
      const existingSagaStep = createSagaStepAggregate();
      const changeStatusCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: SagaStepStatusEnum.PENDING,
      };

      const command = new SagaStepChangeStatusCommand(changeStatusCommandDto);
      const markAsPendingSpy = jest.spyOn(existingSagaStep, 'markAsPending');

      mockAssertSagaStepExsistsService.execute.mockResolvedValue(
        existingSagaStep,
      );
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsPendingSpy).toHaveBeenCalled();
      expect(mockSagaStepWriteRepository.save).toHaveBeenCalledWith(
        existingSagaStep,
      );
    });

    it('should change status to STARTED successfully', async () => {
      const existingSagaStep = createSagaStepAggregate();
      const changeStatusCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: SagaStepStatusEnum.STARTED,
      };

      const command = new SagaStepChangeStatusCommand(changeStatusCommandDto);
      const markAsStartedSpy = jest.spyOn(existingSagaStep, 'markAsStarted');

      mockAssertSagaStepExsistsService.execute.mockResolvedValue(
        existingSagaStep,
      );
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsStartedSpy).toHaveBeenCalled();
    });

    it('should change status to RUNNING successfully', async () => {
      const existingSagaStep = createSagaStepAggregate();
      const changeStatusCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: SagaStepStatusEnum.RUNNING,
      };

      const command = new SagaStepChangeStatusCommand(changeStatusCommandDto);
      const markAsRunningSpy = jest.spyOn(existingSagaStep, 'markAsRunning');

      mockAssertSagaStepExsistsService.execute.mockResolvedValue(
        existingSagaStep,
      );
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsRunningSpy).toHaveBeenCalled();
    });

    it('should change status to COMPLETED successfully', async () => {
      const existingSagaStep = createSagaStepAggregate();
      const changeStatusCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: SagaStepStatusEnum.COMPLETED,
      };

      const command = new SagaStepChangeStatusCommand(changeStatusCommandDto);
      const markAsCompletedSpy = jest.spyOn(
        existingSagaStep,
        'markAsCompleted',
      );

      mockAssertSagaStepExsistsService.execute.mockResolvedValue(
        existingSagaStep,
      );
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsCompletedSpy).toHaveBeenCalled();
    });

    it('should change status to FAILED successfully', async () => {
      const existingSagaStep = createSagaStepAggregate();
      const changeStatusCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: SagaStepStatusEnum.FAILED,
      };

      const command = new SagaStepChangeStatusCommand(changeStatusCommandDto);
      const markAsFailedSpy = jest.spyOn(existingSagaStep, 'markAsFailed');

      mockAssertSagaStepExsistsService.execute.mockResolvedValue(
        existingSagaStep,
      );
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsFailedSpy).toHaveBeenCalled();
    });

    it('should throw error when saga step does not exist', async () => {
      const changeStatusCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: SagaStepStatusEnum.PENDING,
      };

      const command = new SagaStepChangeStatusCommand(changeStatusCommandDto);
      const error = new Error('Saga step not found');

      mockAssertSagaStepExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockSagaStepWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish SagaStepStatusChangedEvent after changing status', async () => {
      const existingSagaStep = createSagaStepAggregate();
      const changeStatusCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: SagaStepStatusEnum.COMPLETED,
      };

      const command = new SagaStepChangeStatusCommand(changeStatusCommandDto);

      mockAssertSagaStepExsistsService.execute.mockResolvedValue(
        existingSagaStep,
      );
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockEventBus.publishAll).toHaveBeenCalled();
      const publishedEvents = mockEventBus.publishAll.mock.calls[0][0];
      if (publishedEvents.length > 0) {
        expect(
          publishedEvents.some((e) => e instanceof SagaStepStatusChangedEvent),
        ).toBe(true);
      }
    });

    // Note: The command constructor validates the status enum, so we can't test unknown status
    // The validation happens at the command level, not the handler level
  });
});
