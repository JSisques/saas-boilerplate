import { SagaStepCreateCommand } from '@/saga-context/saga-step/application/commands/saga-step-create/saga-step-create.command';
import { SagaStepCreateCommandHandler } from '@/saga-context/saga-step/application/commands/saga-step-create/saga-step-create.command-handler';
import { AssertSagaStepNotExsistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-not-exsits/assert-saga-step-not-exsits.service';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepAggregateFactory } from '@/saga-context/saga-step/domain/factories/saga-step-aggregate/saga-step-aggregate.factory';
import {
  SAGA_STEP_WRITE_REPOSITORY_TOKEN,
  SagaStepWriteRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { SagaStepResultValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-result/saga-step-result.vo';
import { SagaStepCreatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-created/saga-step-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('SagaStepCreateCommandHandler', () => {
  let handler: SagaStepCreateCommandHandler;
  let mockSagaStepWriteRepository: jest.Mocked<SagaStepWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockSagaStepAggregateFactory: jest.Mocked<SagaStepAggregateFactory>;
  let mockAssertSagaStepNotExsistsService: jest.Mocked<AssertSagaStepNotExsistsService>;

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

    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockSagaStepAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SagaStepAggregateFactory>;

    mockAssertSagaStepNotExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaStepNotExsistsService>;

    const module = await Test.createTestingModule({
      providers: [
        SagaStepCreateCommandHandler,
        {
          provide: SAGA_STEP_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaStepWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
        {
          provide: SagaStepAggregateFactory,
          useValue: mockSagaStepAggregateFactory,
        },
        {
          provide: AssertSagaStepNotExsistsService,
          useValue: mockAssertSagaStepNotExsistsService,
        },
      ],
    }).compile();

    handler = module.get<SagaStepCreateCommandHandler>(
      SagaStepCreateCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create saga step successfully when saga step does not exist', async () => {
      const commandDto = {
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        payload: { orderId: '12345' },
      };

      const command = new SagaStepCreateCommand(commandDto);
      const mockSagaStep = new SagaStepAggregate(
        {
          id: command.id,
          sagaInstanceId: new SagaInstanceUuidValueObject(
            commandDto.sagaInstanceId,
          ),
          name: command.name,
          order: command.order,
          status: command.status,
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: command.retryCount,
          maxRetries: command.maxRetries,
          payload: command.payload,
          result: command.result ?? new SagaStepResultValueObject({}),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      const markAsPendingSpy = jest.spyOn(mockSagaStep, 'markAsPending');

      mockAssertSagaStepNotExsistsService.execute.mockResolvedValue(undefined);
      mockSagaStepAggregateFactory.create.mockReturnValue(mockSagaStep);
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockSagaStep.id.value);
      expect(mockAssertSagaStepNotExsistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(mockAssertSagaStepNotExsistsService.execute).toHaveBeenCalledTimes(
        1,
      );
      expect(mockSagaStepAggregateFactory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: command.id,
          sagaInstanceId: command.sagaInstanceId,
          name: command.name,
          order: command.order,
          status: command.status,
          payload: command.payload,
        }),
      );
      const createCall = mockSagaStepAggregateFactory.create.mock.calls[0][0];
      expect(createCall.createdAt).toBeInstanceOf(DateValueObject);
      expect(createCall.updatedAt).toBeInstanceOf(DateValueObject);
      expect(markAsPendingSpy).toHaveBeenCalledWith(false);
      expect(mockSagaStepWriteRepository.save).toHaveBeenCalledWith(
        mockSagaStep,
      );
      expect(mockSagaStepWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        mockSagaStep.getUncommittedEvents(),
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should throw error when saga step already exists', async () => {
      const commandDto = {
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        payload: { orderId: '12345' },
      };

      const command = new SagaStepCreateCommand(commandDto);
      const error = new Error('Saga step already exists');

      mockAssertSagaStepNotExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertSagaStepNotExsistsService.execute).toHaveBeenCalledWith(
        command.id.value,
      );
      expect(mockSagaStepAggregateFactory.create).not.toHaveBeenCalled();
      expect(mockSagaStepWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should mark saga step as pending after creation', async () => {
      const commandDto = {
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        payload: { orderId: '12345' },
      };

      const command = new SagaStepCreateCommand(commandDto);
      const mockSagaStep = new SagaStepAggregate(
        {
          id: command.id,
          sagaInstanceId: new SagaInstanceUuidValueObject(
            commandDto.sagaInstanceId,
          ),
          name: command.name,
          order: command.order,
          status: command.status,
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: command.retryCount,
          maxRetries: command.maxRetries,
          payload: command.payload,
          result: command.result ?? new SagaStepResultValueObject({}),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      // Spy on markAsPending
      const markAsPendingSpy = jest.spyOn(mockSagaStep, 'markAsPending');

      mockAssertSagaStepNotExsistsService.execute.mockResolvedValue(undefined);
      mockSagaStepAggregateFactory.create.mockReturnValue(mockSagaStep);
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(markAsPendingSpy).toHaveBeenCalledWith(false);
    });

    it('should publish SagaStepCreatedEvent after saving', async () => {
      const commandDto = {
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        payload: { orderId: '12345' },
      };

      const command = new SagaStepCreateCommand(commandDto);
      const mockSagaStep = new SagaStepAggregate(
        {
          id: command.id,
          sagaInstanceId: new SagaInstanceUuidValueObject(
            commandDto.sagaInstanceId,
          ),
          name: command.name,
          order: command.order,
          status: command.status,
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: command.retryCount,
          maxRetries: command.maxRetries,
          payload: command.payload,
          result: command.result ?? new SagaStepResultValueObject({}),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertSagaStepNotExsistsService.execute.mockResolvedValue(undefined);
      mockSagaStepAggregateFactory.create.mockReturnValue(mockSagaStep);
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockEventBus.publishAll).toHaveBeenCalled();
      const publishedEvents = mockEventBus.publishAll.mock.calls[0][0];
      expect(publishedEvents).toBeDefined();
      expect(Array.isArray(publishedEvents)).toBe(true);
      if (publishedEvents.length > 0) {
        expect(
          publishedEvents.some((e) => e instanceof SagaStepCreatedEvent),
        ).toBe(true);
      }
    });

    it('should commit events after publishing', async () => {
      const commandDto = {
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        payload: { orderId: '12345' },
      };

      const command = new SagaStepCreateCommand(commandDto);
      const mockSagaStep = new SagaStepAggregate(
        {
          id: command.id,
          sagaInstanceId: new SagaInstanceUuidValueObject(
            commandDto.sagaInstanceId,
          ),
          name: command.name,
          order: command.order,
          status: command.status,
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: command.retryCount,
          maxRetries: command.maxRetries,
          payload: command.payload,
          result: command.result ?? new SagaStepResultValueObject({}),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      const commitSpy = jest.spyOn(mockSagaStep, 'commit');

      mockAssertSagaStepNotExsistsService.execute.mockResolvedValue(undefined);
      mockSagaStepAggregateFactory.create.mockReturnValue(mockSagaStep);
      mockSagaStepWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(commitSpy).toHaveBeenCalled();
    });
  });
});
