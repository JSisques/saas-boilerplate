import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { MongoTenantFactory } from '@/shared/infrastructure/database/mongodb/factories/mongo-tenant-factory/mongo-tenant-factory.service';
import { TenantDatabaseUrlBuilderService } from '@/shared/infrastructure/database/mongodb/services/tenant-database-url-builder/tenant-database-url-builder.service';
import { MongoTenantService } from './mongo-tenant.service';
import { Db, Collection } from 'mongodb';

describe('MongoTenantService', () => {
  let service: MongoTenantService;
  let mongoMasterService: jest.Mocked<MongoMasterService>;
  let mongoTenantFactory: jest.Mocked<MongoTenantFactory>;
  let urlBuilder: jest.Mocked<TenantDatabaseUrlBuilderService>;
  let module: TestingModule;
  let mockCollection: jest.Mocked<Collection>;
  let mockDb: jest.Mocked<Db>;

  beforeEach(() => {
    mockCollection = {
      findOne: jest.fn(),
    } as any;

    mockDb = {} as any;

    mongoMasterService = {
      getCollection: jest.fn().mockReturnValue(mockCollection),
    } as any;

    mongoTenantFactory = {
      getTenantDatabase: jest.fn().mockResolvedValue(mockDb),
      removeTenantClient: jest.fn().mockResolvedValue(undefined),
    } as any;

    urlBuilder = {
      buildDatabaseUrl: jest
        .fn()
        .mockReturnValue('mongodb://localhost:27017/tenant_db'),
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
        MongoTenantService,
        {
          provide: MongoMasterService,
          useValue: mongoMasterService,
        },
        {
          provide: MongoTenantFactory,
          useValue: mongoTenantFactory,
        },
        {
          provide: TenantDatabaseUrlBuilderService,
          useValue: urlBuilder,
        },
      ],
    }).compile();

    service = module.get<MongoTenantService>(MongoTenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTenantDatabase', () => {
    const tenantId = 'tenant-123';
    const tenantDatabase = {
      id: 'db-123',
      tenantId,
      databaseName: 'tenant_db',
      databaseUrl: 'tenant_db',
      status: 'ACTIVE',
      schemaVersion: '1.0.0',
      lastMigrationAt: new Date(),
      errorMessage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return tenant database when found and active', async () => {
      mockCollection.findOne.mockResolvedValue(tenantDatabase);

      const db = await service.getTenantDatabase(tenantId);

      expect(mongoMasterService.getCollection).toHaveBeenCalledWith(
        'tenant-databases',
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({ tenantId });
      expect(urlBuilder.buildDatabaseUrl).toHaveBeenCalledWith('tenant_db');
      expect(mongoTenantFactory.getTenantDatabase).toHaveBeenCalledWith(
        tenantId,
        'mongodb://localhost:27017/tenant_db',
        'tenant_db',
      );
      expect(db).toBe(mockDb);
    });

    it('should throw NotFoundException if tenant database not found', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      await expect(service.getTenantDatabase(tenantId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getTenantDatabase(tenantId)).rejects.toThrow(
        `Tenant database not found for tenant: ${tenantId}`,
      );
    });

    it('should throw NotFoundException if tenant database is not active', async () => {
      const inactiveDatabase = {
        ...tenantDatabase,
        status: 'INACTIVE',
      };
      mockCollection.findOne.mockResolvedValue(inactiveDatabase);

      await expect(service.getTenantDatabase(tenantId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getTenantDatabase(tenantId)).rejects.toThrow(
        `Tenant database is not active for tenant: ${tenantId}. Status: INACTIVE`,
      );
    });

    it('should throw NotFoundException for PROVISIONING status', async () => {
      const provisioningDatabase = {
        ...tenantDatabase,
        status: 'PROVISIONING',
      };
      mockCollection.findOne.mockResolvedValue(provisioningDatabase);

      await expect(service.getTenantDatabase(tenantId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for SUSPENDED status', async () => {
      const suspendedDatabase = {
        ...tenantDatabase,
        status: 'SUSPENDED',
      };
      mockCollection.findOne.mockResolvedValue(suspendedDatabase);

      await expect(service.getTenantDatabase(tenantId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('isTenantDatabaseActive', () => {
    const tenantId = 'tenant-123';

    it('should return true if tenant database is active', async () => {
      const tenantDatabase = {
        id: 'db-123',
        tenantId,
        databaseName: 'tenant_db',
        status: 'ACTIVE',
      };
      mockCollection.findOne.mockResolvedValue(tenantDatabase);

      const result = await service.isTenantDatabaseActive(tenantId);

      expect(result).toBe(true);
      expect(mockCollection.findOne).toHaveBeenCalledWith({ tenantId });
    });

    it('should return false if tenant database is not active', async () => {
      const tenantDatabase = {
        id: 'db-123',
        tenantId,
        databaseName: 'tenant_db',
        status: 'INACTIVE',
      };
      mockCollection.findOne.mockResolvedValue(tenantDatabase);

      const result = await service.isTenantDatabaseActive(tenantId);

      expect(result).toBe(false);
    });

    it('should return false if tenant database not found', async () => {
      mockCollection.findOne.mockResolvedValue(null);

      const result = await service.isTenantDatabaseActive(tenantId);

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      mockCollection.findOne.mockRejectedValue(new Error('Database error'));

      const result = await service.isTenantDatabaseActive(tenantId);

      expect(result).toBe(false);
    });
  });

  describe('invalidateTenantClient', () => {
    it('should call removeTenantClient on factory', async () => {
      const tenantId = 'tenant-123';

      await service.invalidateTenantClient(tenantId);

      expect(mongoTenantFactory.removeTenantClient).toHaveBeenCalledWith(
        tenantId,
      );
    });
  });
});
