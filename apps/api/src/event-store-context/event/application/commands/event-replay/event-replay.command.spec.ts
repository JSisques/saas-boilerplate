import { EventReplayCommand } from '@/event-store-context/event/application/commands/event-replay/event-replay.command';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

describe('EventReplayCommand', () => {
  it('should wrap primitive values into value objects', () => {
    const command = new EventReplayCommand({
      id: '123e4567-e89b-12d3-a456-426614174000',
      eventType: 'UserCreatedEvent',
      aggregateId: '123e4567-e89b-12d3-a456-426614174001',
      aggregateType: 'UserAggregate',
      from: new Date('2024-01-01T00:00:00Z'),
      to: new Date('2024-01-31T23:59:59Z'),
      batchSize: 100,
    });

    expect(command.id).toBeInstanceOf(EventUuidValueObject);
    expect(command.eventType).toBeInstanceOf(EventTypeValueObject);
    expect(command.aggregateId).toBeInstanceOf(EventAggregateIdValueObject);
    expect(command.aggregateType).toBeInstanceOf(EventAggregateTypeValueObject);
    expect(command.from).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(command.to).toEqual(new Date('2024-01-31T23:59:59Z'));
    expect(command.batchSize).toBe(100);
  });

  it('should set default batch size when not provided', () => {
    const command = new EventReplayCommand({
      from: new Date('2024-01-01T00:00:00Z'),
      to: new Date('2024-01-31T23:59:59Z'),
    });

    expect(command.batchSize).toBe(500);
  });

  it('should leave optional fields undefined when not provided', () => {
    const command = new EventReplayCommand({
      from: new Date('2024-01-01T00:00:00Z'),
      to: new Date('2024-01-31T23:59:59Z'),
    });

    expect(command.id).toBeUndefined();
    expect(command.eventType).toBeUndefined();
    expect(command.aggregateId).toBeUndefined();
    expect(command.aggregateType).toBeUndefined();
  });
});
