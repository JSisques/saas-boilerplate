import { FeatureDeletedEvent } from '@/shared/domain/events/feature-context/features/feature-deleted/feature-deleted.event';
import {
  FEATURE_READ_REPOSITORY_TOKEN,
  IFeatureReadRepository,
} from '@/feature-context/features/domain/repositories/feature-read.repository';
import { Test } from '@nestjs/testing';
import { FeatureDeletedEventHandler } from './feature-deleted.event-handler';

describe('FeatureDeletedEventHandler', () => {
  let handler: FeatureDeletedEventHandler;
  let mockFeatureReadRepository: jest.Mocked<IFeatureReadRepository>;

  beforeEach(async () => {
    mockFeatureReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IFeatureReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        FeatureDeletedEventHandler,
        {
          provide: FEATURE_READ_REPOSITORY_TOKEN,
          useValue: mockFeatureReadRepository,
        },
      ],
    }).compile();

    handler = module.get<FeatureDeletedEventHandler>(
      FeatureDeletedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete feature view model when event is handled', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new FeatureDeletedEvent(
        {
          aggregateId: featureId,
          aggregateType: 'FeatureAggregate',
          eventType: 'FeatureDeletedEvent',
        },
        {
          id: featureId,
          key: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: null,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      );

      mockFeatureReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockFeatureReadRepository.delete).toHaveBeenCalledWith(featureId);
      expect(mockFeatureReadRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should use correct aggregate id from event metadata', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new FeatureDeletedEvent(
        {
          aggregateId: featureId,
          aggregateType: 'FeatureAggregate',
          eventType: 'FeatureDeletedEvent',
        },
        {
          id: featureId,
          key: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: null,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      );

      mockFeatureReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(event.aggregateId).toBe(featureId);
      expect(mockFeatureReadRepository.delete).toHaveBeenCalledWith(featureId);
    });

    it('should handle repository errors correctly', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new FeatureDeletedEvent(
        {
          aggregateId: featureId,
          aggregateType: 'FeatureAggregate',
          eventType: 'FeatureDeletedEvent',
        },
        {
          id: featureId,
          key: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: null,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      );

      const repositoryError = new Error('Database connection error');
      mockFeatureReadRepository.delete.mockRejectedValue(repositoryError);

      await expect(handler.handle(event)).rejects.toThrow(repositoryError);

      expect(mockFeatureReadRepository.delete).toHaveBeenCalledWith(featureId);
      expect(mockFeatureReadRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
