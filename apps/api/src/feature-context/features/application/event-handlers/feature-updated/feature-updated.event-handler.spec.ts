import { FeatureUpdatedEvent } from '@/shared/domain/events/feature-context/features/feature-updated/feature-updated.event';
import { FeatureNotFoundException } from '@/feature-context/features/application/exceptions/feature-not-found/feature-not-found.exception';
import { AssertFeatureViewModelExistsService } from '@/feature-context/features/application/services/assert-feature-view-model-exists/assert-feature-view-model-exists.service';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import {
  FEATURE_READ_REPOSITORY_TOKEN,
  IFeatureReadRepository,
} from '@/feature-context/features/domain/repositories/feature-read.repository';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { Test } from '@nestjs/testing';
import { FeatureUpdatedEventHandler } from './feature-updated.event-handler';

describe('FeatureUpdatedEventHandler', () => {
  let handler: FeatureUpdatedEventHandler;
  let mockFeatureReadRepository: jest.Mocked<IFeatureReadRepository>;
  let mockAssertFeatureViewModelExistsService: jest.Mocked<AssertFeatureViewModelExistsService>;

  beforeEach(async () => {
    mockFeatureReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IFeatureReadRepository>;

    mockAssertFeatureViewModelExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertFeatureViewModelExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FeatureUpdatedEventHandler,
        {
          provide: FEATURE_READ_REPOSITORY_TOKEN,
          useValue: mockFeatureReadRepository,
        },
        {
          provide: AssertFeatureViewModelExistsService,
          useValue: mockAssertFeatureViewModelExistsService,
        },
      ],
    }).compile();

    handler = module.get<FeatureUpdatedEventHandler>(
      FeatureUpdatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save feature view model when event is handled', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new FeatureUpdatedEvent(
        {
          aggregateId: featureId,
          aggregateType: 'FeatureAggregate',
          eventType: 'FeatureUpdatedEvent',
        },
        {
          name: 'Updated Name',
          description: 'Updated description',
        },
      );

      const existingViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const updateSpy = jest.spyOn(existingViewModel, 'update');
      mockAssertFeatureViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockFeatureReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertFeatureViewModelExistsService.execute,
      ).toHaveBeenCalledWith(featureId);
      expect(
        mockAssertFeatureViewModelExistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(event.data);
      expect(mockFeatureReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
      expect(mockFeatureReadRepository.save).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });

    it('should throw exception when feature view model does not exist', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new FeatureUpdatedEvent(
        {
          aggregateId: featureId,
          aggregateType: 'FeatureAggregate',
          eventType: 'FeatureUpdatedEvent',
        },
        {
          name: 'Updated Name',
        },
      );

      const error = new FeatureNotFoundException(featureId);
      mockAssertFeatureViewModelExistsService.execute.mockRejectedValue(error);

      await expect(handler.handle(event)).rejects.toThrow(error);
      expect(
        mockAssertFeatureViewModelExistsService.execute,
      ).toHaveBeenCalledWith(featureId);
      expect(mockFeatureReadRepository.save).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new FeatureUpdatedEvent(
        {
          aggregateId: featureId,
          aggregateType: 'FeatureAggregate',
          eventType: 'FeatureUpdatedEvent',
        },
        {
          name: 'Updated Name',
        },
      );

      const existingViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const updateSpy = jest.spyOn(existingViewModel, 'update');
      mockAssertFeatureViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockFeatureReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(updateSpy).toHaveBeenCalledWith(event.data);
      expect(mockFeatureReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );

      updateSpy.mockRestore();
    });

    it('should save view model after updating it', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new FeatureUpdatedEvent(
        {
          aggregateId: featureId,
          aggregateType: 'FeatureAggregate',
          eventType: 'FeatureUpdatedEvent',
        },
        {
          name: 'Updated Name',
        },
      );

      const existingViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockAssertFeatureViewModelExistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockFeatureReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const updateOrder =
        mockAssertFeatureViewModelExistsService.execute.mock
          .invocationCallOrder[0];
      const saveOrder =
        mockFeatureReadRepository.save.mock.invocationCallOrder[0];
      expect(updateOrder).toBeLessThan(saveOrder);
    });
  });
});
