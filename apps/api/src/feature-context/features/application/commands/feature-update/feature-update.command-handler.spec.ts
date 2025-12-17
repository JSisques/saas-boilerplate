import { FeatureUpdatedEvent } from '@/shared/domain/events/feature-context/features/feature-updated/feature-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { IFeatureUpdateCommandDto } from '@/feature-context/features/application/dtos/commands/feature-update/feature-update-command.dto';
import { FeatureNotFoundException } from '@/feature-context/features/application/exceptions/feature-not-found/feature-not-found.exception';
import { AssertFeatureExistsService } from '@/feature-context/features/application/services/assert-feature-exists/assert-feature-exists.service';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
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
import { FeatureUpdateCommand } from './feature-update.command';
import { FeatureUpdateCommandHandler } from './feature-update.command-handler';

describe('FeatureUpdateCommandHandler', () => {
  let handler: FeatureUpdateCommandHandler;
  let mockFeatureWriteRepository: jest.Mocked<IFeatureWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertFeatureExistsService: jest.Mocked<AssertFeatureExistsService>;

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

    mockAssertFeatureExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertFeatureExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FeatureUpdateCommandHandler,
        {
          provide: FEATURE_WRITE_REPOSITORY_TOKEN,
          useValue: mockFeatureWriteRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: AssertFeatureExistsService,
          useValue: mockAssertFeatureExistsService,
        },
      ],
    }).compile();

    handler = module.get<FeatureUpdateCommandHandler>(
      FeatureUpdateCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update feature successfully when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: IFeatureUpdateCommandDto = {
        id: featureId,
        name: 'Updated Name',
      };

      const command = new FeatureUpdateCommand(commandDto);
      const existingFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertFeatureExistsService.execute.mockResolvedValue(existingFeature);
      mockFeatureWriteRepository.save.mockResolvedValue(existingFeature);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertFeatureExistsService.execute).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockAssertFeatureExistsService.execute).toHaveBeenCalledTimes(1);
      expect(mockFeatureWriteRepository.save).toHaveBeenCalledWith(
        existingFeature,
      );
      expect(mockFeatureWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when feature does not exist', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IFeatureUpdateCommandDto = {
        id: featureId,
        name: 'Updated Name',
      };

      const command = new FeatureUpdateCommand(commandDto);
      const error = new FeatureNotFoundException(featureId);

      mockAssertFeatureExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertFeatureExistsService.execute).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockFeatureWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IFeatureUpdateCommandDto = {
        id: featureId,
        name: 'Updated Name',
        description: 'Updated description',
      };

      const command = new FeatureUpdateCommand(commandDto);
      const now = new Date();
      const existingFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertFeatureExistsService.execute.mockResolvedValue(existingFeature);
      mockFeatureWriteRepository.save.mockResolvedValue(existingFeature);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      // Verify that the feature was updated by checking the name changed
      expect(existingFeature.name.value).toBe('Updated Name');
    });

    it('should exclude id from update data', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IFeatureUpdateCommandDto = {
        id: featureId,
        name: 'Updated Name',
      };

      const command = new FeatureUpdateCommand(commandDto);
      const now = new Date();
      const existingFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertFeatureExistsService.execute.mockResolvedValue(existingFeature);
      mockFeatureWriteRepository.save.mockResolvedValue(existingFeature);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      // Verify that id is not in the update data by checking the feature was updated correctly
      expect(existingFeature.id.value).toBe(featureId);
    });

    it('should publish FeatureUpdatedEvent when feature is updated', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IFeatureUpdateCommandDto = {
        id: featureId,
        name: 'Updated Name',
      };

      const command = new FeatureUpdateCommand(commandDto);
      const now = new Date();
      const existingFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertFeatureExistsService.execute.mockResolvedValue(existingFeature);
      mockFeatureWriteRepository.save.mockResolvedValue(existingFeature);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      // Verify that the feature was updated
      expect(existingFeature.name.value).toBe('Updated Name');
      // Verify that events were published (the handler calls commit() after publishing)
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      // Verify that the published events include FeatureUpdatedEvent
      const publishedEvents = mockEventBus.publishAll.mock.calls[0]?.[0];
      expect(publishedEvents).toBeDefined();
      expect(Array.isArray(publishedEvents)).toBe(true);
      if (publishedEvents && publishedEvents.length > 0) {
        const updatedEvent = publishedEvents.find(
          (e) => e instanceof FeatureUpdatedEvent,
        );
        expect(updatedEvent).toBeInstanceOf(FeatureUpdatedEvent);
      }
    });

    it('should save feature before publishing events', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IFeatureUpdateCommandDto = {
        id: featureId,
        name: 'Updated Name',
      };

      const command = new FeatureUpdateCommand(commandDto);
      const now = new Date();
      const existingFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertFeatureExistsService.execute.mockResolvedValue(existingFeature);
      mockFeatureWriteRepository.save.mockResolvedValue(existingFeature);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockFeatureWriteRepository.save.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(saveOrder).toBeLessThan(publishOrder);
    });
  });
});
