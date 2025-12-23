import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { IUserCreateViewModelDto } from '@/user-context/users/domain/dtos/view-models/user-create/user-create-view-model.dto';
import { UserViewModel } from '@/user-context/users/domain/view-models/user.view-model';
import { UserMongoDbDto } from '@/user-context/users/infrastructure/database/mongodb/dtos/user-mongodb.dto';
import { UserMongoDBMapper } from '@/user-context/users/infrastructure/database/mongodb/mappers/user-mongodb.mapper';
import { UserMongoRepository } from '@/user-context/users/infrastructure/database/mongodb/repositories/user-mongodb.repository';
import { Collection } from 'mongodb';

describe('UserMongoRepository', () => {
  let repository: UserMongoRepository;
  let mockMongoMasterService: jest.Mocked<MongoMasterService>;
  let mockUserMongoDBMapper: jest.Mocked<UserMongoDBMapper>;
  let mockCollection: jest.Mocked<Collection>;

  beforeEach(() => {
    mockCollection = {
      findOne: jest.fn(),
      find: jest.fn(),
      replaceOne: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
    } as unknown as jest.Mocked<Collection>;

    mockMongoMasterService = {
      getCollection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<MongoMasterService>;

    mockUserMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<UserMongoDBMapper>;

    repository = new UserMongoRepository(
      mockMongoMasterService,
      mockUserMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user view model when user exists', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: UserMongoDbDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };

      const viewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };
      const viewModel = new UserViewModel(viewModelDto);

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockUserMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findById(userId);

      expect(result).toBe(viewModel);
      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'users',
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: userId });
      expect(mockUserMongoDBMapper.toViewModel).toHaveBeenCalledWith({
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });
    });

    it('should return null when user does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(userId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: userId });
      expect(mockUserMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result with users when criteria matches', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mongoDocs: UserMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userName: 'johndoe',
          name: 'John',
          lastName: 'Doe',
          bio: null,
          avatarUrl: null,
          role: UserRoleEnum.USER,
          status: UserStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          userName: 'janedoe',
          name: 'Jane',
          lastName: 'Doe',
          bio: null,
          avatarUrl: null,
          role: UserRoleEnum.USER,
          status: UserStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new UserViewModel({
            id: doc.id,
            userName: doc.userName,
            name: doc.name,
            lastName: doc.lastName,
            bio: doc.bio,
            avatarUrl: doc.avatarUrl,
            role: doc.role,
            status: doc.status,
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
        mockUserMongoDBMapper.toViewModel.mockReturnValueOnce(
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

    it('should return empty paginated result when no users match criteria', async () => {
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

    it('should handle criteria with filters', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const criteria = new Criteria(
        [
          {
            field: 'status',
            operator: FilterOperator.EQUALS,
            value: UserStatusEnum.ACTIVE,
          },
        ],
        [],
        { page: 1, perPage: 10 },
      );

      const mongoDocs: UserMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userName: 'johndoe',
          name: 'John',
          lastName: 'Doe',
          bio: null,
          avatarUrl: null,
          role: UserRoleEnum.USER,
          status: UserStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        },
      ];

      const viewModel = new UserViewModel({
        id: mongoDocs[0].id,
        userName: mongoDocs[0].userName,
        name: mongoDocs[0].name,
        lastName: mongoDocs[0].lastName,
        bio: mongoDocs[0].bio,
        avatarUrl: mongoDocs[0].avatarUrl,
        role: mongoDocs[0].role,
        status: mongoDocs[0].status,
        createdAt: mongoDocs[0].createdAt,
        updatedAt: mongoDocs[0].updatedAt,
      });

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mongoDocs),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(1);
      mockUserMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findByCriteria(criteria);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockCollection.find).toHaveBeenCalled();
    });

    it('should handle criteria with sorts', async () => {
      const criteria = new Criteria(
        [],
        [{ field: 'userName', direction: SortDirection.ASC }],
        { page: 1, perPage: 10 },
      );

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(0);

      await repository.findByCriteria(criteria);

      expect(mockCursor.sort).toHaveBeenCalled();
    });

    it('should handle pagination correctly', async () => {
      const criteria = new Criteria([], [], { page: 2, perPage: 5 });

      const mockCursor = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue([]),
      };

      mockCollection.find.mockReturnValue(mockCursor as any);
      mockCollection.countDocuments.mockResolvedValue(0);

      const result = await repository.findByCriteria(criteria);

      expect(result.page).toBe(2);
      expect(result.perPage).toBe(5);
      expect(mockCursor.skip).toHaveBeenCalledWith(5);
      expect(mockCursor.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('save', () => {
    it('should save user view model using upsert', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModelDto: IUserCreateViewModelDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };
      const viewModel = new UserViewModel(viewModelDto);

      const mongoData: UserMongoDbDto = {
        id: userId,
        userName: 'johndoe',
        name: 'John',
        lastName: 'Doe',
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };

      mockUserMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      } as any);

      await repository.save(viewModel);

      expect(mockUserMongoDBMapper.toMongoData).toHaveBeenCalledWith(viewModel);
      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: userId },
        mongoData,
        { upsert: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete user view model and return true', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      } as any);

      const result = await repository.delete(userId);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: userId });
      expect(mockCollection.deleteOne).toHaveBeenCalledTimes(1);
    });

    it('should return true even when user does not exist', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 0,
      } as any);

      const result = await repository.delete(userId);

      expect(result).toBe(true);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: userId });
    });
  });
});
