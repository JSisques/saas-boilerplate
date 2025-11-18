import { PromptUpdatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-updated/prompt-updated.event';
import { IPromptEventData } from '@/shared/domain/events/llm-context/prompts/interfaces/prompt-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('PromptUpdatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'PromptAggregate',
    eventType: 'PromptUpdatedEvent',
    isReplay: false,
  });

  const createPartialPromptData = (): Partial<
    Omit<IPromptEventData, 'id'>
  > => ({
    title: 'Updated Prompt Title',
    description: 'Updated description',
    content: 'Updated content',
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createPartialPromptData();

    const event = new PromptUpdatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createPartialPromptData();

    const event = new PromptUpdatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store partial prompt data correctly', () => {
    const metadata = createMetadata();
    const data = createPartialPromptData();

    const event = new PromptUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.title).toBe(data.title);
    expect(event.data.content).toBe(data.content);
  });

  it('should allow partial data updates', () => {
    const metadata = createMetadata();
    const data = { title: 'Only Title' };

    const event = new PromptUpdatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.title).toBe('Only Title');
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createPartialPromptData();

    const event1 = new PromptUpdatedEvent(metadata, data);
    const event2 = new PromptUpdatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
