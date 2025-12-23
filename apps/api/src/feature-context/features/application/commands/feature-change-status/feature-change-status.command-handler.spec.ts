import { FeatureStatusChangedEvent } from '@/shared/domain/events/feature-context/features/feature-status-changed/feature-status-changed.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { FeatureNotFoundException } from '@/feature-context/features/application/exceptions/feature-not-found/feature-not-found.exception';
import { AssertFeatureExistsService } from '@/feature-context/features/application/services/assert-feature-exists/assert-feature-exists.service';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import {
  FEATURE_WRITE_REPOSITORY_TOKEN,
  IFeatureWriteRepository,
} from '@/feature-context/features/domain/repositories/feature-write.repository';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { FeatureChangeStatusCommand } from './feature-change-status.command';
import { FeatureChangeStatusCommandHandler } from './feature-change-status.command-handler';

describe('FeatureChangeStatusCommandHandler', () => {
  let handler: FeatureChangeStatusCommandHandler;
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
        FeatureChangeStatusCommandHandler,
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

    handler = module.get<FeatureChangeStatusCommandHandler>(
      FeatureChangeStatusCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should change feature status successfully when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const command = new FeatureChangeStatusCommand({
        id: featureId,
        status: FeatureStatusEnum.INACTIVE,
      });
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
      expect(existingFeature.status.value).toBe(FeatureStatusEnum.INACTIVE);
      expect(mockFeatureWriteRepository.save).toHaveBeenCalledWith(
        existingFeature,
      );
      expect(mockFeatureWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when feature does not exist', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new FeatureChangeStatusCommand({
        id: featureId,
        status: FeatureStatusEnum.INACTIVE,
      });
      const error = new FeatureNotFoundException(featureId);

      mockAssertFeatureExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertFeatureExistsService.execute).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockFeatureWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish FeatureStatusChangedEvent when status is changed', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const command = new FeatureChangeStatusCommand({
        id: featureId,
        status: FeatureStatusEnum.INACTIVE,
      });
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

      // Verify that the status was changed
      expect(existingFeature.status.value).toBe(FeatureStatusEnum.INACTIVE);
      // Verify that events were published (the handler calls commit() after publishing)
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      // Verify that the published events include FeatureStatusChangedEvent
      const publishedEvents = mockEventBus.publishAll.mock.calls[0]?.[0];
      expect(publishedEvents).toBeDefined();
      expect(Array.isArray(publishedEvents)).toBe(true);
      if (publishedEvents && publishedEvents.length > 0) {
        const statusChangedEvent = publishedEvents.find(
          (e) => e instanceof FeatureStatusChangedEvent,
        );
        expect(statusChangedEvent).toBeInstanceOf(FeatureStatusChangedEvent);
      }
    });

    it('should save feature before publishing events', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const command = new FeatureChangeStatusCommand({
        id: featureId,
        status: FeatureStatusEnum.INACTIVE,
      });
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

    it('should change status to different values', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const testCases = [
        FeatureStatusEnum.INACTIVE,
        FeatureStatusEnum.DEPRECATED,
      ];

      for (const status of testCases) {
        const command = new FeatureChangeStatusCommand({
          id: featureId,
          status: status,
        });
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

        const changeStatusSpy = jest.spyOn(existingFeature, 'changeStatus');
        mockAssertFeatureExistsService.execute.mockResolvedValue(
          existingFeature,
        );
        mockFeatureWriteRepository.save.mockResolvedValue(existingFeature);
        mockEventBus.publishAll.mockResolvedValue(undefined);

        await handler.execute(command);

        expect(changeStatusSpy).toHaveBeenCalledWith(
          expect.objectContaining({ value: status }),
        );

        changeStatusSpy.mockRestore();
        jest.clearAllMocks();
      }
    });
  });
});
