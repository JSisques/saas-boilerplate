import { SagaStepUpdateCommand } from '@/saga-context/saga-step/application/commands/saga-step-update/saga-step-update.command';
import { SagaStepUpdateCommandHandler } from '@/saga-context/saga-step/application/commands/saga-step-update/saga-step-update.command-handler';
import { ISagaStepUpdateCommandDto } from '@/saga-context/saga-step/application/dtos/commands/saga-step-update/saga-step-update-command.dto';
import { AssertSagaStepExsistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-exsits/assert-saga-step-exsits.service';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import {
  SAGA_STEP_WRITE_REPOSITORY_TOKEN,
  SagaStepWriteRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { SagaStepMaxRetriesValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-max-retries/saga-step-max-retries.vo';
import { SagaStepNameValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-name/saga-step-name.vo';
import { SagaStepOrderValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-order/saga-step-order.vo';
import { SagaStepPayloadValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-payload/saga-step-payload.vo';
import { SagaStepResultValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-result/saga-step-result.vo';
import { SagaStepRetryCountValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-retry-count/saga-step-retry-count.vo';
import { SagaStepStatusValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-status/saga-step-status.vo';
import { SagaStepUpdatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-updated/saga-step-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('SagaStepUpdateCommandHandler', () => {
  let handler: SagaStepUpdateCommandHandler;
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
        SagaStepUpdateCommandHandler,
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

    handler = module.get<SagaStepUpdateCommandHandler>(
      SagaStepUpdateCommandHandler,
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
        name: new SagaStepNameValueObject('Original Name'),
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
    it('should update saga step successfully when saga step exists', async () => {
      const existingSagaStep = createSagaStepAggregate();

      const updateCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Name',
      };

      const command = new SagaStepUpdateCommand(updateCommandDto);

      const updateSpy = jest.spyOn(existingSagaStep, 'update');
      const commitSpy = jest.spyOn(existingSagaStep, 'commit');

      mockAssertSagaStepExsistsService.execute.mockResolvedValue(
        existingSagaStep,
      );
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertSagaStepExsistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: command.name,
        }),
      );
      expect(mockSagaStepWriteRepository.save).toHaveBeenCalledWith(
        existingSagaStep,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        existingSagaStep.getUncommittedEvents(),
      );
      expect(commitSpy).toHaveBeenCalled();
    });

    it('should throw error when saga step does not exist', async () => {
      const updateCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Name',
      };

      const command = new SagaStepUpdateCommand(updateCommandDto);
      const error = new Error('Saga step not found');

      mockAssertSagaStepExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertSagaStepExsistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(mockSagaStepWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should update multiple fields at once', async () => {
      const existingSagaStep = createSagaStepAggregate();

      const updateCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Name',
        order: 5,
        retryCount: 2,
      };

      const command = new SagaStepUpdateCommand(updateCommandDto);
      const updateSpy = jest.spyOn(existingSagaStep, 'update');

      mockAssertSagaStepExsistsService.execute.mockResolvedValue(
        existingSagaStep,
      );
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: command.name,
          order: command.order,
          retryCount: command.retryCount,
        }),
      );
    });

    it('should exclude id and sagaInstanceId from update data', async () => {
      const existingSagaStep = createSagaStepAggregate();

      const updateCommandDto: ISagaStepUpdateCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Name',
      };

      const command = new SagaStepUpdateCommand(updateCommandDto);
      const updateSpy = jest.spyOn(existingSagaStep, 'update');

      mockAssertSagaStepExsistsService.execute.mockResolvedValue(
        existingSagaStep,
      );
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const updateCall = updateSpy.mock.calls[0][0];
      expect(updateCall).not.toHaveProperty('id');
      expect(updateCall).not.toHaveProperty('sagaInstanceId');
    });

    it('should publish SagaStepUpdatedEvent after updating', async () => {
      const existingSagaStep = createSagaStepAggregate();

      const updateCommandDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Updated Name',
      };

      const command = new SagaStepUpdateCommand(updateCommandDto);

      mockAssertSagaStepExsistsService.execute.mockResolvedValue(
        existingSagaStep,
      );
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockEventBus.publishAll).toHaveBeenCalled();
      const publishedEvents = mockEventBus.publishAll.mock.calls[0][0];
      expect(publishedEvents).toBeDefined();
      expect(Array.isArray(publishedEvents)).toBe(true);
      if (publishedEvents.length > 0) {
        expect(
          publishedEvents.some((e) => e instanceof SagaStepUpdatedEvent),
        ).toBe(true);
      }
    });
  });
});
