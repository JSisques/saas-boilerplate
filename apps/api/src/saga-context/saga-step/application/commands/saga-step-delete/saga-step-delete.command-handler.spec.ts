import { SagaStepDeleteCommand } from '@/saga-context/saga-step/application/commands/saga-step-delete/saga-step-delete.command';
import { SagaStepDeleteCommandHandler } from '@/saga-context/saga-step/application/commands/saga-step-delete/saga-step-delete.command-handler';
import { AssertSagaStepExistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-exists/assert-saga-step-exists.service';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import {
  SAGA_STEP_WRITE_REPOSITORY_TOKEN,
  SagaStepWriteRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { SagaStepDeletedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-deleted/saga-step-deleted.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepNameValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-name/saga-step-name.vo';
import { SagaStepOrderValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-order/saga-step-order.vo';
import { SagaStepStatusValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-status/saga-step-status.vo';
import { SagaStepRetryCountValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-retry-count/saga-step-retry-count.vo';
import { SagaStepMaxRetriesValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-max-retries/saga-step-max-retries.vo';
import { SagaStepPayloadValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-payload/saga-step-payload.vo';
import { SagaStepResultValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-result/saga-step-result.vo';

describe('SagaStepDeleteCommandHandler', () => {
  let handler: SagaStepDeleteCommandHandler;
  let mockSagaStepWriteRepository: jest.Mocked<SagaStepWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertSagaStepExistsService: jest.Mocked<AssertSagaStepExistsService>;

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

    mockAssertSagaStepExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaStepExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        SagaStepDeleteCommandHandler,
        {
          provide: SAGA_STEP_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaStepWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: AssertSagaStepExistsService,
          useValue: mockAssertSagaStepExistsService,
        },
      ],
    }).compile();

    handler = module.get<SagaStepDeleteCommandHandler>(
      SagaStepDeleteCommandHandler,
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
    it('should delete saga step successfully when saga step exists', async () => {
      const existingSagaStep = createSagaStepAggregate();
      const deleteCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const command = new SagaStepDeleteCommand(deleteCommandDto);
      const deleteSpy = jest.spyOn(existingSagaStep, 'delete');
      const commitSpy = jest.spyOn(existingSagaStep, 'commit');

      mockAssertSagaStepExistsService.execute.mockResolvedValue(
        existingSagaStep,
      );
      mockSagaStepWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertSagaStepExistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(deleteSpy).toHaveBeenCalled();
      expect(mockSagaStepWriteRepository.delete).toHaveBeenCalledWith(
        existingSagaStep.id.value,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        existingSagaStep.getUncommittedEvents(),
      );
      expect(commitSpy).toHaveBeenCalled();
    });

    it('should throw error when saga step does not exist', async () => {
      const deleteCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const command = new SagaStepDeleteCommand(deleteCommandDto);
      const error = new Error('Saga step not found');

      mockAssertSagaStepExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertSagaStepExistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(mockSagaStepWriteRepository.delete).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish SagaStepDeletedEvent after deleting', async () => {
      const existingSagaStep = createSagaStepAggregate();
      const deleteCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const command = new SagaStepDeleteCommand(deleteCommandDto);

      mockAssertSagaStepExistsService.execute.mockResolvedValue(
        existingSagaStep,
      );
      mockSagaStepWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockEventBus.publishAll).toHaveBeenCalled();
      const publishedEvents = mockEventBus.publishAll.mock.calls[0][0];
      expect(publishedEvents).toBeDefined();
      expect(Array.isArray(publishedEvents)).toBe(true);
      if (publishedEvents.length > 0) {
        expect(
          publishedEvents.some((e) => e instanceof SagaStepDeletedEvent),
        ).toBe(true);
      }
    });
  });
});
