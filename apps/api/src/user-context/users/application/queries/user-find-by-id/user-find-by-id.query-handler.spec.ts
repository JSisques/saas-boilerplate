import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { IUserFindByIdQueryDto } from '@/user-context/users/application/dtos/queries/user-find-by-id/user-find-by-id-query.dto';
import { UserNotFoundException } from '@/user-context/users/application/exceptions/user-not-found/user-not-found.exception';
import { UserFindByIdQuery } from '@/user-context/users/application/queries/user-find-by-id/user-find-by-id.query';
import { UserFindByIdQueryHandler } from '@/user-context/users/application/queries/user-find-by-id/user-find-by-id.query-handler';
import { AssertUserExsistsService } from '@/user-context/users/application/services/assert-user-exsits/assert-user-exsits.service';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserAvatarUrlValueObject } from '@/user-context/users/domain/value-objects/user-avatar-url/user-avatar-url.vo';
import { UserBioValueObject } from '@/user-context/users/domain/value-objects/user-bio/user-bio.vo';
import { UserLastNameValueObject } from '@/user-context/users/domain/value-objects/user-last-name/user-last-name.vo';
import { UserNameValueObject } from '@/user-context/users/domain/value-objects/user-name/user-name.vo';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';

describe('UserFindByIdQueryHandler', () => {
  let handler: UserFindByIdQueryHandler;
  let mockAssertUserExsistsService: Partial<
    jest.Mocked<AssertUserExsistsService>
  >;

  beforeEach(() => {
    mockAssertUserExsistsService = {
      execute: jest.fn(),
    } as Partial<jest.Mocked<AssertUserExsistsService>>;

    handler = new UserFindByIdQueryHandler(
      mockAssertUserExsistsService as unknown as AssertUserExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return user aggregate when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IUserFindByIdQueryDto = { id: userId };
      const query = new UserFindByIdQuery(queryDto);

      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockAssertUserExsistsService.execute.mockResolvedValue(mockUser);

      const result = await handler.execute(query);

      expect(result).toBe(mockUser);
      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledWith(userId);
      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when user does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IUserFindByIdQueryDto = { id: userId };
      const query = new UserFindByIdQuery(queryDto);

      const error = new UserNotFoundException(userId);
      mockAssertUserExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
      await expect(handler.execute(query)).rejects.toThrow(
        `User with id ${userId} not found`,
      );

      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledWith(userId);
      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledTimes(2);
    });

    it('should call service with correct id from query', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IUserFindByIdQueryDto = { id: userId };
      const query = new UserFindByIdQuery(queryDto);

      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockAssertUserExsistsService.execute.mockResolvedValue(mockUser);

      await handler.execute(query);

      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledWith(
        query.id.value,
      );
      expect(query.id).toBeInstanceOf(UserUuidValueObject);
      expect(query.id.value).toBe(userId);
    });

    it('should return user aggregate with all properties when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IUserFindByIdQueryDto = { id: userId };
      const query = new UserFindByIdQuery(queryDto);

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
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockAssertUserExsistsService.execute.mockResolvedValue(mockUser);

      const result = await handler.execute(query);

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
      const queryDto: IUserFindByIdQueryDto = { id: userId };
      const query = new UserFindByIdQuery(queryDto);

      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockAssertUserExsistsService.execute.mockResolvedValue(mockUser);

      const result = await handler.execute(query);

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

    it('should propagate repository errors correctly', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IUserFindByIdQueryDto = { id: userId };
      const query = new UserFindByIdQuery(queryDto);

      const repositoryError = new Error('Database connection error');
      mockAssertUserExsistsService.execute.mockRejectedValue(repositoryError);

      await expect(handler.execute(query)).rejects.toThrow(repositoryError);

      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledWith(userId);
      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledTimes(1);
    });
  });
});
