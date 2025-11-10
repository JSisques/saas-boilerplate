import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { FindUsersByCriteriaQuery } from '@/user-context/users/application/queries/find-users-by-criteria/find-users-by-criteria.query';
import { FindUsersByCriteriaQueryHandler } from '@/user-context/users/application/queries/find-users-by-criteria/find-users-by-criteria.query-handler';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserReadRepository } from '@/user-context/users/domain/repositories/user-read.repository';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';

describe('FindUsersByCriteriaQueryHandler', () => {
  let handler: FindUsersByCriteriaQueryHandler;
  let mockUserReadRepository: jest.Mocked<UserReadRepository>;

  beforeEach(() => {
    mockUserReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    handler = new FindUsersByCriteriaQueryHandler(mockUserReadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated result with users when criteria matches', async () => {
      const criteria = new Criteria();
      const query = new FindUsersByCriteriaQuery(criteria);

      const mockUsers: UserViewModel[] = [
        new UserViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          userName: 'johndoe',
          name: 'John',
          lastName: 'Doe',
          role: UserRoleEnum.USER,
          status: UserStatusEnum.ACTIVE,
          bio: null,
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new UserViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          userName: 'janedoe',
          name: 'Jane',
          lastName: 'Doe',
          role: UserRoleEnum.USER,
          status: UserStatusEnum.ACTIVE,
          bio: null,
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      const mockPaginatedResult = new PaginatedResult(mockUsers, 2, 1, 10);

      mockUserReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockUserReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockUserReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });

    it('should return empty paginated result when no users match criteria', async () => {
      const criteria = new Criteria();
      const query = new FindUsersByCriteriaQuery(criteria);

      const mockPaginatedResult = new PaginatedResult<UserViewModel>(
        [],
        0,
        1,
        10,
      );

      mockUserReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockUserReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockUserReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });

    it('should call repository with correct criteria', async () => {
      const criteria = new Criteria([], [], { page: 2, perPage: 20 });
      const query = new FindUsersByCriteriaQuery(criteria);

      const mockPaginatedResult = new PaginatedResult<UserViewModel>(
        [],
        0,
        2,
        20,
      );

      mockUserReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      await handler.execute(query);

      expect(mockUserReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockUserReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });

    it('should handle pagination correctly', async () => {
      const criteria = new Criteria([], [], { page: 3, perPage: 5 });
      const query = new FindUsersByCriteriaQuery(criteria);

      const mockUsers: UserViewModel[] = Array.from(
        { length: 5 },
        (_, i) =>
          new UserViewModel({
            id: `${i}e4567-e89b-12d3-a456-426614174000`,
            userName: `user${i}`,
            name: `Name${i}`,
            lastName: `Last${i}`,
            role: UserRoleEnum.USER,
            status: UserStatusEnum.ACTIVE,
            bio: null,
            avatarUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
      );

      const mockPaginatedResult = new PaginatedResult(mockUsers, 15, 3, 5);

      mockUserReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result.items).toHaveLength(5);
      expect(result.total).toBe(15);
      expect(result.page).toBe(3);
      expect(result.perPage).toBe(5);
      expect(result.totalPages).toBe(3);
    });

    it('should pass criteria with filters when provided', async () => {
      const filters = [
        {
          field: 'status',
          operator: FilterOperator.EQUALS,
          value: UserStatusEnum.ACTIVE,
        },
      ];
      const criteria = new Criteria(filters);
      const query = new FindUsersByCriteriaQuery(criteria);

      const mockPaginatedResult = new PaginatedResult<UserViewModel>(
        [],
        0,
        1,
        10,
      );

      mockUserReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      await handler.execute(query);

      expect(mockUserReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(criteria.filters).toHaveLength(1);
      expect(criteria.filters[0].field).toBe('status');
    });

    it('should pass criteria with sorts when provided', async () => {
      const sorts = [{ field: 'userName', direction: SortDirection.ASC }];
      const criteria = new Criteria([], sorts);
      const query = new FindUsersByCriteriaQuery(criteria);

      const mockPaginatedResult = new PaginatedResult<UserViewModel>(
        [],
        0,
        1,
        10,
      );

      mockUserReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      await handler.execute(query);

      expect(mockUserReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(criteria.sorts).toHaveLength(1);
      expect(criteria.sorts[0].field).toBe('userName');
      expect(criteria.sorts[0].direction).toBe(SortDirection.ASC);
    });

    it('should handle repository errors correctly', async () => {
      const criteria = new Criteria();
      const query = new FindUsersByCriteriaQuery(criteria);

      const repositoryError = new Error('Database connection error');
      mockUserReadRepository.findByCriteria.mockRejectedValue(
        repositoryError,
      );

      await expect(handler.execute(query)).rejects.toThrow(repositoryError);

      expect(mockUserReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockUserReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });

    it('should handle criteria with multiple filters and sorts', async () => {
      const filters = [
        {
          field: 'status',
          operator: FilterOperator.EQUALS,
          value: UserStatusEnum.ACTIVE,
        },
        {
          field: 'role',
          operator: FilterOperator.EQUALS,
          value: UserRoleEnum.USER,
        },
      ];
      const sorts = [
        { field: 'userName', direction: SortDirection.ASC },
        { field: 'createdAt', direction: SortDirection.DESC },
      ];
      const criteria = new Criteria(filters, sorts, { page: 1, perPage: 10 });
      const query = new FindUsersByCriteriaQuery(criteria);

      const mockPaginatedResult = new PaginatedResult<UserViewModel>(
        [],
        0,
        1,
        10,
      );

      mockUserReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      await handler.execute(query);

      expect(mockUserReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(criteria.filters).toHaveLength(2);
      expect(criteria.sorts).toHaveLength(2);
    });

    it('should return correct pagination metadata', async () => {
      const criteria = new Criteria([], [], { page: 2, perPage: 5 });
      const query = new FindUsersByCriteriaQuery(criteria);

      const mockUsers: UserViewModel[] = Array.from(
        { length: 5 },
        (_, i) =>
          new UserViewModel({
            id: `${i}e4567-e89b-12d3-a456-426614174000`,
            userName: `user${i}`,
            name: `Name${i}`,
            lastName: `Last${i}`,
            role: UserRoleEnum.USER,
            status: UserStatusEnum.ACTIVE,
            bio: null,
            avatarUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
      );

      const mockPaginatedResult = new PaginatedResult(mockUsers, 25, 2, 5);

      mockUserReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result.items).toHaveLength(5);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.perPage).toBe(5);
      expect(result.totalPages).toBe(5);
    });
  });
});
