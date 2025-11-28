import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { PromptActivateCommand } from '@/llm-context/prompt/application/commands/prompt-activate/prompt-activate.command';
import { PromptArchiveCommand } from '@/llm-context/prompt/application/commands/prompt-archive/prompt-archive.command';
import { PromptCreateCommand } from '@/llm-context/prompt/application/commands/prompt-create/prompt-create.command';
import { PromptDeleteCommand } from '@/llm-context/prompt/application/commands/prompt-delete/prompt-delete.command';
import { PromptDeprecateCommand } from '@/llm-context/prompt/application/commands/prompt-deprecate/prompt-deprecate.command';
import { PromptDraftCommand } from '@/llm-context/prompt/application/commands/prompt-draft/prompt-draft.command';
import { PromptUpdateCommand } from '@/llm-context/prompt/application/commands/prompt-update/prompt-update.command';
import { PromptActivateRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-activate.request.dto';
import { PromptArchiveRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-archive.request.dto';
import { PromptCreateRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-create.request.dto';
import { PromptDeleteRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-delete.request.dto';
import { PromptDeprecateRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-deprecate.request.dto';
import { PromptDraftRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-draft.request.dto';
import { PromptUpdateRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-update.request.dto';
import { UserRoleEnum } from '@/prisma/master/client';
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
   * Activates an existing prompt based on the provided prompt ID.
   *
   * @param {PromptActivateRequestDto} input - The information containing the ID of the prompt to be activated.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the activation was successful, a message, and the ID of the activated prompt.
   */
  @Mutation(() => MutationResponseDto)
  async promptActivate(
    @Args('input') input: PromptActivateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Activating prompt with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(new PromptActivateCommand({ id: input.id }));

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Prompt activated successfully',
      id: input.id,
    });
  }

  /**
   * Drafts an existing prompt based on the provided prompt ID.
   *
   * @param {PromptDraftRequestDto} input - The information containing the ID of the prompt to be drafted.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the drafting was successful, a message, and the ID of the drafted prompt.
   */
  @Mutation(() => MutationResponseDto)
  async promptDraft(
    @Args('input') input: PromptDraftRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Drafting prompt with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(new PromptDraftCommand({ id: input.id }));

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Prompt drafted successfully',
      id: input.id,
    });
  }

  /**
   * Archives an existing prompt based on the provided prompt ID.
   *
   * @param {PromptArchiveRequestDto} input - The information containing the ID of the prompt to be archived.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the archiving was successful, a message, and the ID of the archived prompt.
   */
  @Mutation(() => MutationResponseDto)
  async promptArchive(
    @Args('input') input: PromptArchiveRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Archiving prompt with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(new PromptArchiveCommand({ id: input.id }));
    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Prompt archived successfully',
      id: input.id,
    });
  }

  /**
   * Deprecates an existing prompt based on the provided prompt ID.
   *
   * @param {PromptDeprecateRequestDto} input - The information containing the ID of the prompt to be deprecated.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the deprecation was successful, a message, and the ID of the deprecated prompt.
   */
  @Mutation(() => MutationResponseDto)
  async promptDeprecate(
    @Args('input') input: PromptDeprecateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(`Deprecating prompt with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(new PromptDeprecateCommand({ id: input.id }));

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Prompt deprecated successfully',
      id: input.id,
    });
  }
}
