import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';

describe('EventViewModel', () => {
  const createDto = () => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    eventType: 'UserCreatedEvent',
    aggregateType: 'UserAggregate',
    aggregateId: '123e4567-e89b-12d3-a456-426614174001',
    payload: { foo: 'bar' },
    timestamp: new Date('2024-01-01T10:00:00Z'),
    createdAt: new Date('2024-01-02T12:00:00Z'),
    updatedAt: new Date('2024-01-03T15:00:00Z'),
  });

  it('should expose properties through getters', () => {
    const dto = createDto();

    const viewModel = new EventViewModel(dto);

    expect(viewModel.id).toBe(dto.id);
    expect(viewModel.eventType).toBe(dto.eventType);
    expect(viewModel.aggregateType).toBe(dto.aggregateType);
    expect(viewModel.aggregateId).toBe(dto.aggregateId);
    expect(viewModel.payload).toEqual(dto.payload);
    expect(viewModel.timestamp).toEqual(dto.timestamp);
    expect(viewModel.createdAt).toEqual(dto.createdAt);
    expect(viewModel.updatedAt).toEqual(dto.updatedAt);
  });
});
