import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptDeprecatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-deprecated/prompt-deprecated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(PromptDeprecatedEvent)
export class PromptDeprecatedEventHandler
  implements IEventHandler<PromptDeprecatedEvent>
{
  private readonly logger = new Logger(PromptDeprecatedEventHandler.name);

  constructor(
    @Inject(PROMPT_READ_REPOSITORY_TOKEN)
    private readonly promptReadRepository: PromptReadRepository,
    private readonly assertPromptViewModelExsistsService: AssertPromptViewModelExsistsService,
  ) {}

  /**
   * Handles the PromptDeprecatedEvent event by updating the existing prompt view model.
   *
   * @param event - The PromptDeprecatedEvent event to handle.
   */
  async handle(event: PromptDeprecatedEvent) {
    this.logger.log(`Handling prompt deprecated event: ${event.aggregateId}`);

    // 01: Assert the prompt view model exists
    const existingPromptViewModel =
      await this.assertPromptViewModelExsistsService.execute(event.aggregateId);

    // 02: Update the existing view model with new data
    existingPromptViewModel.update({
      status: PromptStatusEnum.DEPRECATED,
    });

    // 03: Save the updated prompt view model
    await this.promptReadRepository.save(existingPromptViewModel);
  }
}
