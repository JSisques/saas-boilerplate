import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FindUsersByCriteriaQuery } from '@/user-context/users/application/queries/find-users-by-criteria/find-users-by-criteria.query';
import { UserViewModelFindByIdQuery } from '@/user-context/users/application/queries/user-view-model-find-by-id/user-view-model-find-by-id.query';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { UserFindByCriteriaRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/user-find-by-criteria.request.dto';
import { UserFindByIdRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/user-find-by-id.request.dto';
import { PaginatedUserResultDto } from '@/user-context/users/transport/graphql/dtos/responses/user.response.dto';
import { UserGraphQLMapper } from '@/user-context/users/transport/graphql/mappers/user.mapper';
import { QueryBus } from '@nestjs/cqrs';
import { UserQueryResolver } from './user-queries.resolver';

describe('UserQueryResolver', () => {
  let resolver: UserQueryResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockUserGraphQLMapper: jest.Mocked<UserGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockUserGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<UserGraphQLMapper>;

    resolver = new UserQueryResolver(mockQueryBus, mockUserGraphQLMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('usersFindByCriteria', () => {
    it('should return paginated users when criteria matches', async () => {
      const input: UserFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: UserViewModel[] = [
        new UserViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          userName: 'johndoe',
          name: 'John',
          lastName: 'Doe',
          bio: null,
          avatarUrl: null,
          role: UserRoleEnum.USER,
          status: UserStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedUserResultDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            userName: 'johndoe',
            name: 'John',
            lastName: 'Doe',
            bio: null,
            avatarUrl: null,
            role: UserRoleEnum.USER,
            status: UserStatusEnum.ACTIVE,
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockUserGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.usersFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindUsersByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindUsersByCriteriaQuery);
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(mockUserGraphQLMapper.toPaginatedResponseDto).toHaveBeenCalledWith(
        paginatedResult,
      );
    });

    it('should return paginated users when input is undefined', async () => {
      const viewModels: UserViewModel[] = [];
      const paginatedResult = new PaginatedResult(viewModels, 0, 1, 10);
      const paginatedResponseDto: PaginatedUserResultDto = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockUserGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.usersFindByCriteria(undefined);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindUsersByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(mockUserGraphQLMapper.toPaginatedResponseDto).toHaveBeenCalledWith(
        paginatedResult,
      );
    });

    it('should handle criteria with filters and sorts', async () => {
      const input: UserFindByCriteriaRequestDto = {
        filters: [
          {
            field: 'status',
            operator: 'eq' as any,
            value: UserStatusEnum.ACTIVE,
          },
        ],
        sorts: [{ field: 'userName', direction: 'ASC' as any }],
        pagination: { page: 1, perPage: 10 },
      };

      const paginatedResult = new PaginatedResult<UserViewModel>([], 0, 1, 10);
      const paginatedResponseDto: PaginatedUserResultDto = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockUserGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      await resolver.usersFindByCriteria(input);

      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query.criteria.filters).toHaveLength(1);
      expect(query.criteria.sorts).toHaveLength(1);
      expect(query.criteria.pagination.page).toBe(1);
      expect(query.criteria.pagination.perPage).toBe(10);
    });
  });

  describe('userFindById', () => {
    it('should return user when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UserFindByIdRequestDto = {
        id: userId,
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModel = new UserViewModel({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });

      const responseDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockUserGraphQLMapper.toResponseDto.mockReturnValue(responseDto as any);

      const result = await resolver.userFindById(input);

      expect(result).toBe(responseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(UserViewModelFindByIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(UserViewModelFindByIdQuery);
      expect(query.id.value).toBe(userId);
      expect(mockUserGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
        viewModel,
      );
    });

    it('should handle errors from query bus', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UserFindByIdRequestDto = {
        id: userId,
      };

      const error = new Error('User not found');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.userFindById(input)).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(UserViewModelFindByIdQuery),
      );
      expect(mockUserGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
    });
  });
});
