import { UserDeleteCommand } from '@/features/users/application/commands/delete-user/delete-user.command';
import { UserCreateCommand } from '@/features/users/application/commands/user-create/user-create.command';
import { UserUpdateCommand } from '@/features/users/application/commands/user-update/user-update.command';
import { CreateUserRequestDto } from '@/features/users/transport/graphql/dtos/requests/create-user.request.dto';
import { DeleteUserRequestDto } from '@/features/users/transport/graphql/dtos/requests/delete-user.request.dto';
import { UpdateUserRequestDto } from '@/features/users/transport/graphql/dtos/requests/update-user.request.dto';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/success-response.dto';
import {
  MUTATION_RESPONSE_GRAPHQL_MAPPER_TOKEN,
  MutationResponseGraphQLMapper,
} from '@/shared/transport/graphql/mappers/mutation-response.mapper';
import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserMutationsResolver {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(MUTATION_RESPONSE_GRAPHQL_MAPPER_TOKEN)
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  @Mutation(() => MutationResponseDto)
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
        status: input.status,
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
