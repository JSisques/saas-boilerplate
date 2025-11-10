import { UserUpdatedEventHandler } from './user-updated.event-handler';
import { UserUpdatedEvent } from '@/shared/domain/events/users/user-updated/user-updated.event';
import { UserReadRepository } from '@/user-context/users/domain/repositories/user-read.repository';
import { AssertUserViewModelExsistsService } from '@/user-context/users/application/services/assert-user-view-model-exsits/assert-user-view-model-exsits.service';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { UserRoleEnum } from '@/user-context/users/domain/enums/user-role/user-role.enum';
import { UserStatusEnum } from '@/user-context/users/domain/enums/user-status/user-status.enum';
import { UserNotFoundException } from '@/user-context/users/application/exceptions/user-not-found/user-not-found.exception';
import { IUserCreateViewModelDto } from '@/user-context/users/domain/dtos/view-models/user-create/user-create-view-model.dto';

describe('UserUpdatedEventHandler', () => {
  let handler: UserUpdatedEventHandler;
  let mockUserReadRepository: jest.Mocked<UserReadRepository>;
  let mockAssertUserViewModelExsistsService: jest.Mocked<AssertUserViewModelExsistsService>;

  beforeEach(() => {
    mockUserReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockAssertUserViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertUserViewModelExsistsService>;

    handler = new UserUpdatedEventHandler(
      mockUserReadRepository,
      mockAssertUserViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save user view model when event is handled', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        name: 'Jane',
        lastName: 'Smith',
      };

      const event = new UserUpdatedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserUpdatedEvent',
        },
        updateData,
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

      const updateSpy = jest.spyOn(existingViewModel, 'update');
      mockAssertUserViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockUserReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockAssertUserViewModelExsistsService.execute).toHaveBeenCalledWith(
        userId,
      );
      expect(mockAssertUserViewModelExsistsService.execute).toHaveBeenCalledTimes(
        1,
      );
      expect(updateSpy).toHaveBeenCalledWith(updateData);
      expect(mockUserReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
      expect(mockUserReadRepository.save).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });

    it('should throw exception when user view model does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        name: 'Jane',
      };

      const event = new UserUpdatedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserUpdatedEvent',
        },
        updateData,
      );

      const error = new UserNotFoundException(userId);

      mockAssertUserViewModelExsistsService.execute.mockRejectedValue(error);

      await expect(handler.handle(event)).rejects.toThrow(error);
      expect(mockAssertUserViewModelExsistsService.execute).toHaveBeenCalledWith(
        userId,
      );
      expect(mockUserReadRepository.save).not.toHaveBeenCalled();
    });

    it('should update only provided fields in view model', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        bio: 'Updated bio',
        avatarUrl: 'https://example.com/new-avatar.jpg',
      };

      const event = new UserUpdatedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserUpdatedEvent',
        },
        updateData,
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

      const updateSpy = jest.spyOn(existingViewModel, 'update');
      mockAssertUserViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockUserReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(updateSpy).toHaveBeenCalledWith(updateData);
      expect(existingViewModel.bio).toBe('Updated bio');
      expect(existingViewModel.avatarUrl).toBe(
        'https://example.com/new-avatar.jpg',
      );

      updateSpy.mockRestore();
    });

    it('should update role and status when provided', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
      };

      const event = new UserUpdatedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserUpdatedEvent',
        },
        updateData,
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

      const updateSpy = jest.spyOn(existingViewModel, 'update');
      mockAssertUserViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockUserReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(updateSpy).toHaveBeenCalledWith(updateData);
      expect(existingViewModel.role).toBe(UserRoleEnum.ADMIN);
      expect(existingViewModel.status).toBe(UserStatusEnum.INACTIVE);

      updateSpy.mockRestore();
    });

    it('should use correct aggregate id from event metadata', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        name: 'Jane',
      };

      const event = new UserUpdatedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserUpdatedEvent',
        },
        updateData,
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

      mockAssertUserViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockUserReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(event.aggregateId).toBe(userId);
      expect(mockAssertUserViewModelExsistsService.execute).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should save view model after updating it', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        name: 'Jane',
      };

      const event = new UserUpdatedEvent(
        {
          aggregateId: userId,
          aggregateType: 'UserAggregate',
          eventType: 'UserUpdatedEvent',
        },
        updateData,
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

      const updateSpy = jest.spyOn(existingViewModel, 'update');
      mockAssertUserViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockUserReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      const assertOrder =
        mockAssertUserViewModelExsistsService.execute.mock.invocationCallOrder[0];
      const updateOrder = updateSpy.mock.invocationCallOrder[0];
      const saveOrder = mockUserReadRepository.save.mock.invocationCallOrder[0];

      expect(assertOrder).toBeLessThan(updateOrder);
      expect(updateOrder).toBeLessThan(saveOrder);

      updateSpy.mockRestore();
    });
  });
});

