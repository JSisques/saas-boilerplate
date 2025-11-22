import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { MongoService } from '@/shared/infrastructure/database/mongodb/services/mongo.service';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberMongoDbDto } from '@/tenant-context/tenant-members/infrastructure/database/mongodb/dtos/tenant-member-mongodb.dto';
import { TenantMemberMongoDBMapper } from '@/tenant-context/tenant-members/infrastructure/database/mongodb/mappers/tenant-member-mongodb.mapper';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { Collection } from 'mongodb';
import { TenantMemberMongoRepository } from './tenant-member-mongodb.repository';

describe('TenantMemberMongoRepository', () => {
  let repository: TenantMemberMongoRepository;
  let mockMongoService: jest.Mocked<MongoService>;
  let mockTenantMemberMongoDBMapper: jest.Mocked<TenantMemberMongoDBMapper>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn(),
      replaceOne: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    mockMongoService = {
      getCollection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<MongoService>;

    mockTenantMemberMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberMongoDBMapper>;

    repository = new TenantMemberMongoRepository(
      mockMongoService,
      mockTenantMemberMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return tenant member view model when tenant member exists', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mongoDoc: TenantMemberMongoDbDto = {
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: mongoDoc.tenantId,
        userId: mongoDoc.userId,
        role: mongoDoc.role,
        createdAt: now,
        updatedAt: now,
      });

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockTenantMemberMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findById(tenantMemberId);

      expect(result).toBe(viewModel);
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: tenantMemberId });
      expect(mockTenantMemberMongoDBMapper.toViewModel).toHaveBeenCalledWith({
        id: tenantMemberId,
        tenantId: mongoDoc.tenantId,
        userId: mongoDoc.userId,
        role: mongoDoc.role,
        createdAt: mongoDoc.createdAt,
        updatedAt: mongoDoc.updatedAt,
      });
      expect(mockTenantMemberMongoDBMapper.toViewModel).toHaveBeenCalledTimes(1);
    });

    it('should return null when tenant member does not exist', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(tenantMemberId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: tenantMemberId });
      expect(mockTenantMemberMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });
  });

  describe('findByTenantId', () => {
    it('should return array of tenant member view models when tenant members exist', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mongoDocs: TenantMemberMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId,
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.MEMBER,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '423e4567-e89b-12d3-a456-426614174000',
          tenantId,
          userId: '523e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.ADMIN,
          createdAt: now,
          updatedAt: now,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new TenantMemberViewModel({
            id: doc.id,
            tenantId: doc.tenantId,
            userId: doc.userId,
            role: doc.role,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);

      mongoDocs.forEach((doc, index) => {
        mockTenantMemberMongoDBMapper.toViewModel.mockReturnValueOnce(
          viewModels[index],
        );
      });

      const result = await repository.findByTenantId(tenantId);

      expect(result).toHaveLength(2);
      expect(mockCollection.find).toHaveBeenCalledWith({ tenantId });
      expect(mockTenantMemberMongoDBMapper.toViewModel).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no tenant members exist', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);

      const result = await repository.findByTenantId(tenantId);

      expect(result).toEqual([]);
      expect(mockCollection.find).toHaveBeenCalledWith({ tenantId });
    });
  });

  describe('findByUserId', () => {
    it('should return array of tenant member view models when tenant members exist', async () => {
      const userId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mongoDocs: TenantMemberMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId,
          role: TenantMemberRoleEnum.MEMBER,
          createdAt: now,
          updatedAt: now,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new TenantMemberViewModel({
            id: doc.id,
            tenantId: doc.tenantId,
            userId: doc.userId,
            role: doc.role,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          }),
      );

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockTenantMemberMongoDBMapper.toViewModel.mockReturnValue(viewModels[0]);

      const result = await repository.findByUserId(userId);

      expect(result).toHaveLength(1);
      expect(mockCollection.find).toHaveBeenCalledWith({ userId });
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result with tenant members when criteria matches', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mongoDocs: TenantMemberMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.MEMBER,
          createdAt,
          updatedAt,
        },
        {
          id: '423e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '523e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.ADMIN,
          createdAt,
          updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new TenantMemberViewModel({
            id: doc.id,
            tenantId: doc.tenantId,
            userId: doc.userId,
            role: doc.role,
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
        mockTenantMemberMongoDBMapper.toViewModel.mockReturnValueOnce(
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
      expect(mockCursor.sort).toHaveBeenCalled();
      expect(mockCursor.skip).toHaveBeenCalledWith(0);
      expect(mockCursor.limit).toHaveBeenCalledWith(10);
      expect(mockCollection.countDocuments).toHaveBeenCalled();
    });

    it('should return empty paginated result when no tenant members match criteria', async () => {
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
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });
  });

  describe('save', () => {
    it('should save tenant member view model using upsert', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const viewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      });

      const mongoData: TenantMemberMongoDbDto = {
        id: tenantMemberId,
        tenantId: viewModel.tenantId,
        userId: viewModel.userId,
        role: viewModel.role,
        createdAt: now,
        updatedAt: now,
      };

      mockTenantMemberMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue(undefined);

      await repository.save(viewModel);

      expect(mockTenantMemberMongoDBMapper.toMongoData).toHaveBeenCalledWith(
        viewModel,
      );
      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: tenantMemberId },
        mongoData,
        { upsert: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete tenant member view model and return true', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 } as any);

      const result = await repository.delete(tenantMemberId);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        id: tenantMemberId,
      });
    });
  });
});

