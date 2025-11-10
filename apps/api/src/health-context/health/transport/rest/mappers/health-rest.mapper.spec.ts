import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';
import { HealthRestMapper } from '@/health-context/health/transport/rest/mappers/health-rest.mapper';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('HealthRestMapper', () => {
  let mapper: HealthRestMapper;

  beforeEach(() => {
    mapper = new HealthRestMapper();
  });

  it('should map view model to rest response dto', () => {
    const viewModel = new HealthViewModel({ status: 'OK' });

    const dto = mapper.toResponseDto(viewModel);

    expect(dto).toEqual({ status: 'OK' });
  });

  it('should map paginated result to response dto', () => {
    const viewModel = new HealthViewModel({ status: 'OK' });
    const paginated = new PaginatedResult([viewModel], 1, 1, 10);

    const dto = mapper.toPaginatedResponseDto(paginated);

    expect(dto.items).toEqual([{ status: 'OK' }]);
    expect(dto.total).toBe(1);
    expect(dto.page).toBe(1);
    expect(dto.perPage).toBe(10);
    expect(dto.totalPages).toBe(paginated.totalPages);
  });
});
