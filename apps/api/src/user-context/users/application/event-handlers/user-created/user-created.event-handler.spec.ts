import { UserCreatedEvent } from '@/shared/domain/events/users/user-created/user-created.event';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserViewModelFactory } from '@/user-context/users/domain/factories/user-view-model/user-view-model.factory';
import { UserPrimitives } from '@/user-context/users/domain/primitives/user.primitives';
import { UserReadRepository } from '@/user-context/users/domain/repositories/user-read.repository';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { UserCreatedEventHandler } from './user-created.event-handler';

describe('UserCreatedEventHandler', () => {
  let handler: UserCreatedEventHandler;
  let mockUserReadRepository: jest.Mocked<UserReadRepository>;
  let mockUserViewModelFactory: jest.Mocked<UserViewModelFactory>;

  beforeEach(() => {
    mockUserReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockUserViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<UserViewModelFactory>;

    handler = new UserCreatedEventHandler(
      mockUserReadRepository,
      mockUserViewModelFactory,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save user view model when event is handled', async () => {
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new UserCreatedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserCreatedEvent',
        },
        userPrimitives,
      );

      const mockViewModel = new UserViewModel({
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
      });

      mockUserViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockUserReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockUserViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        userPrimitives,
      );
      expect(mockUserViewModelFactory.fromPrimitives).toHaveBeenCalledTimes(1);
      expect(mockUserReadRepository.save).toHaveBeenCalledWith(mockViewModel);
      expect(mockUserReadRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle event with all user properties', async () => {
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new UserCreatedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserCreatedEvent',
        },
        userPrimitives,
      );

      const mockViewModel = new UserViewModel({
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
      });

      mockUserViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockUserReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockUserViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        userPrimitives,
      );
      expect(mockUserReadRepository.save).toHaveBeenCalledWith(mockViewModel);
    });

    it('should handle event with minimal user data', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const userPrimitives: UserPrimitives = {
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

      const event = new UserCreatedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserCreatedEvent',
        },
        userPrimitives,
      );

      const mockViewModel = new UserViewModel({
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
      });

      mockUserViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockUserReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockUserViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        userPrimitives,
      );
      expect(mockUserReadRepository.save).toHaveBeenCalledWith(mockViewModel);
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new UserCreatedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserCreatedEvent',
        },
        userPrimitives,
      );

      const mockViewModel = new UserViewModel({
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
      });

      mockUserViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockUserReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(event.aggregateId).toBe(userId);
      expect(event.data.id).toBe(userId);
    });

    it('should save view model after creating it', async () => {
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new UserCreatedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserCreatedEvent',
        },
        userPrimitives,
      );

      const mockViewModel = new UserViewModel({
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
      });

      mockUserViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockUserReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const createOrder =
        mockUserViewModelFactory.fromPrimitives.mock.invocationCallOrder[0];
      const saveOrder = mockUserReadRepository.save.mock.invocationCallOrder[0];
      expect(createOrder).toBeLessThan(saveOrder);
    });
  });
});
