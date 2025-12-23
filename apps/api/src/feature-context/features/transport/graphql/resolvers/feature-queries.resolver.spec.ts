import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureViewModelFindByIdQuery } from '@/feature-context/features/application/queries/feature-view-model-find-by-id/feature-view-model-find-by-id.query';
import { FindFeaturesByCriteriaQuery } from '@/feature-context/features/application/queries/find-features-by-criteria/find-features-by-criteria.query';
import { FeatureFindByCriteriaRequestDto } from '@/feature-context/features/transport/graphql/dtos/requests/feature-find-by-criteria.request.dto';
import { FeatureFindByIdRequestDto } from '@/feature-context/features/transport/graphql/dtos/requests/feature-find-by-id.request.dto';
import {
  FeatureResponseDto,
  PaginatedFeatureResultDto,
} from '@/feature-context/features/transport/graphql/dtos/responses/feature.response.dto';
import { FeatureGraphQLMapper } from '@/feature-context/features/transport/graphql/mappers/feature.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { QueryBus } from '@nestjs/cqrs';
import { FeatureQueriesResolver } from './feature-queries.resolver';

describe('FeatureQueriesResolver', () => {
  let resolver: FeatureQueriesResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockFeatureGraphQLMapper: jest.Mocked<FeatureGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockFeatureGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<FeatureGraphQLMapper>;

    resolver = new FeatureQueriesResolver(
      mockQueryBus,
      mockFeatureGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('featuresFindByCriteria', () => {
    it('should return paginated features when criteria matches', async () => {
      const input: FeatureFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: FeatureViewModel[] = [
        new FeatureViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          key: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: 'This feature enables advanced analytics capabilities',
          status: FeatureStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedFeatureResultDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            key: 'advanced-analytics',
            name: 'Advanced Analytics',
            description: 'This feature enables advanced analytics capabilities',
            status: FeatureStatusEnum.ACTIVE,
            createdAt,
            updatedAt,
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockFeatureGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.featuresFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindFeaturesByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindFeaturesByCriteriaQuery);
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(
        mockFeatureGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
    });

    it('should return empty paginated result when no features match criteria', async () => {
      const input: FeatureFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const paginatedResult = new PaginatedResult<FeatureViewModel>(
        [],
        0,
        1,
        10,
      );
      const paginatedResponseDto: PaginatedFeatureResultDto = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockFeatureGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.featuresFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle null input', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: FeatureViewModel[] = [
        new FeatureViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          key: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: null,
          status: FeatureStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedFeatureResultDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            key: 'advanced-analytics',
            name: 'Advanced Analytics',
            description: null,
            status: FeatureStatusEnum.ACTIVE,
            createdAt,
            updatedAt,
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockFeatureGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.featuresFindByCriteria(undefined);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindFeaturesByCriteriaQuery),
      );
    });

    it('should handle errors from query bus', async () => {
      const input: FeatureFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const error = new Error('Database connection error');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.featuresFindByCriteria(input)).rejects.toThrow(
        error,
      );
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindFeaturesByCriteriaQuery),
      );
      expect(
        mockFeatureGraphQLMapper.toPaginatedResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('featureFindById', () => {
    it('should return feature when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: FeatureFindByIdRequestDto = {
        id: featureId,
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });

      const responseDto: FeatureResponseDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockFeatureGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

      const result = await resolver.featureFindById(input);

      expect(result).toBe(responseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FeatureViewModelFindByIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FeatureViewModelFindByIdQuery);
      expect(query.id.value).toBe(featureId);
      expect(mockFeatureGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
        viewModel,
      );
    });

    it('should return feature with null description', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: FeatureFindByIdRequestDto = {
        id: featureId,
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      });

      const responseDto: FeatureResponseDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockFeatureGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

      const result = await resolver.featureFindById(input);

      expect(result).toBe(responseDto);
      expect(result.description).toBeNull();
    });

    it('should handle errors from query bus', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const input: FeatureFindByIdRequestDto = {
        id: featureId,
      };

      const error = new Error('Feature not found');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.featureFindById(input)).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FeatureViewModelFindByIdQuery),
      );
      expect(mockFeatureGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
    });
  });
});
