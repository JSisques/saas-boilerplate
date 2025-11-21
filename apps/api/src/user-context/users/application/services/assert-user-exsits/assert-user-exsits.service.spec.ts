import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { UserNotFoundException } from '@/user-context/users/application/exceptions/user-not-found/user-not-found.exception';
import { AssertUserExsistsService } from '@/user-context/users/application/services/assert-user-exsits/assert-user-exsits.service';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserWriteRepository } from '@/user-context/users/domain/repositories/user-write.repository';
import { UserAvatarUrlValueObject } from '@/user-context/users/domain/value-objects/user-avatar-url/user-avatar-url.vo';
import { UserBioValueObject } from '@/user-context/users/domain/value-objects/user-bio/user-bio.vo';
import { UserCreatedAtValueObject } from '@/user-context/users/domain/value-objects/user-created-at/user-created-at.vo';
import { UserLastNameValueObject } from '@/user-context/users/domain/value-objects/user-last-name/user-last-name.vo';
import { UserNameValueObject } from '@/user-context/users/domain/value-objects/user-name/user-name.vo';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUpdatedAtValueObject } from '@/user-context/users/domain/value-objects/user-updated-at/user-updated-at.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';

describe('AssertUserExsistsService', () => {
  let service: AssertUserExsistsService;
  let mockUserWriteRepository: jest.Mocked<UserWriteRepository>;

  beforeEach(() => {
    mockUserWriteRepository = {
      findById: jest.fn(),
      findByUserName: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    service = new AssertUserExsistsService(mockUserWriteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return user aggregate when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new UserCreatedAtValueObject(new Date()),
          updatedAt: new UserUpdatedAtValueObject(new Date()),
        },
        false,
      );

      mockUserWriteRepository.findById.mockResolvedValue(mockUser);

      const result = await service.execute(userId);

      expect(result).toBe(mockUser);
      expect(mockUserWriteRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw UserNotFoundException when user does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      mockUserWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(userId)).rejects.toThrow(
        UserNotFoundException,
      );
      await expect(service.execute(userId)).rejects.toThrow(
        `User with id ${userId} not found`,
      );

      expect(mockUserWriteRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserWriteRepository.findById).toHaveBeenCalledTimes(2);
    });

    it('should call repository with correct id', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new UserCreatedAtValueObject(new Date()),
          updatedAt: new UserUpdatedAtValueObject(new Date()),
        },
        false,
      );

      mockUserWriteRepository.findById.mockResolvedValue(mockUser);

      await service.execute(userId);

      expect(mockUserWriteRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return user aggregate with all properties when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          name: new UserNameValueObject('John'),
          lastName: new UserLastNameValueObject('Doe'),
          bio: new UserBioValueObject('Software developer'),
          avatarUrl: new UserAvatarUrlValueObject(
            'https://example.com/avatar.jpg',
          ),
          role: new UserRoleValueObject(UserRoleEnum.ADMIN),
          status: new UserStatusValueObject(UserStatusEnum.INACTIVE),
          createdAt: new UserCreatedAtValueObject(new Date()),
          updatedAt: new UserUpdatedAtValueObject(new Date()),
        },
        false,
      );

      mockUserWriteRepository.findById.mockResolvedValue(mockUser);

      const result = await service.execute(userId);

      expect(result).toBe(mockUser);
      expect(result.id.value).toBe(userId);
      expect(result.userName.value).toBe('johndoe');
      expect(result.name?.value).toBe('John');
      expect(result.lastName?.value).toBe('Doe');
      expect(result.bio?.value).toBe('Software developer');
      expect(result.avatarUrl?.value).toBe('https://example.com/avatar.jpg');
      expect(result.role.value).toBe(UserRoleEnum.ADMIN);
      expect(result.status.value).toBe(UserStatusEnum.INACTIVE);
    });

    it('should return user aggregate with minimal properties when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new UserCreatedAtValueObject(new Date()),
          updatedAt: new UserUpdatedAtValueObject(new Date()),
        },
        false,
      );

      mockUserWriteRepository.findById.mockResolvedValue(mockUser);

      const result = await service.execute(userId);

      expect(result).toBe(mockUser);
      expect(result.id.value).toBe(userId);
      expect(result.userName.value).toBe('johndoe');
      expect(result.name).toBeUndefined();
      expect(result.lastName).toBeUndefined();
      expect(result.bio).toBeUndefined();
      expect(result.avatarUrl).toBeUndefined();
      expect(result.role.value).toBe(UserRoleEnum.USER);
      expect(result.status.value).toBe(UserStatusEnum.ACTIVE);
    });

    it('should handle repository errors correctly', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockUserWriteRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.execute(userId)).rejects.toThrow(repositoryError);

      expect(mockUserWriteRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return user aggregate with different roles and statuses', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const testCases = [
        { role: UserRoleEnum.USER, status: UserStatusEnum.ACTIVE },
        { role: UserRoleEnum.ADMIN, status: UserStatusEnum.ACTIVE },
        { role: UserRoleEnum.USER, status: UserStatusEnum.INACTIVE },
        { role: UserRoleEnum.ADMIN, status: UserStatusEnum.INACTIVE },
      ];

      for (const testCase of testCases) {
        const mockUser = new UserAggregate(
          {
            id: new UserUuidValueObject(userId),
            userName: new UserUserNameValueObject('johndoe'),
            role: new UserRoleValueObject(testCase.role),
            status: new UserStatusValueObject(testCase.status),
            createdAt: new UserCreatedAtValueObject(new Date()),
            updatedAt: new UserUpdatedAtValueObject(new Date()),
          },
          false,
        );

        mockUserWriteRepository.findById.mockResolvedValue(mockUser);

        const result = await service.execute(userId);

        expect(result.role.value).toBe(testCase.role);
        expect(result.status.value).toBe(testCase.status);

        jest.clearAllMocks();
      }
    });
  });
});
