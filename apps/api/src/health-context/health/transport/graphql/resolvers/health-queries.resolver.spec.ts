import { HealthCheckQuery } from '@/health-context/health/application/queries/health-check/health-check.query';
import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';
import { HealthGraphQLMapper } from '@/health-context/health/transport/graphql/mappers/health.mapper';
import { HealthQueryResolver } from '@/health-context/health/transport/graphql/resolvers/health-queries.resolver';
import { QueryBus } from '@nestjs/cqrs';

describe('HealthQueryResolver', () => {
  let resolver: HealthQueryResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockHealthGraphQLMapper: jest.Mocked<HealthGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockHealthGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<HealthGraphQLMapper>;

    resolver = new HealthQueryResolver(mockQueryBus, mockHealthGraphQLMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute health check query and map result', async () => {
    const viewModel = new HealthViewModel({
      status: 'OK',
      writeDatabaseStatus: 'OK',
      readDatabaseStatus: 'OK',
    });
    const responseDto = {
      status: 'OK',
      writeDatabaseStatus: 'OK',
      readDatabaseStatus: 'OK',
    };

    mockQueryBus.execute.mockResolvedValue(viewModel);
    mockHealthGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

    const result = await resolver.healthCheck();

    expect(mockQueryBus.execute).toHaveBeenCalledWith(new HealthCheckQuery());
    expect(mockHealthGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
      viewModel,
    );
    expect(result).toBe(responseDto);
  });
});
