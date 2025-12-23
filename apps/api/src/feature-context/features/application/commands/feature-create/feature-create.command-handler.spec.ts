import { FeatureCreatedEvent } from '@/shared/domain/events/feature-context/features/feature-created/feature-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { IFeatureCreateCommandDto } from '@/feature-context/features/application/dtos/commands/feature-create/feature-create-command.dto';
import { FeatureKeyIsNotUniqueException } from '@/feature-context/features/application/exceptions/feature-key-is-not-unique/feature-key-is-not-unique.exception';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureAggregateFactory } from '@/feature-context/features/domain/factories/feature-aggregate/feature-aggregate.factory';
import {
  FEATURE_WRITE_REPOSITORY_TOKEN,
  IFeatureWriteRepository,
} from '@/feature-context/features/domain/repositories/feature-write.repository';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { FeatureCreateCommand } from './feature-create.command';
import { FeatureCreateCommandHandler } from './feature-create.command-handler';

describe('FeatureCreateCommandHandler', () => {
  let handler: FeatureCreateCommandHandler;
  let mockFeatureWriteRepository: jest.Mocked<IFeatureWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockFeatureAggregateFactory: jest.Mocked<FeatureAggregateFactory>;

  beforeEach(async () => {
    mockFeatureWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IFeatureWriteRepository>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockFeatureAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<FeatureAggregateFactory>;

    const module = await Test.createTestingModule({
      providers: [
        FeatureCreateCommandHandler,
        {
          provide: FEATURE_WRITE_REPOSITORY_TOKEN,
          useValue: mockFeatureWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: FeatureAggregateFactory,
          useValue: mockFeatureAggregateFactory,
        },
      ],
    }).compile();

    handler = module.get<FeatureCreateCommandHandler>(
      FeatureCreateCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create feature successfully', async () => {
      const commandDto: IFeatureCreateCommandDto = {
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
      };

      const command = new FeatureCreateCommand(commandDto);
      const mockFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: new FeatureDescriptionValueObject(
            'This feature enables advanced analytics capabilities',
          ),
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockFeatureAggregateFactory.create.mockReturnValue(mockFeature);
      mockFeatureWriteRepository.save.mockResolvedValue(mockFeature);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockFeature.id.value);
      expect(mockFeatureAggregateFactory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          key: command.key,
          name: command.name,
          description: command.description,
          status: command.status,
        }),
      );
      const createCall = mockFeatureAggregateFactory.create.mock.calls[0][0];
      expect(createCall.createdAt).toBeInstanceOf(DateValueObject);
      expect(createCall.updatedAt).toBeInstanceOf(DateValueObject);
      expect(mockFeatureWriteRepository.save).toHaveBeenCalledWith(mockFeature);
      expect(mockFeatureWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        mockFeature.getUncommittedEvents(),
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should create feature with null description', async () => {
      const commandDto: IFeatureCreateCommandDto = {
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
      };

      const command = new FeatureCreateCommand(commandDto);
      const mockFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockFeatureAggregateFactory.create.mockReturnValue(mockFeature);
      mockFeatureWriteRepository.save.mockResolvedValue(mockFeature);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockFeature.id.value);
      expect(mockFeatureAggregateFactory.create).toHaveBeenCalled();
      expect(mockFeatureWriteRepository.save).toHaveBeenCalledWith(mockFeature);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
    });

    it('should throw FeatureKeyIsNotUniqueException when key is not unique (Prisma P2002)', async () => {
      const commandDto: IFeatureCreateCommandDto = {
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
      };

      const command = new FeatureCreateCommand(commandDto);
      const mockFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockFeatureAggregateFactory.create.mockReturnValue(mockFeature);
      const prismaError = {
        code: 'P2002',
        meta: {
          target: ['key'],
        },
      };
      mockFeatureWriteRepository.save.mockRejectedValue(prismaError);

      await expect(handler.execute(command)).rejects.toThrow(
        FeatureKeyIsNotUniqueException,
      );
      await expect(handler.execute(command)).rejects.toThrow(
        `Feature with key advanced-analytics already exists`,
      );

      expect(mockFeatureAggregateFactory.create).toHaveBeenCalled();
      expect(mockFeatureWriteRepository.save).toHaveBeenCalledWith(mockFeature);
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should propagate other errors from repository', async () => {
      const commandDto: IFeatureCreateCommandDto = {
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
      };

      const command = new FeatureCreateCommand(commandDto);
      const mockFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockFeatureAggregateFactory.create.mockReturnValue(mockFeature);
      const repositoryError = new Error('Database connection error');
      mockFeatureWriteRepository.save.mockRejectedValue(repositoryError);

      await expect(handler.execute(command)).rejects.toThrow(repositoryError);

      expect(mockFeatureAggregateFactory.create).toHaveBeenCalled();
      expect(mockFeatureWriteRepository.save).toHaveBeenCalledWith(mockFeature);
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish FeatureCreatedEvent when feature is created', async () => {
      const commandDto: IFeatureCreateCommandDto = {
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
      };

      const command = new FeatureCreateCommand(commandDto);
      const mockFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockFeatureAggregateFactory.create.mockReturnValue(mockFeature);
      mockFeatureWriteRepository.save.mockResolvedValue(mockFeature);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const uncommittedEvents = mockFeature.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(FeatureCreatedEvent);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(uncommittedEvents);
    });

    it('should save feature before publishing events', async () => {
      const commandDto: IFeatureCreateCommandDto = {
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
      };

      const command = new FeatureCreateCommand(commandDto);
      const mockFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockFeatureAggregateFactory.create.mockReturnValue(mockFeature);
      mockFeatureWriteRepository.save.mockResolvedValue(mockFeature);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockFeatureWriteRepository.save.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(saveOrder).toBeLessThan(publishOrder);
    });

    it('should return the created feature id', async () => {
      const commandDto: IFeatureCreateCommandDto = {
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
      };

      const command = new FeatureCreateCommand(commandDto);
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const mockFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockFeatureAggregateFactory.create.mockReturnValue(mockFeature);
      mockFeatureWriteRepository.save.mockResolvedValue(mockFeature);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(featureId);
    });
  });
});
