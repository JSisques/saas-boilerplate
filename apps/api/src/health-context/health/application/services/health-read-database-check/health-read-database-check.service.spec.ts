import { HealthReadDatabaseCheckService } from '@/health-context/health/application/services/health-read-database-check/health-read-database-check.service';
import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { MongoService } from '@/shared/infrastructure/database/mongodb/services/mongo.service';

describe('HealthReadDatabaseCheckService', () => {
  let service: HealthReadDatabaseCheckService;
  let mockMongoService: jest.Mocked<MongoService>;

  beforeEach(() => {
    const mockDb = {
      admin: jest.fn().mockReturnValue({
        ping: jest.fn(),
      }),
    };

    mockMongoService = {
      getDatabase: jest.fn().mockReturnValue(mockDb),
    } as unknown as jest.Mocked<MongoService>;

    service = new HealthReadDatabaseCheckService(mockMongoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return OK when database connection is healthy', async () => {
    const mockAdmin = {
      ping: jest.fn().mockResolvedValue({ ok: 1 }),
    };
    const mockDb = {
      admin: jest.fn().mockReturnValue(mockAdmin),
    };
    mockMongoService.getDatabase.mockReturnValue(mockDb as any);

    const result = await service.execute();

    expect(mockMongoService.getDatabase).toHaveBeenCalled();
    expect(mockAdmin.ping).toHaveBeenCalled();
    expect(result).toBe(HealthStatusEnum.OK);
  });

  it('should return ERROR when database connection fails', async () => {
    const error = new Error('Database connection failed');
    const mockAdmin = {
      ping: jest.fn().mockRejectedValue(error),
    };
    const mockDb = {
      admin: jest.fn().mockReturnValue(mockAdmin),
    };
    mockMongoService.getDatabase.mockReturnValue(mockDb as any);

    const result = await service.execute();

    expect(mockMongoService.getDatabase).toHaveBeenCalled();
    expect(mockAdmin.ping).toHaveBeenCalled();
    expect(result).toBe(HealthStatusEnum.ERROR);
  });
});
