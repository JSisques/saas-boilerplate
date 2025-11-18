import { PromptDraftedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-drafted/prompt-drafted.event';
import { IPromptEventData } from '@/shared/domain/events/llm-context/prompts/interfaces/prompt-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('PromptDraftedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'PromptAggregate',
    eventType: 'PromptDraftedEvent',
    isReplay: false,
  });

  const createPromptData = (): IPromptEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    slug: 'draft-prompt',
    version: 1,
    title: 'Draft Prompt',
    description: 'A draft prompt',
    content: 'This is a draft prompt content',
    status: 'draft',
    isActive: false,
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptDraftedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptDraftedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the prompt data correctly', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptDraftedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.status).toBe('draft');
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event1 = new PromptDraftedEvent(metadata, data);
    const event2 = new PromptDraftedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});

