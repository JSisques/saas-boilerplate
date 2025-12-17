import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import {
  FEATURE_READ_REPOSITORY_TOKEN,
  IFeatureReadRepository,
} from '@/feature-context/features/domain/repositories/feature-read.repository';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { Test } from '@nestjs/testing';
import { FindFeaturesByCriteriaQuery } from './find-features-by-criteria.query';
import { FindFeaturesByCriteriaQueryHandler } from './find-features-by-criteria.query-handler';

describe('FindFeaturesByCriteriaQueryHandler', () => {
  let handler: FindFeaturesByCriteriaQueryHandler;
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
        FindFeaturesByCriteriaQueryHandler,
        {
          provide: FEATURE_READ_REPOSITORY_TOKEN,
          useValue: mockFeatureReadRepository,
        },
      ],
    }).compile();

    handler = module.get<FindFeaturesByCriteriaQueryHandler>(
      FindFeaturesByCriteriaQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated result when features exist', async () => {
      const criteria = new Criteria();
      const query = new FindFeaturesByCriteriaQuery(criteria);
      const mockViewModels = [
        new FeatureViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          key: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: 'This feature enables advanced analytics capabilities',
          status: FeatureStatusEnum.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new FeatureViewModel({
          id: '123e4567-e89b-12d3-a456-426614174001',
          key: 'api-access',
          name: 'API Access',
          description: null,
          status: FeatureStatusEnum.INACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];
      const mockPaginatedResult = new PaginatedResult<FeatureViewModel>(
        mockViewModels,
        2,
        1,
        10,
      );

      mockFeatureReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockFeatureReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockFeatureReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });

    it('should return empty paginated result when no features exist', async () => {
      const criteria = new Criteria();
      const query = new FindFeaturesByCriteriaQuery(criteria);
      const mockPaginatedResult = new PaginatedResult<FeatureViewModel>(
        [],
        0,
        1,
        10,
      );

      mockFeatureReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(mockFeatureReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
    });

    it('should pass criteria to repository', async () => {
      const criteria = new Criteria(
        [
          {
            field: 'status',
            operator: FilterOperator.EQUALS,
            value: FeatureStatusEnum.ACTIVE,
          },
        ],
        [{ field: 'name', direction: SortDirection.ASC }],
        { page: 2, perPage: 20 },
      );
      const query = new FindFeaturesByCriteriaQuery(criteria);
      const mockPaginatedResult = new PaginatedResult<FeatureViewModel>(
        [],
        0,
        2,
        20,
      );

      mockFeatureReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      await handler.execute(query);

      expect(mockFeatureReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockFeatureReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors correctly', async () => {
      const criteria = new Criteria();
      const query = new FindFeaturesByCriteriaQuery(criteria);
      const repositoryError = new Error('Database connection error');

      mockFeatureReadRepository.findByCriteria.mockRejectedValue(
        repositoryError,
      );

      await expect(handler.execute(query)).rejects.toThrow(repositoryError);

      expect(mockFeatureReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockFeatureReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });
  });
});
