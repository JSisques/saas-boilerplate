import { HealthCheckService } from '@/health-context/health/application/services/health-check/health-check.service';
import { HealthReadDatabaseCheckService } from '@/health-context/health/application/services/health-read-database-check/health-read-database-check.service';
import { HealthWriteDatabaseCheckService } from '@/health-context/health/application/services/health-write-database-check/health-write-database-check.service';
import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { HealthViewModelFactory } from '@/health-context/health/domain/factories/health-view-model.factory';
import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';

describe('HealthCheckService', () => {
  let service: HealthCheckService;
  let mockHealthViewModelFactory: jest.Mocked<HealthViewModelFactory>;
  let mockHealthWriteDatabaseCheckService: jest.Mocked<HealthWriteDatabaseCheckService>;
  let mockHealthReadDatabaseCheckService: jest.Mocked<HealthReadDatabaseCheckService>;

  beforeEach(() => {
    mockHealthViewModelFactory = {
      create: jest.fn(),
      fromAggregate: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<HealthViewModelFactory>;

    mockHealthWriteDatabaseCheckService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<HealthWriteDatabaseCheckService>;

    mockHealthReadDatabaseCheckService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<HealthReadDatabaseCheckService>;

    service = new HealthCheckService(
      mockHealthViewModelFactory,
      mockHealthWriteDatabaseCheckService,
      mockHealthReadDatabaseCheckService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create health view model with OK status', async () => {
    const expectedViewModel = new HealthViewModel({
      status: HealthStatusEnum.OK,
      writeDatabaseStatus: HealthStatusEnum.OK,
      readDatabaseStatus: HealthStatusEnum.OK,
    });

    mockHealthWriteDatabaseCheckService.execute.mockResolvedValue(
      HealthStatusEnum.OK,
    );
    mockHealthReadDatabaseCheckService.execute.mockResolvedValue(
      HealthStatusEnum.OK,
    );
    mockHealthViewModelFactory.create.mockReturnValue(expectedViewModel);

    const result = await service.execute();

    expect(mockHealthWriteDatabaseCheckService.execute).toHaveBeenCalled();
    expect(mockHealthReadDatabaseCheckService.execute).toHaveBeenCalled();
    expect(mockHealthViewModelFactory.create).toHaveBeenCalledWith({
      status: HealthStatusEnum.OK,
      writeDatabaseStatus: HealthStatusEnum.OK,
      readDatabaseStatus: HealthStatusEnum.OK,
    });
    expect(result).toBe(expectedViewModel);
  });
});
