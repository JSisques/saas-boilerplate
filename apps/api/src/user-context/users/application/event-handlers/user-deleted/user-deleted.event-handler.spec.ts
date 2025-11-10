import { UserDeletedEventHandler } from './user-deleted.event-handler';
import { UserDeletedEvent } from '@/shared/domain/events/users/user-deleted/user-deleted.event';
import { UserReadRepository } from '@/user-context/users/domain/repositories/user-read.repository';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { UserNotFoundException } from '@/user-context/users/application/exceptions/user-not-found/user-not-found.exception';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { IUserCreateViewModelDto } from '@/user-context/users/domain/dtos/view-models/user-create/user-create-view-model.dto';
import { UserPrimitives } from '@/user-context/users/domain/primitives/user.primitives';

describe('UserDeletedEventHandler', () => {
  let handler: UserDeletedEventHandler;
  let mockUserReadRepository: jest.Mocked<UserReadRepository>;

  beforeEach(() => {
    mockUserReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    handler = new UserDeletedEventHandler(mockUserReadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete user view model when event is handled', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const userPrimitives: UserPrimitives = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        bio: null,
        avatarUrl: null,
      };

      const event = new UserDeletedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserDeletedEvent',
        },
        userPrimitives,
      );

      const existingViewModelDto: IUserCreateViewModelDto = {
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

      const existingViewModel = new UserViewModel(existingViewModelDto);

      mockUserReadRepository.findById.mockResolvedValue(existingViewModel);
      mockUserReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockUserReadRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserReadRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockUserReadRepository.delete).toHaveBeenCalledWith(userId);
      expect(mockUserReadRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when user view model does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const userPrimitives: UserPrimitives = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        bio: null,
        avatarUrl: null,
      };

      const event = new UserDeletedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserDeletedEvent',
        },
        userPrimitives,
      );

      mockUserReadRepository.findById.mockResolvedValue(null);

      await expect(handler.handle(event)).rejects.toThrow(
        UserNotFoundException,
      );
      await expect(handler.handle(event)).rejects.toThrow(
        `User with id ${userId} not found`,
      );

      expect(mockUserReadRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserReadRepository.delete).not.toHaveBeenCalled();
    });

    it('should use correct aggregate id from event metadata', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const userPrimitives: UserPrimitives = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        bio: null,
        avatarUrl: null,
      };

      const event = new UserDeletedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserDeletedEvent',
        },
        userPrimitives,
      );

      const existingViewModelDto: IUserCreateViewModelDto = {
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

      const existingViewModel = new UserViewModel(existingViewModelDto);

      mockUserReadRepository.findById.mockResolvedValue(existingViewModel);
      mockUserReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(event.aggregateId).toBe(userId);
      expect(mockUserReadRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserReadRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should delete view model after finding it', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const userPrimitives: UserPrimitives = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        bio: null,
        avatarUrl: null,
      };

      const event = new UserDeletedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserDeletedEvent',
        },
        userPrimitives,
      );

      const existingViewModelDto: IUserCreateViewModelDto = {
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

      const existingViewModel = new UserViewModel(existingViewModelDto);

      mockUserReadRepository.findById.mockResolvedValue(existingViewModel);
      mockUserReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      const findOrder = mockUserReadRepository.findById.mock.invocationCallOrder[0];
      const deleteOrder = mockUserReadRepository.delete.mock.invocationCallOrder[0];
      expect(findOrder).toBeLessThan(deleteOrder);
    });

    it('should delete view model with correct id', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const userPrimitives: UserPrimitives = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        bio: null,
        avatarUrl: null,
      };

      const event = new UserDeletedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserDeletedEvent',
        },
        userPrimitives,
      );

      const existingViewModelDto: IUserCreateViewModelDto = {
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

      const existingViewModel = new UserViewModel(existingViewModelDto);

      mockUserReadRepository.findById.mockResolvedValue(existingViewModel);
      mockUserReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockUserReadRepository.delete).toHaveBeenCalledWith(
        existingViewModel.id,
      );
      expect(existingViewModel.id).toBe(userId);
    });

    it('should handle deletion for user with all properties', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const userPrimitives: UserPrimitives = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
      };

      const event = new UserDeletedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserDeletedEvent',
        },
        userPrimitives,
      );

      const existingViewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const existingViewModel = new UserViewModel(existingViewModelDto);

      mockUserReadRepository.findById.mockResolvedValue(existingViewModel);
      mockUserReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockUserReadRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserReadRepository.delete).toHaveBeenCalledWith(userId);
    });
  });
});

