import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IPromptEventData } from '@/shared/domain/events/llm-context/prompts/interfaces/prompt-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class PromptUpdatedEvent extends BaseEvent<
  Partial<Omit<IPromptEventData, 'id'>>
> {
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<IPromptEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
