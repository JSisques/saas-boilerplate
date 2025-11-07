import { PromptDeprecateCommand } from '@/llm-context/prompt/application/commands/prompt-deprecate/prompt-deprecate.command';
import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(PromptDeprecateCommand)
export class PromptDeprecateCommandHandler
  implements ICommandHandler<PromptDeprecateCommand>
{
  private readonly logger = new Logger(PromptDeprecateCommandHandler.name);

  constructor(
    @Inject(PROMPT_WRITE_REPOSITORY_TOKEN)
    private readonly promptWriteRepository: PromptWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertPromptExsistsService: AssertPromptExsistsService,
  ) {}

  /**
   * Executes the prompt deprecate command
   *
   * @param command - The command to execute
   * @returns The void
   */
  async execute(command: PromptDeprecateCommand): Promise<void> {
    this.logger.log(`Executing deprecate prompt command by id: ${command.id}`);

    // 01: Check if the prompt exists
    const existingPrompt = await this.assertPromptExsistsService.execute(
      command.id.value,
    );

    // 02: Deprecate the prompt
    await existingPrompt.deprecate();

    // 04: Deprecate the prompt from the repository
    await this.promptWriteRepository.save(existingPrompt);

    // 05: Publish the prompt deprecated event
    await this.eventBus.publishAll(existingPrompt.getUncommittedEvents());
    await existingPrompt.commit();
  }
}
