import { FindEventsByCriteriaQuery } from '@/event-store-context/event/application/queries/event-find-by-criteria/event-find-by-criteria.command';
import { EventGraphQLMapper } from '@/event-store-context/event/transport/graphql/mappers/event.mapper';
import { EventQueryResolver } from '@/event-store-context/event/transport/graphql/resolvers/event-queries.resolver';
import { EventFindByCriteriaRequestDto } from '@/event-store-context/event/transport/graphql/dtos/requests/event-find-by-criteria.request.dto';
import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { QueryBus } from '@nestjs/cqrs';

describe('EventQueryResolver', () => {
  let resolver: EventQueryResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockEventGraphQLMapper: jest.Mocked<EventGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockEventGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<EventGraphQLMapper>;

    resolver = new EventQueryResolver(mockQueryBus, mockEventGraphQLMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute query bus with criteria and map result', async () => {
    const input: EventFindByCriteriaRequestDto = {
      filters: [],
      sorts: [],
      pagination: { page: 2, perPage: 5 },
    };
    const viewModel = new EventViewModel({
      id: '123e4567-e89b-12d3-a456-426614174000',
      eventType: 'UserCreatedEvent',
      aggregateType: 'UserAggregate',
      aggregateId: '123e4567-e89b-12d3-a456-426614174001',
      payload: { foo: 'bar' },
      timestamp: new Date('2024-01-01T10:00:00Z'),
      createdAt: new Date('2024-01-02T12:00:00Z'),
      updatedAt: new Date('2024-01-02T12:00:00Z'),
    });
    const paginatedResult = new PaginatedResult<EventViewModel>(
      [viewModel],
      1,
      2,
      5,
    );
    const responseDto = {
      items: [
        {
          id: '123',
          eventType: 'UserCreatedEvent',
          aggregateType: 'UserAggregate',
          aggregateId: '456',
          payload: '{}',
          timestamp: new Date(),
        },
      ],
      total: 1,
      page: 2,
      perPage: 5,
      totalPages: 1,
    };

    mockQueryBus.execute.mockResolvedValue(paginatedResult);
    mockEventGraphQLMapper.toPaginatedResponseDto.mockReturnValue(responseDto);

    const result = await resolver.eventsFindByCriteria(input);

    expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
    const executedQuery = mockQueryBus.execute.mock
      .calls[0][0] as FindEventsByCriteriaQuery;
    expect(executedQuery).toBeInstanceOf(FindEventsByCriteriaQuery);
    expect(executedQuery.criteria).toBeInstanceOf(Criteria);
    expect(executedQuery.criteria.pagination).toEqual(input.pagination);
    expect(mockEventGraphQLMapper.toPaginatedResponseDto).toHaveBeenCalledWith(
      paginatedResult,
    );
    expect(result).toBe(responseDto);
  });

  it('should handle undefined input using default criteria', async () => {
    const paginatedResult = new PaginatedResult<EventViewModel>([], 0, 1, 10);
    const responseDto = {
      items: [],
      total: 0,
      page: 1,
      perPage: 10,
      totalPages: 0,
    };

    mockQueryBus.execute.mockResolvedValue(paginatedResult);
    mockEventGraphQLMapper.toPaginatedResponseDto.mockReturnValue(responseDto);

    const result = await resolver.eventsFindByCriteria();

    expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
    const executedQuery = mockQueryBus.execute.mock
      .calls[0][0] as FindEventsByCriteriaQuery;
    expect(executedQuery.criteria).toBeInstanceOf(Criteria);
    expect(executedQuery.criteria.filters).toEqual([]);
    expect(executedQuery.criteria.sorts).toEqual([]);
    expect(mockEventGraphQLMapper.toPaginatedResponseDto).toHaveBeenCalledWith(
      paginatedResult,
    );
    expect(result).toBe(responseDto);
  });
});
