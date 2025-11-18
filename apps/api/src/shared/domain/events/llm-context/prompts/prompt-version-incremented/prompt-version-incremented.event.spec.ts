import { PromptVersionIncrementedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-version-incremented/prompt-version-incremented.event';
import { IPromptEventData } from '@/shared/domain/events/llm-context/prompts/interfaces/prompt-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('PromptVersionIncrementedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'PromptAggregate',
    eventType: 'PromptVersionIncrementedEvent',
    isReplay: false,
  });

  const createPromptData = (): IPromptEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    slug: 'versioned-prompt',
    version: 2,
    title: 'Versioned Prompt',
    description: 'A versioned prompt',
    content: 'This is version 2 of the prompt',
    status: 'active',
    isActive: true,
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptVersionIncrementedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptVersionIncrementedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the prompt data correctly', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptVersionIncrementedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.version).toBe(2);
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event1 = new PromptVersionIncrementedEvent(metadata, data);
    const event2 = new PromptVersionIncrementedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});

