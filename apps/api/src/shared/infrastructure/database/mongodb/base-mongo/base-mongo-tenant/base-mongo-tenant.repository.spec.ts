import { Criteria } from '@/shared/domain/entities/criteria';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Collection } from 'mongodb';
import { BaseMongoTenantRepository } from './base-mongo-tenant.repository';

// Create a concrete implementation for testing
class TestMongoTenantRepository extends BaseMongoTenantRepository {
  constructor(
    mongoMasterService: MongoMasterService,
    tenantContextService: TenantContextService,
  ) {
    super(mongoMasterService, tenantContextService);
  }

  // Expose protected methods for testing
  public testGetCollection(collectionName: string): Collection {
    return this.getCollection(collectionName);
  }

  public testAddTenantFilter(query: any): any {
    return this.addTenantFilter(query);
  }

  public testBuildMongoQueryWithTenant(criteria: any): any {
    return this.buildMongoQueryWithTenant(criteria);
  }
}

describe('BaseMongoTenantRepository', () => {
  let repository: TestMongoTenantRepository;
  let mockMongoMasterService: jest.Mocked<MongoMasterService>;
  let mockTenantContextService: jest.Mocked<TenantContextService>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    mockMongoMasterService = {
      getCollection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<MongoMasterService>;

    mockTenantContextService = {
      getTenantIdOrThrow: jest.fn().mockReturnValue('test-tenant-123'),
    } as unknown as jest.Mocked<TenantContextService>;

    repository = new TestMongoTenantRepository(
      mockMongoMasterService,
      mockTenantContextService,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getCollection', () => {
    it('should get collection from mongo master service', () => {
      const collection = repository.testGetCollection('test-collection');

      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'test-collection',
      );
      expect(collection).toBe(mockCollection);
    });
  });

  describe('addTenantFilter', () => {
    it('should add tenantId to query', () => {
      const query = { name: 'test' };
      const result = repository.testAddTenantFilter(query);

      expect(mockTenantContextService.getTenantIdOrThrow).toHaveBeenCalled();
      expect(result).toEqual({
        name: 'test',
        tenantId: 'test-tenant-123',
      });
    });
  });

  describe('buildMongoQueryWithTenant', () => {
    it('should build query with tenant filter', () => {
      const criteria = new Criteria(
        [{ field: 'name', operator: FilterOperator.EQUALS, value: 'test' }],
        [],
        { page: 1, perPage: 10 },
      );

      const result = repository.testBuildMongoQueryWithTenant(criteria);

      expect(result).toEqual({
        name: 'test',
        tenantId: 'test-tenant-123',
      });
    });
  });

  describe('tenantId getter', () => {
    it('should throw error if tenantId is not set', () => {
      const errorTenantContextService = {
        getTenantIdOrThrow: jest.fn().mockImplementation(() => {
          throw new Error('Tenant ID is required but not set');
        }),
      } as any;

      const invalidRepo = new TestMongoTenantRepository(
        mockMongoMasterService,
        errorTenantContextService,
      );

      expect(() => invalidRepo.testAddTenantFilter({})).toThrow(
        'Tenant ID is required but not set',
      );
    });
  });
});
