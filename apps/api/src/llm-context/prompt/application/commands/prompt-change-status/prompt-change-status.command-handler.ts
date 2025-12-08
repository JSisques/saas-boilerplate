import { PromptChangeStatusCommand } from '@/llm-context/prompt/application/commands/prompt-change-status/prompt-change-status.command';
import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(PromptChangeStatusCommand)
export class PromptChangeStatusCommandHandler
  implements ICommandHandler<PromptChangeStatusCommand>
{
  private readonly logger = new Logger(PromptChangeStatusCommandHandler.name);

  constructor(
    @Inject(PROMPT_WRITE_REPOSITORY_TOKEN)
    private readonly promptWriteRepository: PromptWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertPromptExsistsService: AssertPromptExsistsService,
  ) {}

  /**
   * Executes the prompt change status command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: PromptChangeStatusCommand): Promise<void> {
    this.logger.log(
      `Executing prompt change status command with id ${command.id.value} to status ${command.status.value}`,
    );

    // 01: Assert the prompt exists
    const existingPrompt = await this.assertPromptExsistsService.execute(
      command.id.value,
    );

    // 02: Change the prompt status based on the provided status
    switch (command.status.value) {
      case PromptStatusEnum.ACTIVE:
        existingPrompt.activate();
        break;
      case PromptStatusEnum.DRAFT:
        existingPrompt.draft();
        break;
      case PromptStatusEnum.ARCHIVED:
        existingPrompt.archive();
        break;
      case PromptStatusEnum.DEPRECATED:
        existingPrompt.deprecate();
        break;
      default:
        throw new Error(
          `Unknown status: ${command.status.value}. Cannot change prompt status.`,
        );
    }

    // 03: Save the prompt entity
    await this.promptWriteRepository.save(existingPrompt);

    // 04: Publish all events
    await this.eventBus.publishAll(existingPrompt.getUncommittedEvents());
    await existingPrompt.commit();
  }
}
