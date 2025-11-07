import { PromptArchiveCommand } from '@/llm-context/prompt/application/commands/prompt-archive/prompt-archive.command';
import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(PromptArchiveCommand)
export class PromptArchiveCommandHandler
  implements ICommandHandler<PromptArchiveCommand>
{
  private readonly logger = new Logger(PromptArchiveCommandHandler.name);

  constructor(
    @Inject(PROMPT_WRITE_REPOSITORY_TOKEN)
    private readonly promptWriteRepository: PromptWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertPromptExsistsService: AssertPromptExsistsService,
  ) {}

  /**
   * Executes the prompt archive command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: PromptArchiveCommand): Promise<void> {
    this.logger.log(`Executing archive prompt command by id: ${command.id}`);

    // 01: Check if the prompt exists
    const existingPrompt = await this.assertPromptExsistsService.execute(
      command.id.value,
    );

    // 02: Archive the prompt
    await existingPrompt.archive();

    // 04: Archive the prompt from the repository
    await this.promptWriteRepository.save(existingPrompt);

    // 05: Publish the prompt archived event
    await this.eventBus.publishAll(existingPrompt.getUncommittedEvents());
    await existingPrompt.commit();
  }
}
