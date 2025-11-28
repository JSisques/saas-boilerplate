import { AuthLoginByEmailCommand } from '@/auth-context/auth/application/commands/auth-login-by-email/auth-login-by-email.command';
import { AuthRefreshTokenCommand } from '@/auth-context/auth/application/commands/auth-refresh-token/auth-refresh-token.command';
import { AuthRegisterByEmailCommand } from '@/auth-context/auth/application/commands/auth-register-by-email/auth-register-by-email.command';
import { Public } from '@/auth-context/auth/infrastructure/decorators/public/public.decorator';
import { AuthLoginByEmailRequestDto } from '@/auth-context/auth/transport/graphql/dtos/requests/auth-login-by-email.request.dto';
import { AuthRefreshTokenRequestDto } from '@/auth-context/auth/transport/graphql/dtos/requests/auth-refresh-token.request.dto';
import { AuthRegisterByEmailRequestDto } from '@/auth-context/auth/transport/graphql/dtos/requests/auth-register-by-email.request.dto';
import { LoginResponseDto } from '@/auth-context/auth/transport/graphql/dtos/responses/login.response.dto';
import { RefreshTokenResponseDto } from '@/auth-context/auth/transport/graphql/dtos/responses/refresh-token.response.dto';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { UpdateUserRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/update-user.request.dto';
import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
@Public()
export class AuthMutationsResolver {
  private readonly logger = new Logger(AuthMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  @Mutation(() => LoginResponseDto)
  async loginByEmail(
    @Args('input') input: AuthLoginByEmailRequestDto,
  ): Promise<LoginResponseDto> {
    this.logger.log(`Login by email for email: ${input.email}`);

    // 01: Send the command to the command bus
    const tokens = await this.commandBus.execute(
      new AuthLoginByEmailCommand({
        email: input.email,
        password: input.password,
      }),
    );

    // 02: Return tokens
    return tokens;
  }

  @Mutation(() => MutationResponseDto)
  async registerByEmail(
    @Args('input') input: AuthRegisterByEmailRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Register by email for email: ${input.email}`);

    // 01: Send the command to the command bus
    const registeredAuthId = await this.commandBus.execute(
      new AuthRegisterByEmailCommand({
        email: input.email,
        password: input.password,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Auth registered successfully',
      id: registeredAuthId,
    });
  }

  @Mutation(() => RefreshTokenResponseDto)
  async refreshToken(
    @Args('input') input: AuthRefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    this.logger.log('Refresh token requested');

    // 01: Send the command to the command bus
    const newAccessToken = await this.commandBus.execute(
      new AuthRefreshTokenCommand({
        refreshToken: input.refreshToken,
      }),
    );

    // 02: Return new access token
    return {
      accessToken: newAccessToken,
    };
  }

  @Mutation(() => MutationResponseDto)
  async logout(
    @Args('input') input: UpdateUserRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Logout for id: ${input.id}`);

    // 01: Send the command to the command bus
    // await this.commandBus.execute(
    //   new AuthLogoutCommand({
    //     id: input.id,
    //     name: input.name,
    //     bio: input.bio,
    //     avatarUrl: input.avatarUrl,
    //     lastName: input.lastName,
    //     role: input.role,
    //     status: input.status,
    //     userName: input.userName,
    //   }),
    // );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'User updated successfully',
      id: input.id,
    });
  }
}
