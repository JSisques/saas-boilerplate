import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';
import { HealthGraphQLMapper } from '@/health-context/health/transport/graphql/mappers/health.mapper';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('HealthGraphQLMapper', () => {
  let mapper: HealthGraphQLMapper;

  beforeEach(() => {
    mapper = new HealthGraphQLMapper();
  });

  it('should map view model to response dto', () => {
    const viewModel = new HealthViewModel({
      status: 'OK',
      writeDatabaseStatus: 'OK',
      readDatabaseStatus: 'OK',
    });

    const dto = mapper.toResponseDto(viewModel);

    expect(dto).toEqual({
      status: 'OK',
      writeDatabaseStatus: 'OK',
      readDatabaseStatus: 'OK',
    });
  });

  it('should map paginated result to response dto', () => {
    const viewModel = new HealthViewModel({
      status: 'OK',
      writeDatabaseStatus: 'OK',
      readDatabaseStatus: 'OK',
    });
    const paginated = new PaginatedResult([viewModel], 1, 1, 10);

    const dto = mapper.toPaginatedResponseDto(paginated);

    expect(dto.items).toEqual([
      { status: 'OK', writeDatabaseStatus: 'OK', readDatabaseStatus: 'OK' },
    ]);
    expect(dto.total).toBe(1);
    expect(dto.page).toBe(1);
    expect(dto.perPage).toBe(10);
    expect(dto.totalPages).toBe(paginated.totalPages);
  });
});
