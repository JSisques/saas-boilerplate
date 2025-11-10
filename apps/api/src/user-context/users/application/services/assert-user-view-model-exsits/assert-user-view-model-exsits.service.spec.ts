import { UserNotFoundException } from '@/user-context/users/application/exceptions/user-not-found/user-not-found.exception';
import { AssertUserViewModelExsistsService } from '@/user-context/users/application/services/assert-user-view-model-exsits/assert-user-view-model-exsits.service';
import { IUserCreateViewModelDto } from '@/user-context/users/domain/dtos/view-models/user-create/user-create-view-model.dto';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserReadRepository } from '@/user-context/users/domain/repositories/user-read.repository';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';

describe('AssertUserViewModelExsistsService', () => {
  let service: AssertUserViewModelExsistsService;
  let mockUserReadRepository: jest.Mocked<UserReadRepository>;

  beforeEach(() => {
    mockUserReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    service = new AssertUserViewModelExsistsService(mockUserReadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return user view model when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
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

      mockUserReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(userId);

      expect(result).toBe(mockViewModel);
      expect(mockUserReadRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw UserNotFoundException when user view model does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      mockUserReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(userId)).rejects.toThrow(
        UserNotFoundException,
      );
      await expect(service.execute(userId)).rejects.toThrow(
        `User with id ${userId} not found`,
      );

      expect(mockUserReadRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserReadRepository.findById).toHaveBeenCalledTimes(2);
    });

    it('should call repository with correct id', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
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

      mockUserReadRepository.findById.mockResolvedValue(mockViewModel);

      await service.execute(userId);

      expect(mockUserReadRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return user view model with all properties correctly', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
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

      mockUserReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(userId);

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

    it('should throw UserNotFoundException with correct error message', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      mockUserReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(userId)).rejects.toThrow(
        UserNotFoundException,
      );
      await expect(service.execute(userId)).rejects.toThrow(
        `User with id ${userId} not found`,
      );

      expect(mockUserReadRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserReadRepository.findById).toHaveBeenCalledTimes(2);
    });

    it('should handle repository errors correctly', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockUserReadRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.execute(userId)).rejects.toThrow(repositoryError);

      expect(mockUserReadRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return user view model with different roles and statuses', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const testCases = [
        { role: UserRoleEnum.USER, status: UserStatusEnum.ACTIVE },
        { role: UserRoleEnum.ADMIN, status: UserStatusEnum.ACTIVE },
        { role: UserRoleEnum.USER, status: UserStatusEnum.INACTIVE },
        { role: UserRoleEnum.ADMIN, status: UserStatusEnum.INACTIVE },
      ];

      for (const testCase of testCases) {
        const mockViewModelDto: IUserCreateViewModelDto = {
          id: userId,
          userName: 'johndoe',
          name: 'John',
          lastName: 'Doe',
          role: testCase.role,
          status: testCase.status,
          bio: null,
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const mockViewModel = new UserViewModel(mockViewModelDto);

        mockUserReadRepository.findById.mockResolvedValue(mockViewModel);

        const result = await service.execute(userId);

        expect(result.role).toBe(testCase.role);
        expect(result.status).toBe(testCase.status);

        jest.clearAllMocks();
      }
    });
  });
});
