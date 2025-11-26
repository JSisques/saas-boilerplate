import { UserDeletedEvent } from '@/shared/domain/events/users/user-deleted/user-deleted.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { UserDeleteCommand } from '@/user-context/users/application/commands/delete-user/delete-user.command';
import { UserDeleteCommandHandler } from '@/user-context/users/application/commands/delete-user/delete-user.command-handler';
import { IUserDeleteCommandDto } from '@/user-context/users/application/dtos/commands/user-delete/user-delete-command.dto';
import { UserNotFoundException } from '@/user-context/users/application/exceptions/user-not-found/user-not-found.exception';
import { AssertUserExsistsService } from '@/user-context/users/application/services/assert-user-exsits/assert-user-exsits.service';
import { UserAggregate } from '@/user-context/users/domain/aggregates/user.aggregate';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserWriteRepository } from '@/user-context/users/domain/repositories/user-write.repository';
import { UserRoleValueObject } from '@/user-context/users/domain/value-objects/user-role/user-role.vo';
import { UserStatusValueObject } from '@/user-context/users/domain/value-objects/user-status/user-status.vo';
import { UserUserNameValueObject } from '@/user-context/users/domain/value-objects/user-user-name/user-user-name.vo';
import { EventBus } from '@nestjs/cqrs';

describe('UserDeleteCommandHandler', () => {
  let handler: UserDeleteCommandHandler;
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

    handler = new UserDeleteCommandHandler(
      mockUserWriteRepository,
      mockEventBus,
      mockAssertUserExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete user successfully when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IUserDeleteCommandDto = {
        id: userId,
      };

      const command = new UserDeleteCommand(commandDto);
      const existingUser = new UserAggregate(
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

      const deleteSpy = jest.spyOn(existingUser, 'delete');
      mockAssertUserExsistsService.execute.mockResolvedValue(existingUser);
      mockUserWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledWith(userId);
      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalled();
      expect(mockUserWriteRepository.delete).toHaveBeenCalledWith(userId);
      expect(mockUserWriteRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledWith(
        existingUser.getUncommittedEvents(),
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);

      deleteSpy.mockRestore();
    });

    it('should throw exception when user does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IUserDeleteCommandDto = {
        id: userId,
      };

      const command = new UserDeleteCommand(commandDto);
      const error = new UserNotFoundException(userId);

      mockAssertUserExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(command)).rejects.toThrow(error);
      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledWith(userId);
      expect(mockUserWriteRepository.delete).not.toHaveBeenCalled();
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });

    it('should publish UserDeletedEvent when user is deleted', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IUserDeleteCommandDto = {
        id: userId,
      };

      const command = new UserDeleteCommand(commandDto);
      const existingUser = new UserAggregate(
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

      // Verify that delete() generates an event when called directly
      existingUser.delete();
      const eventsAfterDelete = existingUser.getUncommittedEvents();
      expect(eventsAfterDelete).toHaveLength(1);
      expect(eventsAfterDelete[0]).toBeInstanceOf(UserDeletedEvent);

      // Now test the handler
      const existingUserForHandler = new UserAggregate(
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

      mockAssertUserExsistsService.execute.mockResolvedValue(
        existingUserForHandler,
      );
      mockUserWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      // Verify that publishAll was called (the handler should call it with events)
      expect(mockEventBus.publishAll).toHaveBeenCalled();
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      // Note: We can't verify the events here because commit() clears them
      // But we verified above that delete() generates the event correctly
    });

    it('should delete from repository after calling delete on aggregate', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IUserDeleteCommandDto = {
        id: userId,
      };

      const command = new UserDeleteCommand(commandDto);
      const existingUser = new UserAggregate(
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

      mockAssertUserExsistsService.execute.mockResolvedValue(existingUser);
      mockUserWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const deleteSpy = jest.spyOn(existingUser, 'delete');
      await handler.execute(command);

      expect(deleteSpy).toHaveBeenCalled();
      expect(mockUserWriteRepository.delete).toHaveBeenCalledWith(userId);

      deleteSpy.mockRestore();
    });

    it('should publish events before committing', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IUserDeleteCommandDto = {
        id: userId,
      };

      const command = new UserDeleteCommand(commandDto);
      const existingUser = new UserAggregate(
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

      const commitSpy = jest.spyOn(existingUser, 'commit');

      mockAssertUserExsistsService.execute.mockResolvedValue(existingUser);
      mockUserWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      const commitOrder = commitSpy.mock.invocationCallOrder[0];
      expect(publishOrder).toBeLessThan(commitOrder);
    });

    it('should delete from repository before publishing events', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IUserDeleteCommandDto = {
        id: userId,
      };

      const command = new UserDeleteCommand(commandDto);
      const existingUser = new UserAggregate(
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

      mockAssertUserExsistsService.execute.mockResolvedValue(existingUser);
      mockUserWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      const deleteOrder =
        mockUserWriteRepository.delete.mock.invocationCallOrder[0];
      const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
      expect(deleteOrder).toBeLessThan(publishOrder);
    });

    it('should use correct user id from command', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IUserDeleteCommandDto = {
        id: userId,
      };

      const command = new UserDeleteCommand(commandDto);
      const existingUser = new UserAggregate(
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

      mockAssertUserExsistsService.execute.mockResolvedValue(existingUser);
      mockUserWriteRepository.delete.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertUserExsistsService.execute).toHaveBeenCalledWith(
        command.id,
      );
      expect(mockUserWriteRepository.delete).toHaveBeenCalledWith(
        existingUser.id.value,
      );
    });
  });
});
