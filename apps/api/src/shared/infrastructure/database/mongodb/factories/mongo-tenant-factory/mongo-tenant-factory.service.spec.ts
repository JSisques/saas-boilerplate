import { Test, TestingModule } from '@nestjs/testing';
import { Db, MongoClient } from 'mongodb';
import { MongoTenantFactory } from './mongo-tenant-factory.service';

jest.mock('mongodb');

describe('MongoTenantFactory', () => {
  let factory: MongoTenantFactory;
  let module: TestingModule;
  let mockClient: jest.Mocked<MongoClient>;
  let mockDb: jest.Mocked<Db>;
  let mockAdmin: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAdmin = {
      ping: jest.fn().mockResolvedValue({ ok: 1 }),
    };

    mockDb = {
      admin: jest.fn().mockReturnValue(mockAdmin),
    } as any;

    mockClient = {
      connect: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
      db: jest.fn().mockReturnValue(mockDb),
    } as any;

    (MongoClient as jest.MockedClass<typeof MongoClient>).mockImplementation(
      () => mockClient,
    );
  });

  afterEach(async () => {
    if (factory) {
      await factory.disconnectAll().catch(() => {});
    }
    if (module) {
      try {
        await module.close();
      } catch {
        // Ignore errors during cleanup
      }
    }
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [MongoTenantFactory],
    }).compile();

    factory = module.get<MongoTenantFactory>(MongoTenantFactory);
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  describe('getTenantDatabase', () => {
    const tenantId = 'tenant-123';
    const databaseUrl = 'mongodb://localhost:27017';
    const databaseName = 'tenant_db';

    it('should create and cache a new database connection', async () => {
      const db = await factory.getTenantDatabase(
        tenantId,
        databaseUrl,
        databaseName,
      );

      expect(MongoClient).toHaveBeenCalledWith(databaseUrl, {
        authSource: 'admin',
      });
      expect(mockClient.connect).toHaveBeenCalledTimes(1);
      expect(mockClient.db).toHaveBeenCalledWith(databaseName);
      expect(db).toBe(mockDb);
    });

    it('should return cached database if connection is valid', async () => {
      // First call
      await factory.getTenantDatabase(tenantId, databaseUrl, databaseName);

      // Reset mocks to track second call
      jest.clearAllMocks();
      mockAdmin.ping.mockResolvedValue({ ok: 1 });

      // Second call should return cached
      const db = await factory.getTenantDatabase(
        tenantId,
        databaseUrl,
        databaseName,
      );

      // Should not create new client, just ping existing
      expect(MongoClient).not.toHaveBeenCalled();
      expect(mockClient.connect).not.toHaveBeenCalled();
      expect(db).toBe(mockDb);
    });

    it('should recreate connection if ping fails', async () => {
      // First call to create connection
      await factory.getTenantDatabase(tenantId, databaseUrl, databaseName);

      // Create new mock client for reconnection
      const newMockClient = {
        connect: jest.fn().mockResolvedValue(undefined),
        close: jest.fn().mockResolvedValue(undefined),
        db: jest.fn().mockReturnValue(mockDb),
      } as any;

      // Make ping fail on first client
      mockAdmin.ping.mockRejectedValueOnce(new Error('Connection lost'));

      // Mock new client creation
      (
        MongoClient as jest.MockedClass<typeof MongoClient>
      ).mockImplementationOnce(() => newMockClient);

      // Second call should recreate
      const db = await factory.getTenantDatabase(
        tenantId,
        databaseUrl,
        databaseName,
      );

      expect(mockClient.close).toHaveBeenCalledTimes(1); // Closed the old one
      expect(newMockClient.connect).toHaveBeenCalledTimes(1);
      expect(db).toBe(mockDb);
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      mockClient.connect.mockRejectedValueOnce(error);

      await expect(
        factory.getTenantDatabase(tenantId, databaseUrl, databaseName),
      ).rejects.toThrow(error);

      expect(mockClient.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeTenantClient', () => {
    it('should remove tenant client from cache', async () => {
      const tenantId = 'tenant-123';
      const databaseUrl = 'mongodb://localhost:27017';
      const databaseName = 'tenant_db';

      await factory.getTenantDatabase(tenantId, databaseUrl, databaseName);
      await factory.removeTenantClient(tenantId);

      expect(mockClient.close).toHaveBeenCalledTimes(1);
      expect(factory.getActiveTenantIds()).not.toContain(tenantId);
    });

    it('should not throw if tenant client does not exist', async () => {
      await expect(
        factory.removeTenantClient('non-existent-tenant'),
      ).resolves.not.toThrow();
    });
  });

  describe('getActiveTenantIds', () => {
    it('should return array of active tenant IDs', async () => {
      await factory.getTenantDatabase(
        'tenant-1',
        'mongodb://localhost:27017',
        'db1',
      );
      await factory.getTenantDatabase(
        'tenant-2',
        'mongodb://localhost:27017',
        'db2',
      );

      const activeIds = factory.getActiveTenantIds();

      expect(activeIds).toContain('tenant-1');
      expect(activeIds).toContain('tenant-2');
      expect(activeIds.length).toBe(2);
    });

    it('should return empty array if no tenants are active', () => {
      expect(factory.getActiveTenantIds()).toEqual([]);
    });
  });

  describe('disconnectAll', () => {
    it('should disconnect all tenant clients', async () => {
      await factory.getTenantDatabase(
        'tenant-1',
        'mongodb://localhost:27017',
        'db1',
      );
      await factory.getTenantDatabase(
        'tenant-2',
        'mongodb://localhost:27017',
        'db2',
      );

      await factory.disconnectAll();

      expect(mockClient.close).toHaveBeenCalledTimes(2);
      expect(factory.getActiveTenantIds()).toEqual([]);
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect all clients when module is destroyed', async () => {
      await factory.getTenantDatabase(
        'tenant-1',
        'mongodb://localhost:27017',
        'db1',
      );

      await factory.onModuleDestroy();

      expect(mockClient.close).toHaveBeenCalled();
      expect(factory.getActiveTenantIds()).toEqual([]);
    });
  });
});
