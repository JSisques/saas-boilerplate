import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IPromptEventData } from '@/shared/domain/events/llm-context/prompts/interfaces/prompt-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class PromptDraftedEvent extends BaseEvent<IPromptEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: IPromptEventData) {
    super(metadata, data);
  }
}
