import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

// Test class to extend BaseEvent since it's abstract
class TestEvent extends BaseEvent<{ test: string }> {
  constructor(metadata: IEventMetadata, data: { test: string }) {
    super(metadata, data);
  }
}

describe('BaseEvent', () => {
  const createMetadata = (
    overrides?: Partial<IEventMetadata>,
  ): IEventMetadata => {
    return {
      aggregateId: '123e4567-e89b-12d3-a456-426614174000',
      aggregateType: 'TestAggregate',
      eventType: 'TestEvent',
      isReplay: false,
      ...overrides,
    };
  };

  const createTestData = () => ({
    test: 'test-value',
  });

  describe('constructor', () => {
    it('should create an event with all required properties', () => {
      const metadata = createMetadata();
      const data = createTestData();
      const beforeCreation = new Date();

      const event = new TestEvent(metadata, data);
      const afterCreation = new Date();

      expect(event.eventId).toBeDefined();
      expect(event.eventId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
      expect(event.eventType).toBe(metadata.eventType);
      expect(event.aggregateId).toBe(metadata.aggregateId);
      expect(event.aggregateType).toBe(metadata.aggregateType);
      expect(event.ocurredAt).toBeInstanceOf(Date);
      expect(event.ocurredAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(event.ocurredAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
      expect(event.isReplay).toBe(false);
    });

    it('should set isReplay to true when provided in metadata', () => {
      const metadata = createMetadata({ isReplay: true });
      const data = createTestData();

      const event = new TestEvent(metadata, data);

      expect(event.isReplay).toBe(true);
    });

    it('should set isReplay to undefined when not provided in metadata', () => {
      const metadata = createMetadata();
      delete metadata.isReplay;
      const data = createTestData();

      const event = new TestEvent(metadata, data);

      expect(event.isReplay).toBeUndefined();
    });

    it('should generate a unique eventId for each event', () => {
      const metadata = createMetadata();
      const data = createTestData();

      const event1 = new TestEvent(metadata, data);
      const event2 = new TestEvent(metadata, data);

      expect(event1.eventId).not.toBe(event2.eventId);
    });

    it('should store the data correctly', () => {
      const metadata = createMetadata();
      const data = createTestData();

      const event = new TestEvent(metadata, data);

      expect(event.data).toEqual(data);
      expect(event.data.test).toBe('test-value');
    });

    it('should create ocurredAt timestamp at creation time', () => {
      const metadata = createMetadata();
      const data = createTestData();
      const beforeCreation = Date.now();

      const event = new TestEvent(metadata, data);

      const afterCreation = Date.now();
      expect(event.ocurredAt.getTime()).toBeGreaterThanOrEqual(beforeCreation);
      expect(event.ocurredAt.getTime()).toBeLessThanOrEqual(afterCreation);
    });
  });

  describe('data getter', () => {
    it('should return the data passed in constructor', () => {
      const metadata = createMetadata();
      const data = createTestData();

      const event = new TestEvent(metadata, data);

      expect(event.data).toBe(data);
      expect(event.data).toEqual({ test: 'test-value' });
    });

    it('should return the same data reference', () => {
      const metadata = createMetadata();
      const data = createTestData();

      const event = new TestEvent(metadata, data);

      expect(event.data).toBe(data);
    });
  });
});
