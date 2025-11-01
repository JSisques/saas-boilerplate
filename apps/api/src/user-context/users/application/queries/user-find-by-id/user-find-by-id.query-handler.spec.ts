import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { IUserFindByIdQueryDto } from '@/user-context/users/application/dtos/queries/user-find-by-id/user-find-by-id-query.dto';
import { UserFindByIdQuery } from '@/user-context/users/application/queries/user-find-by-id/user-find-by-id.query';
import { UserFindByIdQueryHandler } from '@/user-context/users/application/queries/user-find-by-id/user-find-by-id.query-handler';
import { AssertUserExsistsService } from '@/user-context/users/application/services/assert-user-exsits/assert-user-exsits.service';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
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

      const error = new Error('User not found');
      mockAssertUserExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);

      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledWith(userId);
      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledTimes(1);
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
  });
});
