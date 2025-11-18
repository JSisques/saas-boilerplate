import { PromptDeletedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-deleted/prompt-deleted.event';
import { IPromptEventData } from '@/shared/domain/events/llm-context/prompts/interfaces/prompt-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('PromptDeletedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'PromptAggregate',
    eventType: 'PromptDeletedEvent',
    isReplay: false,
  });

  const createPromptData = (): IPromptEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    slug: 'deleted-prompt',
    version: 1,
    title: 'Deleted Prompt',
    description: null,
    content: 'This prompt was deleted',
    status: 'deleted',
    isActive: false,
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptDeletedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptDeletedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the prompt data correctly', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptDeletedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.status).toBe('deleted');
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event1 = new PromptDeletedEvent(metadata, data);
    const event2 = new PromptDeletedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
