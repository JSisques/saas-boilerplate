import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { IUserFindByIdQueryDto } from '@/user-context/users/application/dtos/queries/user-find-by-id/user-find-by-id-query.dto';
import { UserNotFoundException } from '@/user-context/users/application/exceptions/user-not-found/user-not-found.exception';
import { UserViewModelFindByIdQuery } from '@/user-context/users/application/queries/user-view-model-find-by-id/user-view-model-find-by-id.query';
import { UserViewModelFindByIdQueryHandler } from '@/user-context/users/application/queries/user-view-model-find-by-id/user-view-model-find-by-id.query-handler';
import { AssertUserViewModelExsistsService } from '@/user-context/users/application/services/assert-user-view-model-exsits/assert-user-view-model-exsits.service';
import { IUserCreateViewModelDto } from '@/user-context/users/domain/dtos/view-models/user-create/user-create-view-model.dto';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';

describe('UserViewModelFindByIdQueryHandler', () => {
  let handler: UserViewModelFindByIdQueryHandler;
  let mockAssertUserViewModelExsistsService: Partial<
    jest.Mocked<AssertUserViewModelExsistsService>
  >;

  beforeEach(() => {
    mockAssertUserViewModelExsistsService = {
      execute: jest.fn(),
    } as Partial<jest.Mocked<AssertUserViewModelExsistsService>>;

    handler = new UserViewModelFindByIdQueryHandler(
      mockAssertUserViewModelExsistsService as unknown as AssertUserViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return user view model when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IUserFindByIdQueryDto = { id: userId };
      const query = new UserViewModelFindByIdQuery(queryDto);

      const mockViewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        bio: null,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockViewModel = new UserViewModel(mockViewModelDto);

      mockAssertUserViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(
        mockAssertUserViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(userId);
      expect(
        mockAssertUserViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when user does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IUserFindByIdQueryDto = { id: userId };
      const query = new UserViewModelFindByIdQuery(queryDto);

      const error = new UserNotFoundException(userId);
      mockAssertUserViewModelExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
      await expect(handler.execute(query)).rejects.toThrow(
        `User with id ${userId} not found`,
      );

      expect(
        mockAssertUserViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(userId);
      expect(
        mockAssertUserViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(2);
    });

    it('should call service with correct id from query', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IUserFindByIdQueryDto = { id: userId };
      const query = new UserViewModelFindByIdQuery(queryDto);

      const mockViewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        bio: null,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockViewModel = new UserViewModel(mockViewModelDto);

      mockAssertUserViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      await handler.execute(query);

      expect(
        mockAssertUserViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(query.id.value);
      expect(query.id).toBeInstanceOf(UserUuidValueObject);
      expect(query.id.value).toBe(userId);
    });

    it('should return user view model with all properties correctly', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IUserFindByIdQueryDto = { id: userId };
      const query = new UserViewModelFindByIdQuery(queryDto);

      const mockViewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };
      const mockViewModel = new UserViewModel(mockViewModelDto);

      mockAssertUserViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(result.id).toBe(userId);
      expect(result.userName).toBe('johndoe');
      expect(result.name).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.role).toBe(UserRoleEnum.ADMIN);
      expect(result.status).toBe(UserStatusEnum.INACTIVE);
      expect(result.bio).toBe('Software developer');
      expect(result.avatarUrl).toBe('https://example.com/avatar.jpg');
    });

    it('should return user view model with minimal properties when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IUserFindByIdQueryDto = { id: userId };
      const query = new UserViewModelFindByIdQuery(queryDto);

      const mockViewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: null,
        lastName: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        bio: null,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockViewModel = new UserViewModel(mockViewModelDto);

      mockAssertUserViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(result.id).toBe(userId);
      expect(result.userName).toBe('johndoe');
      expect(result.name).toBeNull();
      expect(result.lastName).toBeNull();
      expect(result.bio).toBeNull();
      expect(result.avatarUrl).toBeNull();
      expect(result.role).toBe(UserRoleEnum.USER);
      expect(result.status).toBe(UserStatusEnum.ACTIVE);
    });

    it('should propagate repository errors correctly', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IUserFindByIdQueryDto = { id: userId };
      const query = new UserViewModelFindByIdQuery(queryDto);

      const repositoryError = new Error('Database connection error');
      mockAssertUserViewModelExsistsService.execute.mockRejectedValue(
        repositoryError,
      );

      await expect(handler.execute(query)).rejects.toThrow(repositoryError);

      expect(
        mockAssertUserViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(userId);
      expect(
        mockAssertUserViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
