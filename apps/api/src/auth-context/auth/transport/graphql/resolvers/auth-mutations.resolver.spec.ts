import { AuthLoginByEmailCommand } from '@/auth-context/auth/application/commands/auth-login-by-email/auth-login-by-email.command';
import { AuthRegisterByEmailCommand } from '@/auth-context/auth/application/commands/auth-register-by-email/auth-register-by-email.command';
import { AuthLoginByEmailRequestDto } from '@/auth-context/auth/transport/graphql/dtos/requests/auth-login-by-email.request.dto';
import { AuthRegisterByEmailRequestDto } from '@/auth-context/auth/transport/graphql/dtos/requests/auth-register-by-email.request.dto';
import { LoginResponseDto } from '@/auth-context/auth/transport/graphql/dtos/responses/login.response.dto';
import { AuthMutationsResolver } from '@/auth-context/auth/transport/graphql/resolvers/auth-mutations.resolver';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { UpdateUserRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/update-user.request.dto';
import { CommandBus } from '@nestjs/cqrs';

describe('AuthMutationsResolver', () => {
  let resolver: AuthMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new AuthMutationsResolver(
      mockCommandBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginByEmail', () => {
    it('should login user by email and return tokens', async () => {
      const input: AuthLoginByEmailRequestDto = {
        email: 'test@example.com',
        password: 'SecureP@ssw0rd123',
      };

      const tokens: LoginResponseDto = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockCommandBus.execute.mockResolvedValue(tokens);

      const result = await resolver.loginByEmail(input);

      expect(result).toBe(tokens);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(AuthLoginByEmailCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(AuthLoginByEmailCommand);
      expect(command.email.value).toBe('test@example.com');
      expect(command.password.value).toBe('SecureP@ssw0rd123');
    });

    it('should handle login with different email', async () => {
      const input: AuthLoginByEmailRequestDto = {
        email: 'another@example.com',
        password: 'DifferentP@ssw0rd456',
      };

      const tokens: LoginResponseDto = {
        accessToken: 'another-access-token',
        refreshToken: 'another-refresh-token',
      };

      mockCommandBus.execute.mockResolvedValue(tokens);

      const result = await resolver.loginByEmail(input);

      expect(result).toBe(tokens);
      expect(mockCommandBus.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('registerByEmail', () => {
    it('should register user by email and return success response', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const input: AuthRegisterByEmailRequestDto = {
        email: 'newuser@example.com',
        password: 'SecureP@ssw0rd789',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Auth registered successfully',
        id: authId,
      };

      mockCommandBus.execute.mockResolvedValue(authId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.registerByEmail(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(AuthRegisterByEmailCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(AuthRegisterByEmailCommand);
      expect(command.email.value).toBe('newuser@example.com');
      expect(command.password.value).toBe('SecureP@ssw0rd789');
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Auth registered successfully',
        id: authId,
      });
    });

    it('should handle registration with different email', async () => {
      const authId = '223e4567-e89b-12d3-a456-426614174001';
      const input: AuthRegisterByEmailRequestDto = {
        email: 'another@example.com',
        password: 'AnotherP@ssw0rd321',
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'Auth registered successfully',
        id: authId,
      };

      mockCommandBus.execute.mockResolvedValue(authId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.registerByEmail(input);

      expect(result).toBe(mutationResponse);
      expect(mockCommandBus.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('should logout user and return success response', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const input: UpdateUserRequestDto = {
        id: userId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'User updated successfully',
        id: userId,
      };

      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.logout(input);

      expect(result).toBe(mutationResponse);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'User updated successfully',
        id: userId,
      });
    });

    it('should handle logout with different user id', async () => {
      const userId = '323e4567-e89b-12d3-a456-426614174002';
      const input: UpdateUserRequestDto = {
        id: userId,
      };

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'User updated successfully',
        id: userId,
      };

      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.logout(input);

      expect(result).toBe(mutationResponse);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
