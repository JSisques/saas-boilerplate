import { FindEventsByCriteriaQuery } from '@/event-store-context/event/application/queries/event-find-by-criteria/event-find-by-criteria.command';
import { FindEventsByCriteriaQueryHandler } from '@/event-store-context/event/application/queries/event-find-by-criteria/event-find-by-criteria.command-handler';
import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import { EventReadRepository } from '@/event-store-context/event/domain/repositories/event-read.repository';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('FindEventsByCriteriaQueryHandler', () => {
  let handler: FindEventsByCriteriaQueryHandler;
  let mockEventReadRepository: jest.Mocked<EventReadRepository>;

  beforeEach(() => {
    mockEventReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    handler = new FindEventsByCriteriaQueryHandler(mockEventReadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate to repository with provided criteria and return result', async () => {
    const criteria = new Criteria();
    const query = new FindEventsByCriteriaQuery({ criteria });
    const viewModel = new EventViewModel({
      id: '123e4567-e89b-12d3-a456-426614174000',
      eventType: 'UserCreatedEvent',
      aggregateType: 'UserAggregate',
      aggregateId: '123e4567-e89b-12d3-a456-426614174001',
      payload: { foo: 'bar' },
      timestamp: new Date('2024-01-01T10:00:00Z'),
      createdAt: new Date('2024-01-02T12:00:00Z'),
      updatedAt: new Date('2024-01-02T12:30:00Z'),
    });
    const paginatedResult = new PaginatedResult([viewModel], 1, 1, 10);

    mockEventReadRepository.findByCriteria.mockResolvedValue(paginatedResult);

    const result = await handler.execute(query);

    expect(result).toBe(paginatedResult);
    expect(mockEventReadRepository.findByCriteria).toHaveBeenCalledWith(
      criteria,
    );
    expect(mockEventReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
  });
});
