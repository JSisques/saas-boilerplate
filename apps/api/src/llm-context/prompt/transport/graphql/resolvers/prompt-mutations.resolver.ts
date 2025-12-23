import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { PromptChangeStatusCommand } from '@/llm-context/prompt/application/commands/prompt-change-status/prompt-change-status.command';
import { PromptCreateCommand } from '@/llm-context/prompt/application/commands/prompt-create/prompt-create.command';
import { PromptDeleteCommand } from '@/llm-context/prompt/application/commands/prompt-delete/prompt-delete.command';
import { PromptUpdateCommand } from '@/llm-context/prompt/application/commands/prompt-update/prompt-update.command';
import { PromptChangeStatusRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-change-status.request.dto';
import { PromptCreateRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-create.request.dto';
import { PromptDeleteRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-delete.request.dto';
import { PromptUpdateRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-update.request.dto';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { Logger, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
export class PromptMutationsResolver {
  private readonly logger = new Logger(PromptMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  /**
   * Creates a new prompt with the provided input data.
   *
   * @param {PromptCreateRequestDto} input - The information required to create a new prompt.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the prompt was created successfully, a message, and the ID of the created prompt.
   */
  @Mutation(() => MutationResponseDto)
  async promptCreate(
    @Args('input') input: PromptCreateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Creating prompt with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    const createdPromptId = await this.commandBus.execute(
      new PromptCreateCommand(input),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Prompt created successfully',
      id: createdPromptId,
    });
  }

  /**
   * Updates an existing prompt with the provided input data.
   *
   * @param {PromptUpdateRequestDto} input - The update information for the prompt, including the prompt's ID.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the update was successful, a message, and the ID of the updated prompt.
   */
  @Mutation(() => MutationResponseDto)
  async promptUpdate(
    @Args('input') input: PromptUpdateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Updating prompt with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new PromptUpdateCommand({
        id: input.id,
        title: input.title,
        description: input.description,
        content: input.content,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Prompt updated successfully',
      id: input.id,
    });
  }

  /**
   * Deletes an existing prompt based on the provided prompt ID.
   *
   * @param {PromptDeleteRequestDto} input - The information containing the ID of the prompt to be deleted.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the deletion was successful, a message, and the ID of the deleted prompt.
   */
  @Mutation(() => MutationResponseDto)
  async promptDelete(
    @Args('input') input: PromptDeleteRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Deleting prompt with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(new PromptDeleteCommand({ id: input.id }));

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Prompt deleted successfully',
      id: input.id,
    });
  }

  /**
   * Changes the status of an existing prompt based on the provided prompt ID and status.
   *
   * @param {PromptChangeStatusRequestDto} input - The information containing the ID of the prompt and the new status to set.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the status change was successful, a message, and the ID of the prompt.
   */
  @Mutation(() => MutationResponseDto)
  async promptChangeStatus(
    @Args('input') input: PromptChangeStatusRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Changing prompt status with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new PromptChangeStatusCommand({
        id: input.id,
        status: input.status,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Prompt status changed successfully',
      id: input.id,
    });
  }
}
