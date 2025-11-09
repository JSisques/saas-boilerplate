import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptVersionIncrementedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-version-incremented/prompt-version-incremented.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(PromptVersionIncrementedEvent)
export class PromptVersionIncrementedEventHandler
  implements IEventHandler<PromptVersionIncrementedEvent>
{
  private readonly logger = new Logger(
    PromptVersionIncrementedEventHandler.name,
  );

  constructor(
    @Inject(PROMPT_READ_REPOSITORY_TOKEN)
    private readonly promptReadRepository: PromptReadRepository,
    private readonly assertPromptViewModelExsistsService: AssertPromptViewModelExsistsService,
  ) {}

  /**
   * Handles the PromptVersionIncrementedEvent event by updating the existing prompt view model.
   *
   * @param event - The PromptVersionIncrementedEvent event to handle.
   */
  async handle(event: PromptVersionIncrementedEvent) {
    this.logger.log(
      `Handling prompt version incremented event: ${event.aggregateId}`,
    );

    // 01: Assert the subscription view model exists
    const existingPromptViewModel =
      await this.assertPromptViewModelExsistsService.execute(event.aggregateId);

    // 02: Increment the version of the prompt
    existingPromptViewModel.update({
      version: event.data.version,
    });

    // 03: Save the updated prompt view model
    await this.promptReadRepository.save(existingPromptViewModel);
  }
}
