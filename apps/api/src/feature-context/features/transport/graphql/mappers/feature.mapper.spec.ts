import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import {
  FeatureResponseDto,
  PaginatedFeatureResultDto,
} from '@/feature-context/features/transport/graphql/dtos/responses/feature.response.dto';
import { FeatureGraphQLMapper } from '@/feature-context/features/transport/graphql/mappers/feature.mapper';

describe('FeatureGraphQLMapper', () => {
  let mapper: FeatureGraphQLMapper;

  beforeEach(() => {
    mapper = new FeatureGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should convert feature view model to response DTO with all properties', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
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

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });
    });

    it('should convert feature view model to response DTO with null description', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
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

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      });
    });

    it('should convert feature view model with DEPRECATED status to response DTO', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const viewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.DEPRECATED,
        createdAt,
        updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.DEPRECATED,
        createdAt,
        updatedAt,
      });
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should convert paginated result to paginated response DTO', () => {
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
        new FeatureViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          key: 'api-access',
          name: 'API Access',
          description: null,
          status: FeatureStatusEnum.INACTIVE,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 2, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result).toEqual({
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
          {
            id: '223e4567-e89b-12d3-a456-426614174001',
            key: 'api-access',
            name: 'API Access',
            description: null,
            status: FeatureStatusEnum.INACTIVE,
            createdAt,
            updatedAt,
          },
        ],
        total: 2,
        page: 1,
        perPage: 10,
        totalPages: 1,
      });
    });

    it('should convert empty paginated result to paginated response DTO', () => {
      const paginatedResult = new PaginatedResult([], 0, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result).toEqual({
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      });
    });

    it('should convert paginated result with multiple pages to paginated response DTO', () => {
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

      const paginatedResult = new PaginatedResult(viewModels, 25, 2, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result).toEqual({
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
        total: 25,
        page: 2,
        perPage: 10,
        totalPages: 3,
      });
    });
  });
});
