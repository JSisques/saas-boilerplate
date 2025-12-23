import { FeatureCreatedEvent } from '@/shared/domain/events/feature-context/features/feature-created/feature-created.event';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeaturePrimitives } from '@/feature-context/features/domain/primitives/feature.primitives';
import { FeatureViewModelFactory } from '@/feature-context/features/domain/factories/feature-view-model/feature-view-model.factory';
import {
  FEATURE_READ_REPOSITORY_TOKEN,
  IFeatureReadRepository,
} from '@/feature-context/features/domain/repositories/feature-read.repository';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { Test } from '@nestjs/testing';
import { FeatureCreatedEventHandler } from './feature-created.event-handler';

describe('FeatureCreatedEventHandler', () => {
  let handler: FeatureCreatedEventHandler;
  let mockFeatureReadRepository: jest.Mocked<IFeatureReadRepository>;
  let mockFeatureViewModelFactory: jest.Mocked<FeatureViewModelFactory>;

  beforeEach(async () => {
    mockFeatureReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IFeatureReadRepository>;

    mockFeatureViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<FeatureViewModelFactory>;

    const module = await Test.createTestingModule({
      providers: [
        FeatureCreatedEventHandler,
        {
          provide: FEATURE_READ_REPOSITORY_TOKEN,
          useValue: mockFeatureReadRepository,
        },
        {
          provide: FeatureViewModelFactory,
          useValue: mockFeatureViewModelFactory,
        },
      ],
    }).compile();

    handler = module.get<FeatureCreatedEventHandler>(
      FeatureCreatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save feature view model when event is handled', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const featurePrimitives: FeaturePrimitives = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new FeatureCreatedEvent(
        {
          aggregateId: featureId,
          aggregateType: 'FeatureAggregate',
          eventType: 'FeatureCreatedEvent',
        },
        featurePrimitives,
      );

      const mockViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockFeatureViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockFeatureReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockFeatureViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        featurePrimitives,
      );
      expect(mockFeatureViewModelFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
      expect(mockFeatureReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
      expect(mockFeatureReadRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle event with all feature properties', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const featurePrimitives: FeaturePrimitives = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new FeatureCreatedEvent(
        {
          aggregateId: featureId,
          aggregateType: 'FeatureAggregate',
          eventType: 'FeatureCreatedEvent',
        },
        featurePrimitives,
      );

      const mockViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockFeatureViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockFeatureReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockFeatureViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        featurePrimitives,
      );
      expect(mockFeatureReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
    });

    it('should handle event with null description', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const featurePrimitives: FeaturePrimitives = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new FeatureCreatedEvent(
        {
          aggregateId: featureId,
          aggregateType: 'FeatureAggregate',
          eventType: 'FeatureCreatedEvent',
        },
        featurePrimitives,
      );

      const mockViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockFeatureViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockFeatureReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockFeatureViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        featurePrimitives,
      );
      expect(mockFeatureReadRepository.save).toHaveBeenCalledWith(
        mockViewModel,
      );
    });

    it('should use correct aggregate id from event metadata', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const featurePrimitives: FeaturePrimitives = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new FeatureCreatedEvent(
        {
          aggregateId: featureId,
          aggregateType: 'FeatureAggregate',
          eventType: 'FeatureCreatedEvent',
        },
        featurePrimitives,
      );

      const mockViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockFeatureViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockFeatureReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(event.aggregateId).toBe(featureId);
      expect(event.data.id).toBe(featureId);
    });

    it('should save view model after creating it', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const featurePrimitives: FeaturePrimitives = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new FeatureCreatedEvent(
        {
          aggregateId: featureId,
          aggregateType: 'FeatureAggregate',
          eventType: 'FeatureCreatedEvent',
        },
        featurePrimitives,
      );

      const mockViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockFeatureViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockFeatureReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const createOrder =
        mockFeatureViewModelFactory.fromPrimitives.mock.invocationCallOrder[0];
      const saveOrder =
        mockFeatureReadRepository.save.mock.invocationCallOrder[0];
      expect(createOrder).toBeLessThan(saveOrder);
    });
  });
});
