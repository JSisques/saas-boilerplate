import { PromptActivatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-activated/prompt-activated.event';
import { IPromptEventData } from '@/shared/domain/events/llm-context/prompts/interfaces/prompt-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

describe('PromptActivatedEvent', () => {
  const createMetadata = (): IEventMetadata => ({
    aggregateId: '123e4567-e89b-12d3-a456-426614174000',
    aggregateType: 'PromptAggregate',
    eventType: 'PromptActivatedEvent',
    isReplay: false,
  });

  const createPromptData = (): IPromptEventData => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    slug: 'test-prompt',
    version: 1,
    title: 'Test Prompt',
    description: 'A test prompt',
    content: 'This is a test prompt content',
    status: 'active',
    isActive: true,
  });

  it('should be an instance of BaseEvent', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptActivatedEvent(metadata, data);

    expect(event).toBeInstanceOf(BaseEvent);
  });

  it('should create an event with correct metadata', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptActivatedEvent(metadata, data);

    expect(event.aggregateId).toBe(metadata.aggregateId);
    expect(event.aggregateType).toBe(metadata.aggregateType);
    expect(event.eventType).toBe(metadata.eventType);
  });

  it('should store the prompt data correctly', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event = new PromptActivatedEvent(metadata, data);

    expect(event.data).toEqual(data);
    expect(event.data.status).toBe('active');
    expect(event.data.isActive).toBe(true);
  });

  it('should generate a unique eventId', () => {
    const metadata = createMetadata();
    const data = createPromptData();

    const event1 = new PromptActivatedEvent(metadata, data);
    const event2 = new PromptActivatedEvent(metadata, data);

    expect(event1.eventId).not.toBe(event2.eventId);
  });
});
