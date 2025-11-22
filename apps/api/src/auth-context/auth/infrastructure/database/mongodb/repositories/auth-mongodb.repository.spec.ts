import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { MongoService } from '@/shared/infrastructure/database/mongodb/services/mongo.service';
import { AuthViewModel } from '@/auth-context/auth/domain/view-models/auth.view-model';
import { AuthMongoRepository } from '@/auth-context/auth/infrastructure/database/mongodb/repositories/auth-mongodb.repository';
import { AuthMongoDBMapper } from '@/auth-context/auth/infrastructure/database/mongodb/mappers/auth-mongodb.mapper';
import { AuthMongoDbDto } from '@/auth-context/auth/infrastructure/database/mongodb/dtos/auth-mongodb.dto';
import { AuthProviderEnum } from '@/auth-context/auth/domain/enums/auth-provider.enum';
import { Collection } from 'mongodb';

describe('AuthMongoRepository', () => {
  let repository: AuthMongoRepository;
  let mockMongoService: jest.Mocked<MongoService>;
  let mockAuthMongoDBMapper: jest.Mocked<AuthMongoDBMapper>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    const findChain = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([]),
    };

    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn().mockReturnValue(findChain),
      replaceOne: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    mockMongoService = {
      getCollection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<MongoService>;

    mockAuthMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<AuthMongoDBMapper>;

    repository = new AuthMongoRepository(
      mockMongoService,
      mockAuthMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return auth view model when auth exists', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const mongoDoc: AuthMongoDbDto = {
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        phoneNumber: '+1234567890',
        lastLoginAt: now,
        password: '$2b$12$hashedpassword',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = new AuthViewModel({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        lastLoginAt: now,
        password: '$2b$12$hashedpassword',
        phoneNumber: '+1234567890',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      });

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockAuthMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findById(authId);

      expect(result).toBe(viewModel);
      expect(mockMongoService.getCollection).toHaveBeenCalledWith('auths');
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: authId });
      expect(mockAuthMongoDBMapper.toViewModel).toHaveBeenCalledWith(mongoDoc);
    });

    it('should return null when auth does not exist', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(authId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: authId });
      expect(mockAuthMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result with auths when criteria matches', async () => {
      const now = new Date();
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mongoDocs: any[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          email: 'test1@example.com',
          emailVerified: true,
          phoneNumber: null,
          lastLoginAt: now,
          password: '$2b$12$hashedpassword',
          provider: AuthProviderEnum.LOCAL,
          providerId: null,
          twoFactorEnabled: false,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174002',
          userId: '323e4567-e89b-12d3-a456-426614174003',
          email: 'test2@example.com',
          emailVerified: false,
          phoneNumber: null,
          lastLoginAt: null,
          password: null,
          provider: AuthProviderEnum.GOOGLE,
          providerId: 'google-123',
          twoFactorEnabled: true,
          createdAt: now,
          updatedAt: now,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new AuthViewModel({
            id: doc.id,
            userId: doc.userId,
            email: doc.email,
            emailVerified: doc.emailVerified,
            lastLoginAt: doc.lastLoginAt,
            password: doc.password,
            phoneNumber: doc.phoneNumber,
            provider: doc.provider,
            providerId: doc.providerId,
            twoFactorEnabled: doc.twoFactorEnabled,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const findChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };
      mockCollection.find.mockReturnValue(findChain as any);
      mockCollection.countDocuments.mockResolvedValue(2);
      mockAuthMongoDBMapper.toViewModel
        .mockReturnValueOnce(viewModels[0])
        .mockReturnValueOnce(viewModels[1]);

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockMongoService.getCollection).toHaveBeenCalledWith('auths');
      expect(mockAuthMongoDBMapper.toViewModel).toHaveBeenCalledTimes(2);
    });

    it('should return empty paginated result when no auths found', async () => {
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const findChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };
      mockCollection.find.mockReturnValue(findChain as any);
      mockCollection.countDocuments.mockResolvedValue(0);

      const result = await repository.findByCriteria(criteria);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });
  });

  describe('save', () => {
    it('should save auth view model', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const now = new Date();

      const viewModel = new AuthViewModel({
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        lastLoginAt: now,
        password: '$2b$12$hashedpassword',
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      });

      const mongoData: AuthMongoDbDto = {
        id: authId,
        userId: userId,
        email: 'test@example.com',
        emailVerified: true,
        phoneNumber: null,
        lastLoginAt: now,
        password: '$2b$12$hashedpassword',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: now,
        updatedAt: now,
      };

      mockAuthMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      } as any);

      await repository.save(viewModel);

      expect(mockMongoService.getCollection).toHaveBeenCalledWith('auths');
      expect(mockAuthMongoDBMapper.toMongoData).toHaveBeenCalledWith(viewModel);
      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: authId },
        mongoData,
        { upsert: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete auth view model and return true', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      } as any);

      const result = await repository.delete(authId);

      expect(result).toBe(true);
      expect(mockMongoService.getCollection).toHaveBeenCalledWith('auths');
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: authId });
    });
  });
});
