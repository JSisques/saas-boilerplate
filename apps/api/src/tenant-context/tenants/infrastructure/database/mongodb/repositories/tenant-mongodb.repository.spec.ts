import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';
import { TenantMongoDbDto } from '@/tenant-context/tenants/infrastructure/database/mongodb/dtos/tenant/tenant-mongodb.dto';
import { TenantMongoDBMapper } from '@/tenant-context/tenants/infrastructure/database/mongodb/mappers/tenant-mongodb.mapper';
import { TenantMongoRepository } from '@/tenant-context/tenants/infrastructure/database/mongodb/repositories/tenant-mongodb.repository';
import { Collection } from 'mongodb';

describe('TenantMongoRepository', () => {
  let repository: TenantMongoRepository;
  let mockMongoMasterService: jest.Mocked<MongoMasterService>;
  let mockTenantMongoDBMapper: jest.Mocked<TenantMongoDBMapper>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn(),
      replaceOne: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
      toArray: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    mockMongoMasterService = {
      getCollection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<MongoMasterService>;

    mockTenantMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<TenantMongoDBMapper>;

    repository = new TenantMongoRepository(
      mockMongoMasterService,
      mockTenantMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return tenant view model when tenant exists', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const mongoDoc: TenantMongoDbDto = {
        id: tenantId,
        name: 'Test Tenant',
        slug: 'test-tenant',
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        status: TenantStatusEnum.ACTIVE,
        email: null,
        phoneNumber: null,
        phoneCode: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postalCode: null,
        timezone: null,
        locale: null,
        maxUsers: null,
        maxStorage: null,
        maxApiCalls: null,
        tenantMembers: [],
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      const viewModel = new TenantViewModel({
        id: tenantId,
        name: 'Test Tenant',
        slug: 'test-tenant',
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        status: TenantStatusEnum.ACTIVE,
        email: null,
        phoneNumber: null,
        phoneCode: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postalCode: null,
        timezone: null,
        locale: null,
        maxUsers: null,
        maxStorage: null,
        maxApiCalls: null,
        tenantMembers: [],
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockTenantMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findById(tenantId);

      expect(result).toBe(viewModel);
      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'tenants',
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: tenantId });
      expect(mockTenantMongoDBMapper.toViewModel).toHaveBeenCalledWith({
        id: tenantId,
        name: 'Test Tenant',
        slug: 'test-tenant',
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        status: TenantStatusEnum.ACTIVE,
        email: null,
        phoneNumber: null,
        phoneCode: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postalCode: null,
        timezone: null,
        locale: null,
        maxUsers: null,
        maxStorage: null,
        maxApiCalls: null,
        tenantMembers: [],
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should return null when tenant does not exist', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(tenantId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: tenantId });
      expect(mockTenantMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result with tenants when criteria matches', async () => {
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mongoDocs: TenantMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Tenant 1',
          slug: 'test-tenant-1',
          description: null,
          websiteUrl: null,
          logoUrl: null,
          faviconUrl: null,
          primaryColor: null,
          secondaryColor: null,
          status: TenantStatusEnum.ACTIVE,
          email: null,
          phoneNumber: null,
          phoneCode: null,
          address: null,
          city: null,
          state: null,
          country: null,
          postalCode: null,
          timezone: null,
          locale: null,
          maxUsers: null,
          maxStorage: null,
          maxApiCalls: null,
          tenantMembers: [],
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Test Tenant 2',
          slug: 'test-tenant-2',
          description: null,
          websiteUrl: null,
          logoUrl: null,
          faviconUrl: null,
          primaryColor: null,
          secondaryColor: null,
          status: TenantStatusEnum.INACTIVE,
          email: null,
          phoneNumber: null,
          phoneCode: null,
          address: null,
          city: null,
          state: null,
          country: null,
          postalCode: null,
          timezone: null,
          locale: null,
          maxUsers: null,
          maxStorage: null,
          maxApiCalls: null,
          tenantMembers: [],
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new TenantViewModel({
            id: doc.id,
            name: doc.name,
            slug: doc.slug,
            description: doc.description,
            websiteUrl: doc.websiteUrl,
            logoUrl: doc.logoUrl,
            faviconUrl: doc.faviconUrl,
            primaryColor: doc.primaryColor,
            secondaryColor: doc.secondaryColor,
            status: doc.status as TenantStatusEnum,
            email: doc.email,
            phoneNumber: doc.phoneNumber,
            phoneCode: doc.phoneCode,
            address: doc.address,
            city: doc.city,
            state: doc.state,
            country: doc.country,
            postalCode: doc.postalCode,
            timezone: doc.timezone,
            locale: doc.locale,
            maxUsers: doc.maxUsers,
            maxStorage: doc.maxStorage,
            maxApiCalls: doc.maxApiCalls,
            tenantMembers: doc.tenantMembers,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(2);

      mongoDocs.forEach((doc, index) => {
        mockTenantMongoDBMapper.toViewModel.mockReturnValueOnce(
          viewModels[index],
        );
      });

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockCursor.toArray).toHaveBeenCalled();
      expect(mockCollection.countDocuments).toHaveBeenCalled();
      expect(mockTenantMongoDBMapper.toViewModel).toHaveBeenCalledTimes(2);
    });

    it('should return empty paginated result when no tenants match criteria', async () => {
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(0);

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(mockTenantMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save tenant view model using upsert', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T00:00:00Z');
      const updatedAt = new Date('2024-01-01T00:00:00Z');

      const viewModel = new TenantViewModel({
        id: tenantId,
        name: 'Test Tenant',
        slug: 'test-tenant',
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        status: TenantStatusEnum.ACTIVE,
        email: null,
        phoneNumber: null,
        phoneCode: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postalCode: null,
        timezone: null,
        locale: null,
        maxUsers: null,
        maxStorage: null,
        maxApiCalls: null,
        tenantMembers: [],
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const mongoData: TenantMongoDbDto = {
        id: tenantId,
        name: 'Test Tenant',
        slug: 'test-tenant',
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        status: TenantStatusEnum.ACTIVE,
        email: null,
        phoneNumber: null,
        phoneCode: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postalCode: null,
        timezone: null,
        locale: null,
        maxUsers: null,
        maxStorage: null,
        maxApiCalls: null,
        tenantMembers: [],
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      mockTenantMongoDBMapper.toMongoData.mockResolvedValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 1,
        upsertedId: null as any,
      });

      await repository.save(viewModel);

      expect(mockTenantMongoDBMapper.toMongoData).toHaveBeenCalledWith(
        viewModel,
      );
      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: tenantId },
        mongoData,
        { upsert: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete tenant view model and return true', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      });

      const result = await repository.delete(tenantId);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: tenantId });
      expect(mockCollection.deleteOne).toHaveBeenCalledTimes(1);
    });
  });
});
