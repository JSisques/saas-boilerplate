import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptDeletedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-deleted/prompt-deleted.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(PromptDeletedEvent)
export class PromptDeletedEventHandler
  implements IEventHandler<PromptDeletedEvent>
{
  private readonly logger = new Logger(PromptDeletedEventHandler.name);

  constructor(
    @Inject(PROMPT_READ_REPOSITORY_TOKEN)
    private readonly promptReadRepository: PromptReadRepository,
    private readonly assertPromptViewModelExsistsService: AssertPromptViewModelExsistsService,
  ) {}

  /**
   * Handles the PromptDeletedEvent event by deleting the existing prompt view model.
   *
   * @param event - The PromptDeletedEvent event to handle.
   */
  async handle(event: PromptDeletedEvent) {
    this.logger.log(`Handling prompt deleted event: ${event.aggregateId}`);
    const existingPromptViewModel =
      await this.assertPromptViewModelExsistsService.execute(event.aggregateId);

    // 02: Delete the prompt view model
    await this.promptReadRepository.delete(existingPromptViewModel.id);
  }
}
