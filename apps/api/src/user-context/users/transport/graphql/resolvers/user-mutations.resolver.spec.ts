import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { UserDeleteCommand } from '@/user-context/users/application/commands/delete-user/delete-user.command';
import { UserCreateCommand } from '@/user-context/users/application/commands/user-create/user-create.command';
import { UserUpdateCommand } from '@/user-context/users/application/commands/user-update/user-update.command';
import { CreateUserRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/create-user.request.dto';
import { DeleteUserRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/delete-user.request.dto';
import { UpdateUserRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/update-user.request.dto';
import { CommandBus } from '@nestjs/cqrs';
import { UserMutationsResolver } from './user-mutations.resolver';

describe('UserMutationsResolver', () => {
  let resolver: UserMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new UserMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const input: CreateUserRequestDto = {
        name: 'John',
        lastName: 'Doe',
        bio: 'Software developer',
        avatarUrl: 'https://example.com/avatar.jpg',
        userName: 'johndoe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'User created successfully',
        id: userId,
      };

      mockCommandBus.execute.mockResolvedValue(userId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.createUser(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(UserCreateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(UserCreateCommand);
      expect(command.name?.value).toBe('John');
      expect(command.lastName?.value).toBe('Doe');
      expect(command.bio?.value).toBe('Software developer');
      expect(command.avatarUrl?.value).toBe('https://example.com/avatar.jpg');
      expect(command.userName?.value).toBe('johndoe');
      expect(command.role?.value).toBe(UserRoleEnum.USER);
      expect(command.status?.value).toBe(UserStatusEnum.ACTIVE);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'User created successfully',
        id: userId,
      });
    });

    it('should create user with minimal properties', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const input: CreateUserRequestDto = {
        name: '',
        lastName: '',
        bio: '',
        avatarUrl: '',
        userName: 'johndoe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'User created successfully',
        id: userId,
      };

      mockCommandBus.execute.mockResolvedValue(userId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.createUser(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(UserCreateCommand),
      );
    });

    it('should handle errors from command bus', async () => {
      const input: CreateUserRequestDto = {
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        userName: 'johndoe',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
      };

      const error = new Error('Username already exists');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.createUser(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(UserCreateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UpdateUserRequestDto = {
        id: userId,
        name: 'Jane',
        lastName: 'Smith',
        bio: 'Updated bio',
        avatarUrl: 'https://example.com/new-avatar.jpg',
        userName: 'janesmith',
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'User updated successfully',
        id: userId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.updateUser(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(UserUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(UserUpdateCommand);
      expect(command.id.value).toBe(userId);
      expect(command.name?.value).toBe('Jane');
      expect(command.lastName?.value).toBe('Smith');
      expect(command.bio?.value).toBe('Updated bio');
      expect(command.avatarUrl?.value).toBe(
        'https://example.com/new-avatar.jpg',
      );
      expect(command.userName?.value).toBe('janesmith');
      expect(command.role?.value).toBe(UserRoleEnum.ADMIN);
      expect(command.status?.value).toBe(UserStatusEnum.INACTIVE);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'User updated successfully',
        id: userId,
      });
    });

    it('should update user with partial data', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UpdateUserRequestDto = {
        id: userId,
        name: 'Jane',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'User updated successfully',
        id: userId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.updateUser(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(UserUpdateCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.id.value).toBe(userId);
      expect(command.name?.value).toBe('Jane');
    });

    it('should handle errors from command bus', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UpdateUserRequestDto = {
        id: userId,
        name: 'Jane',
      };

      const error = new Error('User not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.updateUser(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(UserUpdateCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const input: DeleteUserRequestDto = {
        id: userId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'User deleted successfully',
        id: userId,
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.deleteUser(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(UserDeleteCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(UserDeleteCommand);
      expect(command.id).toBe(userId);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'User deleted successfully',
        id: userId,
      });
    });

    it('should handle errors from command bus', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const input: DeleteUserRequestDto = {
        id: userId,
      };

      const error = new Error('User not found');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.deleteUser(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(UserDeleteCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
