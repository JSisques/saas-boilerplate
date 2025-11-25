import { Test, TestingModule } from '@nestjs/testing';
import { Db, MongoClient } from 'mongodb';
import { MongoMasterService } from './mongo-master.service';

jest.mock('mongodb');

describe('MongoMasterService', () => {
  let service: MongoMasterService;
  let module: TestingModule;
  let mockClient: jest.Mocked<MongoClient>;
  let mockDb: jest.Mocked<Db>;

  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      MONGODB_URI: 'mongodb://localhost:27017',
      MONGODB_DATABASE: 'test-db',
    };

    mockDb = {
      collection: jest.fn(),
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
    process.env = originalEnv;
    // Initialize client if not already done to avoid errors in onModuleDestroy
    if (module && service && !service['client']) {
      service['client'] = mockClient;
    }
    if (module) {
      try {
        await module.close();
      } catch {
        // Ignore errors during cleanup
      }
    }
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [MongoMasterService],
    }).compile();

    service = module.get<MongoMasterService>(MongoMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to MongoDB', async () => {
      await service.onModuleInit();

      expect(MongoClient).toHaveBeenCalledWith('mongodb://localhost:27017', {
        authSource: 'admin',
      });
      expect(mockClient.connect).toHaveBeenCalledTimes(1);
      expect(mockClient.db).toHaveBeenCalledWith('test-db');
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      mockClient.connect.mockRejectedValue(error);
      const errorSpy = jest.spyOn(service['logger'], 'error');

      await expect(service.onModuleInit()).rejects.toThrow(error);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error connecting to MongoDB Master:'),
      );
      errorSpy.mockRestore();
    });
  });

  describe('onModuleDestroy', () => {
    it('should close MongoDB connection', async () => {
      await service.onModuleInit();
      await service.onModuleDestroy();

      expect(mockClient.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDatabase', () => {
    it('should return the database instance', async () => {
      await service.onModuleInit();

      const db = service.getDatabase();

      expect(db).toBe(mockDb);
    });
  });

  describe('getCollection', () => {
    it('should return a collection by name', async () => {
      await service.onModuleInit();
      const collectionName = 'users';
      const mockCollection = {} as any;
      mockDb.collection.mockReturnValue(mockCollection);

      const collection = service.getCollection(collectionName);

      expect(mockDb.collection).toHaveBeenCalledWith(collectionName);
      expect(collection).toBe(mockCollection);
    });
  });
});
