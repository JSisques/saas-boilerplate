import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { FindTenantMembersByCriteriaQuery } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-criteria/tenant-member-find-by-criteria.query';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { TenantMemberFindByCriteriaRequestDto } from '@/tenant-context/tenant-members/transport/graphql/dtos/requests/tenant-member-find-by-criteria.request.dto';
import { TenantMemberGraphQLMapper } from '@/tenant-context/tenant-members/transport/graphql/mappers/tenant-member.mapper';
import { QueryBus } from '@nestjs/cqrs';
import { TenantMemberQueryResolver } from './tenant-member-queries.resolver';

describe('TenantMemberQueryResolver', () => {
  let resolver: TenantMemberQueryResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockTenantMemberGraphQLMapper: jest.Mocked<TenantMemberGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockTenantMemberGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberGraphQLMapper>;

    resolver = new TenantMemberQueryResolver(
      mockQueryBus,
      mockTenantMemberGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('tenantMemberFindByCriteria', () => {
    it('should return paginated tenant members when criteria matches', async () => {
      const input: TenantMemberFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: TenantMemberViewModel[] = [
        new TenantMemberViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.MEMBER,
          createdAt,
          updatedAt,
        }),
        new TenantMemberViewModel({
          id: '423e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '523e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.ADMIN,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult<TenantMemberViewModel>(
        viewModels,
        2,
        1,
        10,
      );

      const paginatedResponseDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            tenantId: '223e4567-e89b-12d3-a456-426614174000',
            userId: '323e4567-e89b-12d3-a456-426614174000',
            role: TenantMemberRoleEnum.MEMBER,
            createdAt,
            updatedAt,
          },
          {
            id: '423e4567-e89b-12d3-a456-426614174000',
            tenantId: '223e4567-e89b-12d3-a456-426614174000',
            userId: '523e4567-e89b-12d3-a456-426614174000',
            role: TenantMemberRoleEnum.ADMIN,
            createdAt,
            updatedAt,
          },
        ],
        total: 2,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockTenantMemberGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.tenantMemberFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
      const executedQuery = mockQueryBus.execute.mock
        .calls[0][0] as FindTenantMembersByCriteriaQuery;
      expect(executedQuery).toBeInstanceOf(FindTenantMembersByCriteriaQuery);
      expect(executedQuery.criteria).toBeInstanceOf(Criteria);
      expect(
        mockTenantMemberGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
    });

    it('should return empty paginated result when no tenant members match criteria', async () => {
      const input: TenantMemberFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const paginatedResult = new PaginatedResult<TenantMemberViewModel>(
        [],
        0,
        1,
        10,
      );

      const paginatedResponseDto = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockTenantMemberGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.tenantMemberFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle criteria with filters', async () => {
      const input: TenantMemberFindByCriteriaRequestDto = {
        filters: [
          {
            field: 'role',
            operator: FilterOperator.EQUALS,
            value: TenantMemberRoleEnum.ADMIN,
          },
        ],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: TenantMemberViewModel[] = [
        new TenantMemberViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.ADMIN,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult<TenantMemberViewModel>(
        viewModels,
        1,
        1,
        10,
      );

      const paginatedResponseDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            tenantId: '223e4567-e89b-12d3-a456-426614174000',
            userId: '323e4567-e89b-12d3-a456-426614174000',
            role: TenantMemberRoleEnum.ADMIN,
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
      mockTenantMemberGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.tenantMemberFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].role).toBe(TenantMemberRoleEnum.ADMIN);
    });

    it('should handle criteria with pagination', async () => {
      const input: TenantMemberFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 2, perPage: 5 },
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: TenantMemberViewModel[] = [
        new TenantMemberViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.MEMBER,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult<TenantMemberViewModel>(
        viewModels,
        25,
        2,
        5,
      );

      const paginatedResponseDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            tenantId: '223e4567-e89b-12d3-a456-426614174000',
            userId: '323e4567-e89b-12d3-a456-426614174000',
            role: TenantMemberRoleEnum.MEMBER,
            createdAt,
            updatedAt,
          },
        ],
        total: 25,
        page: 2,
        perPage: 5,
        totalPages: 5,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockTenantMemberGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.tenantMemberFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(result.page).toBe(2);
      expect(result.perPage).toBe(5);
      expect(result.totalPages).toBe(5);
    });

    it('should handle undefined input', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: TenantMemberViewModel[] = [
        new TenantMemberViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.MEMBER,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult<TenantMemberViewModel>(
        viewModels,
        1,
        1,
        10,
      );

      const paginatedResponseDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            tenantId: '223e4567-e89b-12d3-a456-426614174000',
            userId: '323e4567-e89b-12d3-a456-426614174000',
            role: TenantMemberRoleEnum.MEMBER,
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
      mockTenantMemberGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.tenantMemberFindByCriteria(undefined);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
      const executedQuery = mockQueryBus.execute.mock
        .calls[0][0] as FindTenantMembersByCriteriaQuery;
      expect(executedQuery.criteria).toBeInstanceOf(Criteria);
    });

    it('should handle errors from query bus', async () => {
      const input: TenantMemberFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const error = new Error('Database connection error');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.tenantMemberFindByCriteria(input)).rejects.toThrow(
        error,
      );
      expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
      expect(
        mockTenantMemberGraphQLMapper.toPaginatedResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
