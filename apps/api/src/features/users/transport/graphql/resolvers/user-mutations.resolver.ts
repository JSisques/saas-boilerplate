import { CreateUserCommand } from '@/features/users/application/commands/create-user/create-user.command';
import { DeleteUserCommand } from '@/features/users/application/commands/delete-user/delete-user.command';
import { UpdateUserCommand } from '@/features/users/application/commands/update-user/update-user.command';
import { CreateUserRequestDto } from '@/features/users/transport/graphql/dtos/requests/create-user.request.dto';
import { DeleteUserRequestDto } from '@/features/users/transport/graphql/dtos/requests/delete-user.request.dto';
import { UpdateUserRequestDto } from '@/features/users/transport/graphql/dtos/requests/update-user.request.dto copy';
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
      new CreateUserCommand(input.name, input.bio, input.avatar),
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
      new UpdateUserCommand(input.userId, {
        name: input.name,
        bio: input.bio,
        avatar: input.avatar,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'User updated successfully',
      id: input.userId,
    });
  }

  @Mutation(() => MutationResponseDto)
  async deleteUser(
    @Args('input') input: DeleteUserRequestDto,
  ): Promise<MutationResponseDto> {
    // 01: Send the command to the command bus
    await this.commandBus.execute(new DeleteUserCommand(input.userId));

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'User deleted successfully',
      id: input.userId,
    });
  }
}
