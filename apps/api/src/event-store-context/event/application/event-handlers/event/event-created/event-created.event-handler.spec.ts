import { EventCreatedEventHandler } from '@/event-store-context/event/application/event-handlers/event/event-created/event-created.event-handler';
import { EventViewModelFactory } from '@/event-store-context/event/domain/factories/event-view-model/event-view-model.factory';
import { EventReadRepository } from '@/event-store-context/event/domain/repositories/event-read.repository';
import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import { EventCreatedEvent } from '@/shared/domain/events/event-store/event-created/event-created.event';

describe('EventCreatedEventHandler', () => {
  let handler: EventCreatedEventHandler;
  let mockEventReadRepository: jest.Mocked<EventReadRepository>;
  let mockEventViewModelFactory: jest.Mocked<EventViewModelFactory>;

  beforeEach(() => {
    mockEventReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    mockEventViewModelFactory = {
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<EventViewModelFactory>;

    handler = new EventCreatedEventHandler(
      mockEventReadRepository,
      mockEventViewModelFactory,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and persist view model from event data', async () => {
    const eventData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      eventType: 'UserCreatedEvent',
      aggregateType: 'UserAggregate',
      aggregateId: '123e4567-e89b-12d3-a456-426614174001',
      payload: { foo: 'bar' },
      timestamp: new Date('2024-01-01T10:00:00Z'),
    };
    const event = new EventCreatedEvent(
      {
        aggregateId: eventData.id,
        aggregateType: 'EventAggregate',
        eventType: 'EventCreatedEvent',
      },
      eventData,
    );
    const viewModel = new EventViewModel({
      ...eventData,
      createdAt: new Date('2024-01-02T12:00:00Z'),
      updatedAt: new Date('2024-01-02T12:00:00Z'),
    });

    mockEventViewModelFactory.fromPrimitives.mockReturnValue(viewModel);

    await handler.handle(event);

    expect(mockEventViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
      eventData,
    );
    expect(mockEventReadRepository.save).toHaveBeenCalledWith(viewModel);
  });
});
