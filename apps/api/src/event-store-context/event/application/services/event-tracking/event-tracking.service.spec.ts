import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { EventAggregateFactory } from '@/event-store-context/event/domain/factories/event-aggregate.factory';
import { EventWriteRepository } from '@/event-store-context/event/domain/repositories/event-write.repository';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { EventBus } from '@nestjs/cqrs';

class TestEvent extends BaseEvent<Record<string, any>> {}

describe('EventTrackingService', () => {
  let service: EventTrackingService;
  let mockEventWriteRepository: jest.Mocked<EventWriteRepository>;
  let mockEventAggregateFactory: jest.Mocked<EventAggregateFactory>;
  let mockEventBus: jest.Mocked<EventBus>;

  beforeEach(() => {
    mockEventWriteRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockEventAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<EventAggregateFactory>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    service = new EventTrackingService(
      mockEventWriteRepository,
      mockEventAggregateFactory,
      mockEventBus,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should skip replayed events', async () => {
    const event = new TestEvent(
      {
        aggregateId: '123e4567-e89b-12d3-a456-426614174000',
        aggregateType: 'UserAggregate',
        eventType: 'UserUpdatedEvent',
        isReplay: true,
      },
      { foo: 'bar' },
    );

    await service.execute(event);

    expect(mockEventAggregateFactory.fromPrimitives).not.toHaveBeenCalled();
    expect(mockEventWriteRepository.save).not.toHaveBeenCalled();
    expect(mockEventBus.publishAll).not.toHaveBeenCalled();
  });

  it('should persist and publish non-replay events', async () => {
    const event = new TestEvent(
      {
        aggregateId: '123e4567-e89b-12d3-a456-426614174000',
        aggregateType: 'UserAggregate',
        eventType: 'UserUpdatedEvent',
      },
      { foo: 'bar' },
    );

    const aggregateMock = {
      getUncommittedEvents: jest.fn().mockReturnValue(['event-store-event']),
      commit: jest.fn(),
    };

    mockEventAggregateFactory.fromPrimitives.mockReturnValue(
      aggregateMock as any,
    );

    await service.execute(event);

    expect(mockEventAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
      id: expect.any(String),
      eventType: event.eventType,
      aggregateType: event.aggregateType,
      aggregateId: event.aggregateId,
      payload: event.data,
      timestamp: event.ocurredAt,
    });
    expect(mockEventWriteRepository.save).toHaveBeenCalledWith(aggregateMock);
    expect(mockEventBus.publishAll).toHaveBeenCalledWith(['event-store-event']);
    expect(aggregateMock.commit).toHaveBeenCalled();

    const saveOrder = mockEventWriteRepository.save.mock.invocationCallOrder[0];
    const publishOrder = mockEventBus.publishAll.mock.invocationCallOrder[0];
    const commitOrder = aggregateMock.commit.mock.invocationCallOrder[0];

    expect(saveOrder).toBeLessThan(publishOrder);
    expect(publishOrder).toBeLessThan(commitOrder);
  });
});
