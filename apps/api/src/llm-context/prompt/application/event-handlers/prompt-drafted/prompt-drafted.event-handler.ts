import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptDraftedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-drafted/prompt-drafted.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(PromptDraftedEvent)
export class PromptDraftedEventHandler
  implements IEventHandler<PromptDraftedEvent>
{
  private readonly logger = new Logger(PromptDraftedEventHandler.name);

  constructor(
    @Inject(PROMPT_READ_REPOSITORY_TOKEN)
    private readonly promptReadRepository: PromptReadRepository,
    private readonly assertPromptViewModelExsistsService: AssertPromptViewModelExsistsService,
  ) {}

  /**
   * Handles the PromptDraftedEvent event by updating the existing prompt view model.
   *
   * @param event - The PromptDraftedEvent event to handle.
   */
  async handle(event: PromptDraftedEvent) {
    this.logger.log(`Handling prompt drafted event: ${event.aggregateId}`);

    // 01: Assert the prompt view model exists
    const existingPromptViewModel =
      await this.assertPromptViewModelExsistsService.execute(event.aggregateId);

    // 02: Update the existing view model with new data
    existingPromptViewModel.update({
      status: PromptStatusEnum.DRAFT,
    });

    // 03: Save the updated prompt view model
    await this.promptReadRepository.save(existingPromptViewModel);
  }
}
