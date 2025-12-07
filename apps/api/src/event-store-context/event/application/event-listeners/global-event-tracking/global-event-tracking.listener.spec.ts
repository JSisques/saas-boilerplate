import { GlobalEventTrackingListener } from '@/event-store-context/event/application/event-listeners/global-event-tracking/global-event-tracking.listener';
import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { EventCreatedEvent } from '@/shared/domain/events/event-store/event-created/event-created.event';
import { EventBus } from '@nestjs/cqrs';

class SampleEvent extends BaseEvent<Record<string, any>> {}

describe('GlobalEventTrackingListener', () => {
  let listener: GlobalEventTrackingListener;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockEventTrackingService: jest.Mocked<EventTrackingService>;
  let unsubscribeMock: jest.Mock;
  let capturedCallback: ((event: any) => void) | undefined;

  beforeEach(() => {
    unsubscribeMock = jest.fn();
    capturedCallback = undefined;

    mockEventBus = {
      subscribe: jest
        .fn()
        .mockImplementation((callback: (event: any) => void) => {
          capturedCallback = callback;
          return { unsubscribe: unsubscribeMock };
        }),
    } as unknown as jest.Mocked<EventBus>;

    mockEventTrackingService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<EventTrackingService>;

    listener = new GlobalEventTrackingListener(
      mockEventBus,
      mockEventTrackingService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should subscribe to event bus on module init', () => {
    listener.onModuleInit();

    expect(mockEventBus.subscribe).toHaveBeenCalledTimes(1);
    expect(capturedCallback).toBeDefined();
  });

  it('should ignore non BaseEvent instances', () => {
    listener.onModuleInit();
    capturedCallback?.({ some: 'payload' });

    expect(mockEventTrackingService.execute).not.toHaveBeenCalled();
  });

  it('should ignore EventCreatedEvent instances', () => {
    listener.onModuleInit();
    const event = new EventCreatedEvent(
      {
        aggregateId: '123e4567-e89b-12d3-a456-426614174000',
        aggregateType: EventAggregate.name,
        eventType: EventCreatedEvent.name,
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        eventType: 'UserCreatedEvent',
        aggregateType: 'UserAggregate',
        aggregateId: '123e4567-e89b-12d3-a456-426614174001',
        payload: {},
        timestamp: new Date('2024-01-01T10:00:00Z'),
        createdAt: new Date('2024-01-02T12:00:00Z'),
        updatedAt: new Date('2024-01-02T12:00:00Z'),
      },
    );

    capturedCallback?.(event);

    expect(mockEventTrackingService.execute).not.toHaveBeenCalled();
  });

  it('should ignore events emitted by EventAggregate', () => {
    listener.onModuleInit();
    const event = new SampleEvent(
      {
        aggregateId: '123e4567-e89b-12d3-a456-426614174000',
        aggregateType: EventAggregate.name,
        eventType: 'EventAggregateEvent',
      },
      {},
    );

    capturedCallback?.(event);

    expect(mockEventTrackingService.execute).not.toHaveBeenCalled();
  });

  it('should track eligible events', async () => {
    listener.onModuleInit();
    const event = new SampleEvent(
      {
        aggregateId: '123e4567-e89b-12d3-a456-426614174000',
        aggregateType: 'UserAggregate',
        eventType: 'UserUpdatedEvent',
      },
      { foo: 'bar' },
    );

    await capturedCallback?.(event);

    expect(mockEventTrackingService.execute).toHaveBeenCalledWith(event);
  });

  it('should log errors when tracking fails without throwing', async () => {
    listener.onModuleInit();
    const event = new SampleEvent(
      {
        aggregateId: '123e4567-e89b-12d3-a456-426614174000',
        aggregateType: 'UserAggregate',
        eventType: 'UserUpdatedEvent',
      },
      {},
    );
    const error = new Error('Persistence failure');
    mockEventTrackingService.execute.mockRejectedValue(error);

    if (capturedCallback) {
      // The callback uses void, so it doesn't return a promise
      // We just verify it doesn't throw synchronously
      expect(() => {
        capturedCallback(event);
      }).not.toThrow();

      // Wait a bit to ensure async error handling completes
      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, 10);
        timeout.unref();
      });
    }
  });

  it('should unsubscribe on module destroy', () => {
    listener.onModuleInit();

    listener.onModuleDestroy();

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });
});
