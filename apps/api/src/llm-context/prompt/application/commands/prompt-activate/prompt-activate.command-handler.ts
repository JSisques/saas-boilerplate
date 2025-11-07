import { PromptActivateCommand } from '@/llm-context/prompt/application/commands/prompt-activate/prompt-activate.command';
import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(PromptActivateCommand)
export class PromptActivateCommandHandler
  implements ICommandHandler<PromptActivateCommand>
{
  private readonly logger = new Logger(PromptActivateCommandHandler.name);

  constructor(
    @Inject(PROMPT_WRITE_REPOSITORY_TOKEN)
    private readonly promptWriteRepository: PromptWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertPromptExsistsService: AssertPromptExsistsService,
  ) {}

  /**
   * Executes the prompt activate command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: PromptActivateCommand): Promise<void> {
    this.logger.log(`Executing activate prompt command by id: ${command.id}`);

    // 01: Check if the prompt exists
    const existingPrompt = await this.assertPromptExsistsService.execute(
      command.id.value,
    );

    // 02: Activate the prompt
    await existingPrompt.activate();

    // 04: Activate the prompt from the repository
    await this.promptWriteRepository.save(existingPrompt);

    // 05: Publish the prompt activated event
    await this.eventBus.publishAll(existingPrompt.getUncommittedEvents());
    await existingPrompt.commit();
  }
}
