import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import { EventMongoDto } from '@/event-store-context/event/infrastructure/mongodb/dtos/event-mongodb.dto';
import { EventMongoMapper } from '@/event-store-context/event/infrastructure/mongodb/mappers/event-mongodb.mapper';

describe('EventMongoMapper', () => {
  let mapper: EventMongoMapper;

  const mongoDto: EventMongoDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    eventType: 'UserCreatedEvent',
    aggregateType: 'UserAggregate',
    aggregateId: '123e4567-e89b-12d3-a456-426614174001',
    payload: { foo: 'bar' },
    timestamp: new Date('2024-01-01T10:00:00Z'),
    createdAt: new Date('2024-01-02T12:00:00Z'),
    updatedAt: new Date('2024-01-03T15:00:00Z'),
  };

  const viewModel = new EventViewModel({
    id: mongoDto.id,
    eventType: mongoDto.eventType,
    aggregateType: mongoDto.aggregateType,
    aggregateId: mongoDto.aggregateId,
    payload: mongoDto.payload,
    timestamp: mongoDto.timestamp,
    createdAt: mongoDto.createdAt,
    updatedAt: mongoDto.updatedAt,
  });

  beforeEach(() => {
    mapper = new EventMongoMapper();
  });

  it('should convert Mongo document to view model', () => {
    const result = mapper.toViewModel(mongoDto);

    expect(result).toBeInstanceOf(EventViewModel);
    expect(result.id).toBe(mongoDto.id);
    expect(result.eventType).toBe(mongoDto.eventType);
    expect(result.aggregateType).toBe(mongoDto.aggregateType);
    expect(result.aggregateId).toBe(mongoDto.aggregateId);
    expect(result.payload).toEqual(mongoDto.payload);
    expect(result.timestamp).toEqual(mongoDto.timestamp);
    expect(result.createdAt).toEqual(mongoDto.createdAt);
    expect(result.updatedAt).toEqual(mongoDto.updatedAt);
  });

  it('should convert view model to Mongo document', () => {
    const result = mapper.toMongoData(viewModel);

    expect(result).toEqual({
      id: viewModel.id,
      eventType: viewModel.eventType,
      aggregateType: viewModel.aggregateType,
      aggregateId: viewModel.aggregateId,
      payload: viewModel.payload,
      timestamp: viewModel.timestamp,
      createdAt: viewModel.createdAt,
      updatedAt: viewModel.updatedAt,
    });
  });
});
