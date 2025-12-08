import { PromptDeprecatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-deprecated/prompt-deprecated.event';
import { IPromptEventData } from '@/shared/domain/events/llm-context/prompts/interfaces/prompt-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('PromptDeprecatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'PromptAggregate',
    eventType: 'PromptDeprecatedEvent',
    isReplay: false,
  });

  const createPromptData = (): IPromptEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    slug: 'deprecated-prompt',
    version: 1,
    title: 'Deprecated Prompt',
    description: 'This prompt is deprecated',
    content: 'This is a deprecated prompt content',
    status: 'deprecated',
    isActive: false,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptDeprecatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptDeprecatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the prompt data correctly', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptDeprecatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.status).toBe('deprecated');
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event1 = new PromptDeprecatedEvent(metadata, data);
    const event2 = new PromptDeprecatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
