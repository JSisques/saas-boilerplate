import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { UserUpdatedEvent } from '@/shared/domain/events/users/user-updated/user-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { IUserUpdateCommandDto } from '@/user-context/users/application/dtos/commands/user-update/user-update-command.dto';
import { UserNotFoundException } from '@/user-context/users/application/exceptions/user-not-found/user-not-found.exception';
import { AssertUserExsistsService } from '@/user-context/users/application/services/assert-user-exsits/assert-user-exsits.service';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserWriteRepository } from '@/user-context/users/domain/repositories/user-write.repository';
import { UserNameValueObject } from '@/user-context/users/domain/value-objects/user-name/user-name.vo';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';
import { EventBus } from '@nestjs/cqrs';
import { UserUpdateCommand } from './user-update.command';
import { UserUpdateCommandHandler } from './user-update.command-handler';

describe('UserUpdateCommandHandler', () => {
  let handler: UserUpdateCommandHandler;
  let mockUserWriteRepository: jest.Mocked<UserWriteRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockAssertUserExsistsService: jest.Mocked<AssertUserExsistsService>;

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

    mockAssertUserExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertUserExsistsService>;

    handler = new UserUpdateCommandHandler(
      mockUserWriteRepository,
      mockEventBus,
      mockAssertUserExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update user successfully when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: IUserUpdateCommandDto = {
        id: userId,
        name: 'Jane',
      };

      const command = new UserUpdateCommand(commandDto);
      const existingUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const updateSpy = jest.spyOn(existingUser, 'update');
      mockAssertUserExsistsService.execute.mockResolvedValue(existingUser);
      mockUserWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledWith(userId);
      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalled();
      expect(mockUserWriteRepository.save).toHaveBeenCalledWith(existingUser);
      expect(mockUserWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });

    it('should throw exception when user does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IUserUpdateCommandDto = {
        id: userId,
        name: 'Jane',
      };

      const command = new UserUpdateCommand(commandDto);
      const error = new UserNotFoundException(userId);

      mockAssertUserExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledWith(userId);
      expect(mockUserWriteRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IUserUpdateCommandDto = {
        id: userId,
        name: 'Jane',
        bio: 'Updated bio',
      };

      const command = new UserUpdateCommand(commandDto);
      const now = new Date();
      const existingUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const updateSpy = jest.spyOn(existingUser, 'update');
      mockAssertUserExsistsService.execute.mockResolvedValue(existingUser);
      mockUserWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(updateSpy).toHaveBeenCalled();
      const updateCall = updateSpy.mock.calls[0][0];
      expect(updateCall).toHaveProperty('name');
      expect(updateCall).toHaveProperty('bio');
      expect(updateCall).not.toHaveProperty('id');

      updateSpy.mockRestore();
    });

    it('should exclude id from update data', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const commandDto: IUserUpdateCommandDto = {
        id: userId,
        name: 'Jane',
      };

      const command = new UserUpdateCommand(commandDto);
      const existingUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const updateSpy = jest.spyOn(existingUser, 'update');
      mockAssertUserExsistsService.execute.mockResolvedValue(existingUser);
      mockUserWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const updateCall = updateSpy.mock.calls[0][0];
      expect(updateCall).not.toHaveProperty('id');

      updateSpy.mockRestore();
    });

    it('should publish UserUpdatedEvent when user is updated', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IUserUpdateCommandDto = {
        id: userId,
        name: 'Jane',
      };

      const command = new UserUpdateCommand(commandDto);
      const now = new Date();

      // Verify that update() generates an event when called directly
      const testUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      testUser.update({ name: new UserNameValueObject('Jane') });
      const eventsAfterUpdate = testUser.getUncommittedEvents();
      expect(eventsAfterUpdate).toHaveLength(1);
      expect(eventsAfterUpdate[0]).toBeInstanceOf(UserUpdatedEvent);

      // Now test the handler
      const existingUserForHandler = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertUserExsistsService.execute.mockResolvedValue(
        existingUserForHandler,
      );
      mockUserWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      // Verify that publishAll was called (the handler should call it with events)
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      // Note: We can't verify the events here because commit() clears them
      // But we verified above that update() generates the event correctly
    });

    it('should save user before publishing events', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: IUserUpdateCommandDto = {
        id: userId,
        name: 'Jane',
      };

      const command = new UserUpdateCommand(commandDto);
      const existingUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertUserExsistsService.execute.mockResolvedValue(existingUser);
      mockUserWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const saveOrder =
        mockUserWriteRepository.save.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(saveOrder).toBeLessThan(publishOrder);
    });

    it('should commit events after publishing', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const commandDto: IUserUpdateCommandDto = {
        id: userId,
        name: 'Jane',
      };

      const command = new UserUpdateCommand(commandDto);
      const existingUser = new UserAggregate(
        {
          id: new UserUuidValueObject(userId),
          userName: new UserUserNameValueObject('johndoe'),
          role: new UserRoleValueObject(UserRoleEnum.USER),
          status: new UserStatusValueObject(UserStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const commitSpy = jest.spyOn(existingUser, 'commit');

      mockAssertUserExsistsService.execute.mockResolvedValue(existingUser);
      mockUserWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(commitSpy).toHaveBeenCalled();
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      const commitOrder = commitSpy.mock.invocationCallOrder[0];
      expect(publishOrder).toBeLessThan(commitOrder);

      commitSpy.mockRestore();
    });
  });
});
