import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptArchivedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-archived/prompt-activated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(PromptArchivedEvent)
export class PromptArchivedEventHandler
  implements IEventHandler<PromptArchivedEvent>
{
  private readonly logger = new Logger(PromptArchivedEventHandler.name);

  constructor(
    @Inject(PROMPT_READ_REPOSITORY_TOKEN)
    private readonly promptReadRepository: PromptReadRepository,
    private readonly assertPromptViewModelExsistsService: AssertPromptViewModelExsistsService,
  ) {}

  /**
   * Handles the PromptArchivedEvent event by updating the existing prompt view model.
   *
   * @param event - The PromptArchivedEvent event to handle.
   */
  async handle(event: PromptArchivedEvent) {
    this.logger.log(`Handling prompt archived event: ${event.aggregateId}`);

    // 01: Assert the prompt view model exists
    const existingPromptViewModel =
      await this.assertPromptViewModelExsistsService.execute(event.aggregateId);

    // 02: Update the existing view model with new data
    existingPromptViewModel.update({
      status: PromptStatusEnum.ARCHIVED,
    });

    // 03: Save the updated prompt view model
    await this.promptReadRepository.save(existingPromptViewModel);
  }
}
