import { PromptDraftCommand } from '@/llm-context/prompt/application/commands/prompt-draft/prompt-draft.command';
import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(PromptDraftCommand)
export class PromptDraftCommandHandler
  implements ICommandHandler<PromptDraftCommand>
{
  private readonly logger = new Logger(PromptDraftCommandHandler.name);

  constructor(
    @Inject(PROMPT_WRITE_REPOSITORY_TOKEN)
    private readonly promptWriteRepository: PromptWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertPromptExsistsService: AssertPromptExsistsService,
  ) {}

  /**
   * Executes the prompt draft command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: PromptDraftCommand): Promise<void> {
    this.logger.log(`Executing draft prompt command by id: ${command.id}`);

    // 01: Check if the prompt exists
    const existingPrompt = await this.assertPromptExsistsService.execute(
      command.id.value,
    );

    // 02: Draft the prompt
    await existingPrompt.draft();

    // 04: Draft the prompt from the repository
    await this.promptWriteRepository.save(existingPrompt);

    // 05: Publish the prompt drafted event
    await this.eventBus.publishAll(existingPrompt.getUncommittedEvents());
    await existingPrompt.commit();
  }
}
