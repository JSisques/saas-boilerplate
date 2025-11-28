import { HealthWriteDatabaseCheckService } from '@/health-context/health/application/services/health-write-database-check/health-write-database-check.service';
import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';

describe('HealthWriteDatabaseCheckService', () => {
  let service: HealthWriteDatabaseCheckService;
  let mockPrismaMasterService: jest.Mocked<PrismaMasterService>;

  beforeEach(() => {
    mockPrismaMasterService = {
      client: {
        $queryRaw: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaMasterService>;

    service = new HealthWriteDatabaseCheckService(mockPrismaMasterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return OK when database connection is healthy', async () => {
    mockPrismaMasterService.client.$queryRaw.mockResolvedValue([
      { '?column?': 1 },
    ]);

    const result = await service.execute();

    expect(mockPrismaMasterService.client.$queryRaw).toHaveBeenCalledWith(
      expect.anything(),
    );
    expect(result).toBe(HealthStatusEnum.OK);
  });

  it('should return ERROR when database connection fails', async () => {
    const error = new Error('Database connection failed');
    mockPrismaMasterService.client.$queryRaw.mockRejectedValue(error);

    const result = await service.execute();

    expect(mockPrismaMasterService.client.$queryRaw).toHaveBeenCalledWith(
      expect.anything(),
    );
    expect(result).toBe(HealthStatusEnum.ERROR);
  });
});
