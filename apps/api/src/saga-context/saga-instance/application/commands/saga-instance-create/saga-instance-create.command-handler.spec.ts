import { SagaInstanceCreateCommand } from '@/saga-context/saga-instance/application/commands/saga-instance-create/saga-instance-create.command';
import { SagaInstanceCreateCommandHandler } from '@/saga-context/saga-instance/application/commands/saga-instance-create/saga-instance-create.command-handler';
import { AssertSagaInstanceNotExsistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-not-exsits/assert-saga-instance-not-exsits.service';
import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { SagaInstanceAggregateFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-aggregate/saga-instance-aggregate.factory';
import {
  SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
  SagaInstanceWriteRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { SagaInstanceCreatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-created/saga-instance-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('SagaInstanceCreateCommandHandler', () => {
  let handler: SagaInstanceCreateCommandHandler;
  let mockSagaInstanceWriteRepository: jest.Mocked<SagaInstanceWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockSagaInstanceAggregateFactory: jest.Mocked<SagaInstanceAggregateFactory>;
  let mockAssertSagaInstanceNotExsistsService: jest.Mocked<AssertSagaInstanceNotExsistsService>;

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

    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockSagaInstanceAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceAggregateFactory>;

    mockAssertSagaInstanceNotExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaInstanceNotExsistsService>;

    const module = await Test.createTestingModule({
      providers: [
        SagaInstanceCreateCommandHandler,
        {
          provide: SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaInstanceWriteRepository,
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
          provide: SagaInstanceAggregateFactory,
          useValue: mockSagaInstanceAggregateFactory,
        },
        {
          provide: AssertSagaInstanceNotExsistsService,
          useValue: mockAssertSagaInstanceNotExsistsService,
        },
      ],
    }).compile();

    handler = module.get<SagaInstanceCreateCommandHandler>(
      SagaInstanceCreateCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create saga instance successfully when saga instance does not exist', async () => {
      const commandDto = {
        name: 'Order Processing Saga',
      };

      const command = new SagaInstanceCreateCommand(commandDto);
      const mockSagaInstance = new SagaInstanceAggregate(
        {
          id: command.id,
          name: new SagaInstanceNameValueObject(commandDto.name),
          status: new SagaInstanceStatusValueObject(
            SagaInstanceStatusEnum.PENDING,
          ),
          startDate: null,
          endDate: null,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockAssertSagaInstanceNotExsistsService.execute.mockResolvedValue(
        undefined,
      );
      mockSagaInstanceAggregateFactory.create.mockReturnValue(mockSagaInstance);
      mockSagaInstanceWriteRepository.save.mockResolvedValue(mockSagaInstance);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const markAsPendingSpy = jest.spyOn(mockSagaInstance, 'markAsPending');

      const result = await handler.execute(command);

      expect(result).toBe(mockSagaInstance.id.value);
      expect(
        mockAssertSagaInstanceNotExsistsService.execute,
      ).toHaveBeenCalledWith(command.id.value);
      expect(mockSagaInstanceAggregateFactory.create).toHaveBeenCalled();
      expect(markAsPendingSpy).toHaveBeenCalledWith(false);
      expect(mockSagaInstanceWriteRepository.save).toHaveBeenCalledWith(
        mockSagaInstance,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalled();
    });

    it('should mark saga instance as pending after creation', async () => {
      const commandDto = {
        name: 'Order Processing Saga',
      };

      const command = new SagaInstanceCreateCommand(commandDto);
      const mockSagaInstance = new SagaInstanceAggregate(
        {
          id: command.id,
          name: new SagaInstanceNameValueObject(commandDto.name),
          status: new SagaInstanceStatusValueObject(
            SagaInstanceStatusEnum.PENDING,
          ),
          startDate: null,
          endDate: null,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockAssertSagaInstanceNotExsistsService.execute.mockResolvedValue(
        undefined,
      );
      mockSagaInstanceAggregateFactory.create.mockReturnValue(mockSagaInstance);
      mockSagaInstanceWriteRepository.save.mockResolvedValue(mockSagaInstance);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const markAsPendingSpy = jest.spyOn(mockSagaInstance, 'markAsPending');

      await handler.execute(command);

      expect(markAsPendingSpy).toHaveBeenCalledWith(false);
      expect(mockSagaInstance.status.value).toBe(
        SagaInstanceStatusEnum.PENDING,
      );
    });

    it('should publish SagaInstanceCreatedEvent after saving', async () => {
      const commandDto = {
        name: 'Order Processing Saga',
      };

      const command = new SagaInstanceCreateCommand(commandDto);
      const mockSagaInstance = new SagaInstanceAggregate(
        {
          id: command.id,
          name: new SagaInstanceNameValueObject(commandDto.name),
          status: new SagaInstanceStatusValueObject(
            SagaInstanceStatusEnum.PENDING,
          ),
          startDate: null,
          endDate: null,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertSagaInstanceNotExsistsService.execute.mockResolvedValue(
        undefined,
      );
      mockSagaInstanceAggregateFactory.create.mockReturnValue(mockSagaInstance);
      mockSagaInstanceWriteRepository.save.mockResolvedValue(mockSagaInstance);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const publishedEvents = mockSagaInstance.getUncommittedEvents();
      if (Array.isArray(publishedEvents) && publishedEvents.length > 0) {
        expect(publishedEvents[0]).toBeInstanceOf(SagaInstanceCreatedEvent);
        expect(mockEventBus.publishAll).toHaveBeenCalledWith(publishedEvents);
      }
    });

    it('should throw error if saga instance already exists', async () => {
      const commandDto = {
        name: 'Order Processing Saga',
      };

      const command = new SagaInstanceCreateCommand(commandDto);
      const error = new Error('Saga instance already exists');

      mockAssertSagaInstanceNotExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockSagaInstanceAggregateFactory.create).not.toHaveBeenCalled();
      expect(mockSagaInstanceWriteRepository.save).not.toHaveBeenCalled();
    });

    it('should commit events after publishing', async () => {
      const commandDto = {
        name: 'Order Processing Saga',
      };

      const command = new SagaInstanceCreateCommand(commandDto);
      const mockSagaInstance = new SagaInstanceAggregate(
        {
          id: command.id,
          name: new SagaInstanceNameValueObject(commandDto.name),
          status: new SagaInstanceStatusValueObject(
            SagaInstanceStatusEnum.PENDING,
          ),
          startDate: null,
          endDate: null,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockAssertSagaInstanceNotExsistsService.execute.mockResolvedValue(
        undefined,
      );
      mockSagaInstanceAggregateFactory.create.mockReturnValue(mockSagaInstance);
      mockSagaInstanceWriteRepository.save.mockResolvedValue(mockSagaInstance);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const commitSpy = jest.spyOn(mockSagaInstance, 'commit');

      await handler.execute(command);

      expect(commitSpy).toHaveBeenCalled();
    });
  });
});
