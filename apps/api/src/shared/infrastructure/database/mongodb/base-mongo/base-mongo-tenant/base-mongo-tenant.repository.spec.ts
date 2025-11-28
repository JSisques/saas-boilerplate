import { MongoTenantService } from '@/shared/infrastructure/database/mongodb/services/mongo-tenant/mongo-tenant.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Db } from 'mongodb';
import { BaseMongoTenantRepository } from './base-mongo-tenant.repository';

// Create a concrete implementation for testing
class TestMongoTenantRepository extends BaseMongoTenantRepository {
  constructor(
    mongoTenantService: MongoTenantService,
    tenantContextService: TenantContextService,
  ) {
    super(mongoTenantService, tenantContextService);
  }

  // Expose protected method for testing
  async getTenantDatabaseForTest(): Promise<Db> {
    return this.getTenantDatabase();
  }
}

describe('BaseMongoTenantRepository', () => {
  let repository: TestMongoTenantRepository;
  let mongoTenantService: jest.Mocked<MongoTenantService>;
  let tenantContextService: jest.Mocked<TenantContextService>;
  let module: TestingModule;
  let mockDb: jest.Mocked<Db>;

  beforeEach(() => {
    mockDb = {} as any;

    mongoTenantService = {
      getTenantDatabase: jest.fn().mockResolvedValue(mockDb),
    } as any;

    tenantContextService = {
      getTenantIdOrThrow: jest.fn().mockReturnValue('test-tenant-123'),
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
            return new TestMongoTenantRepository(service, tenantContextService);
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
      // Create a mock tenantContextService that throws an error
      const errorTenantContextService = {
        getTenantIdOrThrow: jest.fn().mockImplementation(() => {
          throw new Error('Tenant ID is required but not set');
        }),
      } as any;

      // Create repository with error-throwing tenantContextService
      class InvalidRepository extends BaseMongoTenantRepository {
        constructor(
          mongoTenantService: MongoTenantService,
          tenantContextService: TenantContextService,
        ) {
          super(mongoTenantService, tenantContextService);
        }

        async getTenantDatabaseForTest(): Promise<Db> {
          return this.getTenantDatabase();
        }
      }

      const invalidRepo = new InvalidRepository(
        mongoTenantService,
        errorTenantContextService,
      );

      await expect(invalidRepo.getTenantDatabaseForTest()).rejects.toThrow(
        'Tenant ID is required but not set',
      );
    });
  });
});
