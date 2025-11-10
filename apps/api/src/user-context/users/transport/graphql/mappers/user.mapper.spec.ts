import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { UserGraphQLMapper } from '@/user-context/users/transport/graphql/mappers/user.mapper';
import { UserResponseDto } from '@/user-context/users/transport/graphql/dtos/responses/user.response.dto';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { IUserCreateViewModelDto } from '@/user-context/users/domain/dtos/view-models/user-create/user-create-view-model.dto';

describe('UserGraphQLMapper', () => {
  let mapper: UserGraphQLMapper;

  beforeEach(() => {
    mapper = new UserGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should convert user view model to response DTO with all properties', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };
      const viewModel = new UserViewModel(viewModelDto);

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
      });
    });

    it('should convert user view model to response DTO with null optional properties', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };
      const viewModel = new UserViewModel(viewModelDto);

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
      });
    });

    it('should convert user view model with ADMIN role and INACTIVE status', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      };
      const viewModel = new UserViewModel(viewModelDto);

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
      });
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should convert paginated result to paginated response DTO', () => {
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
        new UserViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          userName: 'janedoe',
          name: 'Jane',
          lastName: 'Doe',
          bio: null,
          avatarUrl: null,
          role: UserRoleEnum.USER,
          status: UserStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 2, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.items[0]).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
      });
      expect(result.items[1]).toEqual({
        id: '223e4567-e89b-12d3-a456-426614174001',
        userName: 'janedoe',
        name: 'Jane',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
      });
    });

    it('should convert empty paginated result to paginated response DTO', () => {
      const paginatedResult = new PaginatedResult<UserViewModel>([], 0, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(0);
    });

    it('should convert paginated result with pagination metadata', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: UserViewModel[] = Array.from({ length: 5 }, (_, i) =>
        new UserViewModel({
          id: `${i}e4567-e89b-12d3-a456-426614174000`,
          userName: `user${i}`,
          name: `Name${i}`,
          lastName: `Last${i}`,
          bio: null,
          avatarUrl: null,
          role: UserRoleEnum.USER,
          status: UserStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        }),
      );

      const paginatedResult = new PaginatedResult(viewModels, 25, 2, 5);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(5);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.perPage).toBe(5);
      expect(result.totalPages).toBe(5);
    });
  });
});

