import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { UserCreatedEvent } from '@/shared/domain/events/users/user-created/user-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { IUserCreateCommandDto } from '@/user-context/users/application/dtos/commands/user-create/user-create-command.dto';
import { UserUsernameIsNotUniqueException } from '@/user-context/users/application/exceptions/user-username-is-not-unique/user-username-is-not-unique.exception';
import { AssertUserUsernameIsUniqueService } from '@/user-context/users/application/services/assert-user-username-is-unique/assert-user-username-is-unique.service';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserAggregateFactory } from '@/user-context/users/domain/factories/user-aggregate/user-aggregate.factory';
import { UserWriteRepository } from '@/user-context/users/domain/repositories/user-write.repository';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';
import { EventBus } from '@nestjs/cqrs';
import { UserCreateCommand } from './user-create.command';
import { UserCreateCommandHandler } from './user-create.command-handler';

describe('UserCreateCommandHandler', () => {
  let handler: UserCreateCommandHandler;
  let mockUserWriteRepository: jest.Mocked<UserWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockUserAggregateFactory: jest.Mocked<UserAggregateFactory>;
  let mockAssertUserUsernameIsUniqueService: jest.Mocked<AssertUserUsernameIsUniqueService>;

  beforeEach(() => {
    mockUserWriteRepository = {
      findById: jest.fn(),
      findByUserName: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    mockUserAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<UserAggregateFactory>;

    mockAssertUserUsernameIsUniqueService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertUserUsernameIsUniqueService>;

    handler = new UserCreateCommandHandler(
      mockUserWriteRepository,
      mockEventBus,
      mockUserAggregateFactory,
      mockAssertUserUsernameIsUniqueService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create user successfully when username is unique', async () => {
      const commandDto: IUserCreateCommandDto = {
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
      };

      const command = new UserCreateCommand(commandDto);
      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertUserUsernameIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockUserAggregateFactory.create.mockReturnValue(mockUser);
      mockUserWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockUser.id.value);
      expect(
        mockAssertUserUsernameIsUniqueService.execute,
      ).toHaveBeenCalledWith('johndoe');
      expect(
        mockAssertUserUsernameIsUniqueService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(mockUserAggregateFactory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: command.id,
          userName: command.userName,
          name: command.name,
          lastName: command.lastName,
          bio: command.bio,
          avatarUrl: command.avatarUrl,
          role: command.role,
          status: command.status,
        }),
      );
      const createCall = mockUserAggregateFactory.create.mock.calls[0][0];
      expect(createCall.createdAt).toBeInstanceOf(DateValueObject);
      expect(createCall.updatedAt).toBeInstanceOf(DateValueObject);
      expect(createCall.createdAt.value.getTime()).toBe(
        createCall.updatedAt.value.getTime(),
      );
      expect(mockUserWriteRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockUserWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        mockUser.getUncommittedEvents(),
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
    });

    it('should create user successfully when username is null', async () => {
      const commandDto: IUserCreateCommandDto = {
        userName: null,
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
      };

      const command = new UserCreateCommand(commandDto);
      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(),
          userName: null,
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockUserAggregateFactory.create.mockReturnValue(mockUser);
      mockUserWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(mockUser.id.value);
      expect(
        mockAssertUserUsernameIsUniqueService.execute,
      ).not.toHaveBeenCalled();
      expect(mockUserAggregateFactory.create).toHaveBeenCalled();
      expect(mockUserWriteRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
    });

    it('should throw exception when username is not unique', async () => {
      const commandDto: IUserCreateCommandDto = {
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
      };

      const command = new UserCreateCommand(commandDto);
      const error = new UserUsernameIsNotUniqueException('johndoe');

      mockAssertUserUsernameIsUniqueService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(
        mockAssertUserUsernameIsUniqueService.execute,
      ).toHaveBeenCalledWith('johndoe');
      expect(mockUserAggregateFactory.create).not.toHaveBeenCalled();
      expect(mockUserWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish UserCreatedEvent when user is created', async () => {
      const commandDto: IUserCreateCommandDto = {
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
      };

      const command = new UserCreateCommand(commandDto);
      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertUserUsernameIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockUserAggregateFactory.create.mockReturnValue(mockUser);
      mockUserWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const uncommittedEvents = mockUser.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(UserCreatedEvent);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(uncommittedEvents);
    });

    it('should save user before publishing events', async () => {
      const commandDto: IUserCreateCommandDto = {
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
      };

      const command = new UserCreateCommand(commandDto);
      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertUserUsernameIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockUserAggregateFactory.create.mockReturnValue(mockUser);
      mockUserWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockUserWriteRepository.save.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(saveOrder).toBeLessThan(publishOrder);
    });

    it('should return the created user id', async () => {
      const commandDto: IUserCreateCommandDto = {
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
      };

      const command = new UserCreateCommand(commandDto);
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        true,
      );

      mockAssertUserUsernameIsUniqueService.execute.mockResolvedValue(
        undefined,
      );
      mockUserAggregateFactory.create.mockReturnValue(mockUser);
      mockUserWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(userId);
    });
  });
});
