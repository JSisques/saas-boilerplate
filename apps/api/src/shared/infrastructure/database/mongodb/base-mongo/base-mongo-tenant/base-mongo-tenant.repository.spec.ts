import { Test, TestingModule } from '@nestjs/testing';
import { MongoTenantService } from '@/shared/infrastructure/database/mongodb/services/mongo-tenant/mongo-tenant.service';
import { BaseMongoTenantRepository } from './base-mongo-tenant.repository';
import { Db } from 'mongodb';

// Create a concrete implementation for testing
class TestMongoTenantRepository extends BaseMongoTenantRepository {
  protected readonly tenantId = 'test-tenant-123';

  constructor(mongoTenantService: MongoTenantService) {
    super(mongoTenantService);
  }

  // Expose protected method for testing
  async getTenantDatabaseForTest(): Promise<Db> {
    return this.getTenantDatabase();
  }
}

describe('BaseMongoTenantRepository', () => {
  let repository: TestMongoTenantRepository;
  let mongoTenantService: jest.Mocked<MongoTenantService>;
  let module: TestingModule;
  let mockDb: jest.Mocked<Db>;

  beforeEach(() => {
    mockDb = {} as any;

    mongoTenantService = {
      getTenantDatabase: jest.fn().mockResolvedValue(mockDb),
    } as any;
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: MongoTenantService,
          useValue: mongoTenantService,
        },
        {
          provide: TestMongoTenantRepository,
          useFactory: (service: MongoTenantService) => {
            return new TestMongoTenantRepository(service);
          },
          inject: [MongoTenantService],
        },
      ],
    }).compile();

    repository = module.get<TestMongoTenantRepository>(
      TestMongoTenantRepository,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getTenantDatabase', () => {
    it('should get tenant database from service', async () => {
      const db = await repository.getTenantDatabaseForTest();

      expect(mongoTenantService.getTenantDatabase).toHaveBeenCalledWith(
        'test-tenant-123',
      );
      expect(db).toBe(mockDb);
    });

    it('should throw error if tenantId is not set', async () => {
      // Create repository without tenantId
      class InvalidRepository extends BaseMongoTenantRepository {
        protected readonly tenantId: string = undefined as any;

        constructor(mongoTenantService: MongoTenantService) {
          super(mongoTenantService);
        }

        async getTenantDatabaseForTest(): Promise<Db> {
          return this.getTenantDatabase();
        }
      }

      const invalidRepo = new InvalidRepository(mongoTenantService);

      await expect(invalidRepo.getTenantDatabaseForTest()).rejects.toThrow(
        'Tenant ID is required but not set',
      );
    });
  });
});
