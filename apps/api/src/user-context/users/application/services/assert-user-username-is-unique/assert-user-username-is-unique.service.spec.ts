import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { UserUsernameIsNotUniqueException } from '@/user-context/users/application/exceptions/user-username-is-not-unique/user-username-is-not-unique.exception';
import { AssertUserUsernameIsUniqueService } from '@/user-context/users/application/services/assert-user-username-is-unique/assert-user-username-is-unique.service';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserWriteRepository } from '@/user-context/users/domain/repositories/user-write.repository';
import { UserCreatedAtValueObject } from '@/user-context/users/domain/value-objects/user-created-at/user-created-at.vo';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUpdatedAtValueObject } from '@/user-context/users/domain/value-objects/user-updated-at/user-updated-at.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';

describe('AssertUserUsernameIsUniqueService', () => {
  let service: AssertUserUsernameIsUniqueService;
  let mockUserWriteRepository: jest.Mocked<UserWriteRepository>;

  beforeEach(() => {
    mockUserWriteRepository = {
      findById: jest.fn(),
      findByUserName: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    service = new AssertUserUsernameIsUniqueService(mockUserWriteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should not throw when username is unique', async () => {
      const username = 'johndoe';

      mockUserWriteRepository.findByUserName.mockResolvedValue(null);

      await expect(service.execute(username)).resolves.toBeUndefined();

      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledWith(
        username,
      );
      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledTimes(1);
    });

    it('should throw UserUsernameIsNotUniqueException when username already exists', async () => {
      const username = 'johndoe';
      const existingUser = new UserAggregate(
        {
          id: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          userName: new UserUserNameValueObject(username),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new UserCreatedAtValueObject(new Date()),
          updatedAt: new UserUpdatedAtValueObject(new Date()),
        },
        false,
      );

      mockUserWriteRepository.findByUserName.mockResolvedValue(existingUser);

      await expect(service.execute(username)).rejects.toThrow(
        UserUsernameIsNotUniqueException,
      );
      await expect(service.execute(username)).rejects.toThrow(
        `Username ${username} is already taken`,
      );

      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledWith(
        username,
      );
      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledTimes(2);
    });

    it('should call repository with correct username', async () => {
      const username = 'johndoe';

      mockUserWriteRepository.findByUserName.mockResolvedValue(null);

      await service.execute(username);

      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledWith(
        username,
      );
      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledTimes(1);
    });

    it('should handle different usernames correctly', async () => {
      const username1 = 'johndoe';
      const username2 = 'janedoe';

      mockUserWriteRepository.findByUserName
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await expect(service.execute(username1)).resolves.toBeUndefined();
      await expect(service.execute(username2)).resolves.toBeUndefined();

      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledWith(
        username1,
      );
      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledWith(
        username2,
      );
      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledTimes(2);
    });

    it('should throw UserUsernameIsNotUniqueException with correct error message', async () => {
      const username = 'johndoe';
      const existingUser = new UserAggregate(
        {
          id: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          userName: new UserUserNameValueObject(username),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new UserCreatedAtValueObject(new Date()),
          updatedAt: new UserUpdatedAtValueObject(new Date()),
        },
        false,
      );

      mockUserWriteRepository.findByUserName.mockResolvedValue(existingUser);

      await expect(service.execute(username)).rejects.toThrow(
        UserUsernameIsNotUniqueException,
      );
      await expect(service.execute(username)).rejects.toThrow(
        `Username ${username} is already taken`,
      );

      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledWith(
        username,
      );
      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledTimes(2);
    });

    it('should handle repository errors correctly', async () => {
      const username = 'johndoe';
      const repositoryError = new Error('Database connection error');

      mockUserWriteRepository.findByUserName.mockRejectedValue(repositoryError);

      await expect(service.execute(username)).rejects.toThrow(repositoryError);

      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledWith(
        username,
      );
      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledTimes(1);
    });

    it('should not throw when username is unique for users with different statuses', async () => {
      const username = 'johndoe';

      mockUserWriteRepository.findByUserName.mockResolvedValue(null);

      await expect(service.execute(username)).resolves.toBeUndefined();

      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledWith(
        username,
      );
      expect(mockUserWriteRepository.findByUserName).toHaveBeenCalledTimes(1);
    });

    it('should throw exception regardless of user status or role', async () => {
      const username = 'johndoe';
      const testCases = [
        { role: UserRoleEnum.USER, status: UserStatusEnum.ACTIVE },
        { role: UserRoleEnum.ADMIN, status: UserStatusEnum.ACTIVE },
        { role: UserRoleEnum.USER, status: UserStatusEnum.INACTIVE },
        { role: UserRoleEnum.ADMIN, status: UserStatusEnum.INACTIVE },
      ];

      for (const testCase of testCases) {
        const existingUser = new UserAggregate(
          {
            id: new UserUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
            userName: new UserUserNameValueObject(username),
            role: new UserRoleValueObject(testCase.role),
            status: new UserStatusValueObject(testCase.status),
            createdAt: new UserCreatedAtValueObject(new Date()),
            updatedAt: new UserUpdatedAtValueObject(new Date()),
          },
          false,
        );

        mockUserWriteRepository.findByUserName.mockResolvedValue(existingUser);

        await expect(service.execute(username)).rejects.toThrow(
          UserUsernameIsNotUniqueException,
        );

        jest.clearAllMocks();
      }
    });
  });
});
