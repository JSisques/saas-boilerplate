import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import {
  EventResponseDto,
  PaginatedEventResultDto,
} from '@/event-store-context/event/transport/graphql/dtos/responses/event.response.dto';
import { EventGraphQLMapper } from '@/event-store-context/event/transport/graphql/mappers/event.mapper';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('EventGraphQLMapper', () => {
  let mapper: EventGraphQLMapper;

  beforeEach(() => {
    mapper = new EventGraphQLMapper();
  });

  const createViewModel = (payload: Record<string, any> | null) =>
    new EventViewModel({
      id: '123e4567-e89b-12d3-a456-426614174000',
      eventType: 'UserCreatedEvent',
      aggregateType: 'UserAggregate',
      aggregateId: '123e4567-e89b-12d3-a456-426614174001',
      payload: payload ?? {},
      timestamp: new Date('2024-01-01T10:00:00Z'),
      createdAt: new Date('2024-01-02T12:00:00Z'),
      updatedAt: new Date('2024-01-02T12:00:00Z'),
    });

  it('should map view model to response DTO with JSON stringified payload', () => {
    const viewModel = createViewModel({ foo: 'bar' });

    const dto = mapper.toResponseDto(viewModel);

    expect(dto).toEqual<EventResponseDto>({
      id: viewModel.id,
      eventType: viewModel.eventType,
      aggregateType: viewModel.aggregateType,
      aggregateId: viewModel.aggregateId,
      payload: JSON.stringify(viewModel.payload),
      timestamp: viewModel.timestamp,
      createdAt: viewModel.createdAt,
      updatedAt: viewModel.updatedAt,
    });
  });

  it('should keep payload null when source payload is empty', () => {
    const viewModel = createViewModel(null);

    const dto = mapper.toResponseDto(viewModel);

    expect(dto.payload).toBe(JSON.stringify({}));
  });

  it('should map paginated result to paginated response DTO', () => {
    const viewModel = createViewModel({ foo: 'bar' });
    const paginatedResult = new PaginatedResult<EventViewModel>(
      [viewModel],
      1,
      2,
      10,
    );

    const dto = mapper.toPaginatedResponseDto(paginatedResult);

    expect(dto).toEqual<PaginatedEventResultDto>({
      items: [
        {
          id: viewModel.id,
          eventType: viewModel.eventType,
          aggregateType: viewModel.aggregateType,
          aggregateId: viewModel.aggregateId,
          payload: JSON.stringify(viewModel.payload),
          timestamp: viewModel.timestamp,
          createdAt: viewModel.createdAt,
          updatedAt: viewModel.updatedAt,
        },
      ],
      total: 1,
      page: 2,
      perPage: 10,
      totalPages: paginatedResult.totalPages,
    });
  });
});
