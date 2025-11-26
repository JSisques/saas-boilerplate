import { HealthCheckQueryHandler } from '@/health-context/health/application/queries/health-check/health-check.query-handler';
import { HealthCheckService } from '@/health-context/health/application/services/health-check/health-check.service';
import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';

describe('HealthCheckQueryHandler', () => {
  let handler: HealthCheckQueryHandler;
  let mockHealthCheckService: jest.Mocked<HealthCheckService>;

  beforeEach(() => {
    mockHealthCheckService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<HealthCheckService>;

    handler = new HealthCheckQueryHandler(mockHealthCheckService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate execution to health check service', async () => {
    const expectedResult = new HealthViewModel({
      status: 'OK',
      writeDatabaseStatus: 'OK',
      readDatabaseStatus: 'OK',
    });
    mockHealthCheckService.execute.mockResolvedValue(expectedResult);

    const result = await handler.execute();

    expect(mockHealthCheckService.execute).toHaveBeenCalledTimes(1);
    expect(result).toBe(expectedResult);
  });
});
