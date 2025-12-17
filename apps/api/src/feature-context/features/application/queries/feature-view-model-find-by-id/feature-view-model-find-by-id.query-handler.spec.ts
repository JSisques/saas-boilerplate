import { FeatureNotFoundException } from '@/feature-context/features/application/exceptions/feature-not-found/feature-not-found.exception';
import { AssertFeatureViewModelExistsService } from '@/feature-context/features/application/services/assert-feature-view-model-exists/assert-feature-view-model-exists.service';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { Test } from '@nestjs/testing';
import { FeatureViewModelFindByIdQuery } from './feature-view-model-find-by-id.query';
import { FeatureViewModelFindByIdQueryHandler } from './feature-view-model-find-by-id.query-handler';

describe('FeatureViewModelFindByIdQueryHandler', () => {
  let handler: FeatureViewModelFindByIdQueryHandler;
  let mockAssertFeatureViewModelExistsService: jest.Mocked<AssertFeatureViewModelExistsService>;

  beforeEach(async () => {
    mockAssertFeatureViewModelExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertFeatureViewModelExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FeatureViewModelFindByIdQueryHandler,
        {
          provide: AssertFeatureViewModelExistsService,
          useValue: mockAssertFeatureViewModelExistsService,
        },
      ],
    }).compile();

    handler = module.get<FeatureViewModelFindByIdQueryHandler>(
      FeatureViewModelFindByIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return feature view model when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FeatureViewModelFindByIdQuery({ id: featureId });
      const mockViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockAssertFeatureViewModelExistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(
        mockAssertFeatureViewModelExistsService.execute,
      ).toHaveBeenCalledWith(featureId);
      expect(
        mockAssertFeatureViewModelExistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw FeatureNotFoundException when feature does not exist', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FeatureViewModelFindByIdQuery({ id: featureId });
      const error = new FeatureNotFoundException(featureId);

      mockAssertFeatureViewModelExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
      expect(
        mockAssertFeatureViewModelExistsService.execute,
      ).toHaveBeenCalledWith(featureId);
      expect(
        mockAssertFeatureViewModelExistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return feature view model with all properties', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FeatureViewModelFindByIdQuery({ id: featureId });
      const mockViewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockAssertFeatureViewModelExistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(result.id).toBe(featureId);
      expect(result.key).toBe('advanced-analytics');
      expect(result.name).toBe('Advanced Analytics');
      expect(result.description).toBe(
        'This feature enables advanced analytics capabilities',
      );
      expect(result.status).toBe(FeatureStatusEnum.ACTIVE);
    });
  });
});
