import { PromptDeleteCommand } from '@/llm-context/prompt/application/commands/prompt-delete/prompt-delete.command';
import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(PromptDeleteCommand)
export class PromptDeleteCommandHandler
  implements ICommandHandler<PromptDeleteCommand>
{
  private readonly logger = new Logger(PromptDeleteCommandHandler.name);

  constructor(
    @Inject(PROMPT_WRITE_REPOSITORY_TOKEN)
    private readonly promptWriteRepository: PromptWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertPromptExsistsService: AssertPromptExsistsService,
  ) {}

  /**
   * Executes the prompt delete command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: PromptDeleteCommand): Promise<void> {
    this.logger.log(`Executing delete prompt command by id: ${command.id}`);

    // 01: Check if the prompt exists
    const existingPrompt = await this.assertPromptExsistsService.execute(
      command.id.value,
    );

    // 02: Delete the prompt
    await existingPrompt.delete();

    // 04: Delete the prompt from the repository
    await this.promptWriteRepository.delete(existingPrompt.id.value);

    // 05: Publish the prompt deleted event
    await this.eventBus.publishAll(existingPrompt.getUncommittedEvents());
    await existingPrompt.commit();
  }
}
