import { PromptUpdateCommand } from '@/llm-context/prompt/application/commands/prompt-update/prompt-update.command';
import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import { IPromptUpdateDto } from '@/llm-context/prompt/domain/dtos/entities/prompt-update/prompt-update.dto';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { BaseUpdateCommandHandler } from '@/shared/application/commands/update/base-update.command-handler';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(PromptUpdateCommand)
export class PromptUpdateCommandHandler
  extends BaseUpdateCommandHandler<PromptUpdateCommand, IPromptUpdateDto>
  implements ICommandHandler<PromptUpdateCommand>
{
  protected readonly logger = new Logger(PromptUpdateCommandHandler.name);

  constructor(
    private readonly assertPromptExsistsService: AssertPromptExsistsService,
    private readonly eventBus: EventBus,
    @Inject(PROMPT_WRITE_REPOSITORY_TOKEN)
    private readonly promptWriteRepository: PromptWriteRepository,
  ) {
    super();
  }

  /**
   * Executes the update prompt command
   *
   * @param command - The command to execute
   */
  async execute(command: PromptUpdateCommand): Promise<void> {
    this.logger.log(`Executing update prompt command by id: ${command.id}`);

    // 01: Check if the prompt exists
    const existingPrompt = await this.assertPromptExsistsService.execute(
      command.id.value,
    );

    // 02: Extract update data excluding the id field
    const updateData = this.extractUpdateData(command, ['id']);
    this.logger.debug(`Update data: ${JSON.stringify(updateData)}`);

    // 03: Update the prompt
    existingPrompt.update(updateData);

    // 04: Save the prompt
    await this.promptWriteRepository.save(existingPrompt);

    // 05: Publish the prompt updated event
    await this.eventBus.publishAll(existingPrompt.getUncommittedEvents());
    await existingPrompt.commit();
  }
}
