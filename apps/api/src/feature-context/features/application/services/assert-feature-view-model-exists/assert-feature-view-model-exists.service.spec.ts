import { FeatureNotFoundException } from '@/feature-context/features/application/exceptions/feature-not-found/feature-not-found.exception';
import { AssertFeatureViewModelExistsService } from '@/feature-context/features/application/services/assert-feature-view-model-exists/assert-feature-view-model-exists.service';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import {
  FEATURE_READ_REPOSITORY_TOKEN,
  IFeatureReadRepository,
} from '@/feature-context/features/domain/repositories/feature-read.repository';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { Test } from '@nestjs/testing';

describe('AssertFeatureViewModelExistsService', () => {
  let service: AssertFeatureViewModelExistsService;
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
        AssertFeatureViewModelExistsService,
        {
          provide: FEATURE_READ_REPOSITORY_TOKEN,
          useValue: mockFeatureReadRepository,
        },
      ],
    }).compile();

    service = module.get<AssertFeatureViewModelExistsService>(
      AssertFeatureViewModelExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return feature view model when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const mockViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockFeatureReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(featureId);

      expect(result).toBe(mockViewModel);
      expect(mockFeatureReadRepository.findById).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockFeatureReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw FeatureNotFoundException when feature does not exist', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';

      mockFeatureReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(featureId)).rejects.toThrow(
        FeatureNotFoundException,
      );
      await expect(service.execute(featureId)).rejects.toThrow(
        `Feature with id ${featureId} not found`,
      );

      expect(mockFeatureReadRepository.findById).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockFeatureReadRepository.findById).toHaveBeenCalledTimes(2);
    });

    it('should call repository with correct id', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const mockViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockFeatureReadRepository.findById.mockResolvedValue(mockViewModel);

      await service.execute(featureId);

      expect(mockFeatureReadRepository.findById).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockFeatureReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return feature view model with all properties when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const mockViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockFeatureReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(featureId);

      expect(result).toBe(mockViewModel);
      expect(result.id).toBe(featureId);
      expect(result.key).toBe('advanced-analytics');
      expect(result.name).toBe('Advanced Analytics');
      expect(result.description).toBe(
        'This feature enables advanced analytics capabilities',
      );
      expect(result.status).toBe(FeatureStatusEnum.ACTIVE);
    });

    it('should return feature view model with null description when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const mockViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockFeatureReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(featureId);

      expect(result).toBe(mockViewModel);
      expect(result.id).toBe(featureId);
      expect(result.description).toBeNull();
      expect(result.status).toBe(FeatureStatusEnum.INACTIVE);
    });

    it('should handle repository errors correctly', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockFeatureReadRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.execute(featureId)).rejects.toThrow(repositoryError);

      expect(mockFeatureReadRepository.findById).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockFeatureReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return feature view model with different statuses', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const testCases = [
        FeatureStatusEnum.ACTIVE,
        FeatureStatusEnum.INACTIVE,
        FeatureStatusEnum.DEPRECATED,
      ];

      for (const status of testCases) {
        const mockViewModel = new FeatureViewModel({
          id: featureId,
          key: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: null,
          status: status,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        mockFeatureReadRepository.findById.mockResolvedValue(mockViewModel);

        const result = await service.execute(featureId);

        expect(result.status).toBe(status);

        jest.clearAllMocks();
      }
    });
  });
});
