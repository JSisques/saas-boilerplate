import { PromptCreateCommand } from '@/llm-context/prompt/application/commands/prompt-create/prompt-create.command';
import { PromptAggregateFactory } from '@/llm-context/prompt/domain/factories/prompt-aggregate/prompt-aggregate.factory';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(PromptCreateCommand)
export class PromptCreateCommandHandler
  implements ICommandHandler<PromptCreateCommand>
{
  constructor(
    @Inject(PROMPT_WRITE_REPOSITORY_TOKEN)
    private readonly promptWriteRepository: PromptWriteRepository,
    private readonly eventBus: EventBus,
    private readonly promptAggregateFactory: PromptAggregateFactory,
  ) {}

  /**
   * Executes the prompt create command
   *
   * @param command - The command to execute
   * @returns The created prompt id
   */
  async execute(command: PromptCreateCommand): Promise<string> {
    // 01: Create the prompt entity
    const prompt = this.promptAggregateFactory.create({
      ...command,
      createdAt: new DateValueObject(new Date()),
      updatedAt: new DateValueObject(new Date()),
    });

    // 02: Save the prompt entity
    await this.promptWriteRepository.save(prompt);

    // 03: Publish all events
    await this.eventBus.publishAll(prompt.getUncommittedEvents());
    await prompt.commit();

    // 04: Return the prompt id
    return prompt.id.value;
  }
}
