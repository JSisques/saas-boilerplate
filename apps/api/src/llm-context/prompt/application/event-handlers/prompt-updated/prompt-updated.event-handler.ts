import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptUpdatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-updated/prompt-updated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(PromptUpdatedEvent)
export class PromptUpdatedEventHandler
  implements IEventHandler<PromptUpdatedEvent>
{
  private readonly logger = new Logger(PromptUpdatedEventHandler.name);

  constructor(
    @Inject(PROMPT_READ_REPOSITORY_TOKEN)
    private readonly promptReadRepository: PromptReadRepository,
    private readonly assertPromptViewModelExsistsService: AssertPromptViewModelExsistsService,
  ) {}

  /**
   * Handles the PromptUpdatedEvent event by updating the existing prompt view model.
   *
   * @param event - The PromptUpdatedEvent event to handle.
   */
  async handle(event: PromptUpdatedEvent) {
    this.logger.log(`Handling prompt updated event: ${event.aggregateId}`);

    // 01: Assert the subscription view model exists
    const existingPromptViewModel =
      await this.assertPromptViewModelExsistsService.execute(event.aggregateId);

    // 02: Update the existing view model with new data
    existingPromptViewModel.update(event.data);

    // 03: Save the updated prompt view model
    await this.promptReadRepository.save(existingPromptViewModel);
  }
}
