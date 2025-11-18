import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { OwnerGuard } from '@/auth-context/auth/infrastructure/guards/owner.guard';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles.guard';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { UserDeleteCommand } from '@/user-context/users/application/commands/delete-user/delete-user.command';
import { UserCreateCommand } from '@/user-context/users/application/commands/user-create/user-create.command';
import { UserUpdateCommand } from '@/user-context/users/application/commands/user-update/user-update.command';
import { CreateUserRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/create-user.request.dto';
import { DeleteUserRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/delete-user.request.dto';
import { UpdateUserRequestDto } from '@/user-context/users/transport/graphql/dtos/requests/update-user.request.dto';
import { UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRoleEnum } from '@prisma/client';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserMutationsResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  @Mutation(() => MutationResponseDto)
  @Roles(UserRoleEnum.ADMIN)
  async createUser(
    @Args('input') input: CreateUserRequestDto,
  ): Promise<MutationResponseDto> {
    // 01: Send the command to the command bus
    const createdUserId = await this.commandBus.execute(
      new UserCreateCommand({
        name: input.name,
        bio: input.bio,
        avatarUrl: input.avatarUrl,
        lastName: input.lastName,
        role: input.role,
        userName: input.userName,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'User created successfully',
      id: createdUserId,
    });
  }

  @Mutation(() => MutationResponseDto)
  @UseGuards(OwnerGuard)
  async updateUser(
    @Args('input') input: UpdateUserRequestDto,
  ): Promise<MutationResponseDto> {
    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new UserUpdateCommand({
        id: input.id,
        name: input.name,
        bio: input.bio,
        avatarUrl: input.avatarUrl,
        lastName: input.lastName,
        role: input.role,
        status: input.status,
        userName: input.userName,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'User updated successfully',
      id: input.id,
    });
  }

  @Mutation(() => MutationResponseDto)
  @Roles(UserRoleEnum.ADMIN)
  async deleteUser(
    @Args('input') input: DeleteUserRequestDto,
  ): Promise<MutationResponseDto> {
    // 01: Send the command to the command bus
    await this.commandBus.execute(new UserDeleteCommand({ id: input.id }));

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'User deleted successfully',
      id: input.id,
    });
  }
}
