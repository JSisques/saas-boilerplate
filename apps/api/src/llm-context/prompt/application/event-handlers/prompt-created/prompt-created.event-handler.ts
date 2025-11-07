import { PromptViewModelFactory } from '@/llm-context/prompt/domain/factories/prompt-plan-view-model/prompt-view-model.factory';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptCreatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-created/prompt-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(PromptCreatedEvent)
export class PromptCreatedEventHandler
  implements IEventHandler<PromptCreatedEvent>
{
  private readonly logger = new Logger(PromptCreatedEventHandler.name);

  constructor(
    @Inject(PROMPT_READ_REPOSITORY_TOKEN)
    private readonly promptReadRepository: PromptReadRepository,
    private readonly promptViewModelFactory: PromptViewModelFactory,
  ) {}

  /**
   * Handles the PromptCreatedEvent event by creating a new prompt view model.
   *
   * @param event - The PromptCreatedEvent event to handle.
   */
  async handle(event: PromptCreatedEvent) {
    this.logger.log(`Handling prompt created event: ${event.aggregateId}`);

    // 01: Create the prompt view model
    const promptCreatedViewModel = this.promptViewModelFactory.fromPrimitives(
      event.data,
    );

    // 02: Save the prompt view model
    await this.promptReadRepository.save(promptCreatedViewModel);
  }
}
