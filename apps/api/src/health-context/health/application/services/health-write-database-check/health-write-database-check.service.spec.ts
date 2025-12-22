import { HealthWriteDatabaseCheckService } from '@/health-context/health/application/services/health-write-database-check/health-write-database-check.service';
import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';

describe('HealthWriteDatabaseCheckService', () => {
  let service: HealthWriteDatabaseCheckService;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;

  beforeEach(() => {
    const mockDataSource = {
      query: jest.fn(),
    };

    mockTypeormMasterService = {
      getDataSource: jest.fn().mockReturnValue(mockDataSource),
    } as unknown as jest.Mocked<TypeormMasterService>;

    service = new HealthWriteDatabaseCheckService(mockTypeormMasterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return OK when database connection is healthy', async () => {
    const mockDataSource = mockTypeormMasterService.getDataSource();
    (mockDataSource.query as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);

    const result = await service.execute();

    expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1');
    expect(result).toBe(HealthStatusEnum.OK);
  });

  it('should return ERROR when database connection fails', async () => {
    const error = new Error('Database connection failed');
    const mockDataSource = mockTypeormMasterService.getDataSource();
    (mockDataSource.query as jest.Mock).mockRejectedValue(error);

    const result = await service.execute();

    expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1');
    expect(result).toBe(HealthStatusEnum.ERROR);
  });
});
