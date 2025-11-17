import { HealthWriteDatabaseCheckService } from '@/health-context/health/application/services/health-write-database-check/health-write-database-check.service';
import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';

describe('HealthWriteDatabaseCheckService', () => {
  let service: HealthWriteDatabaseCheckService;
  let mockPrismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    mockPrismaService = {
      $queryRaw: jest.fn(),
    } as unknown as jest.Mocked<PrismaService>;

    service = new HealthWriteDatabaseCheckService(mockPrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return OK when database connection is healthy', async () => {
    mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    const result = await service.execute();

    expect(mockPrismaService.$queryRaw).toHaveBeenCalledWith(expect.anything());
    expect(result).toBe(HealthStatusEnum.OK);
  });

  it('should return ERROR when database connection fails', async () => {
    const error = new Error('Database connection failed');
    mockPrismaService.$queryRaw.mockRejectedValue(error);

    const result = await service.execute();

    expect(mockPrismaService.$queryRaw).toHaveBeenCalledWith(expect.anything());
    expect(result).toBe(HealthStatusEnum.ERROR);
  });
});
