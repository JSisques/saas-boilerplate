import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { FeatureMongoDbDto } from '@/feature-context/features/infrastructure/database/mongodb/dtos/feature-mongodb.dto';
import { FeatureMongoDBMapper } from '@/feature-context/features/infrastructure/database/mongodb/mappers/feature-mongodb.mapper';
import { FeatureMongoRepository } from '@/feature-context/features/infrastructure/database/mongodb/repositories/feature-mongodb.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Collection } from 'mongodb';

describe('FeatureMongoRepository', () => {
  let repository: FeatureMongoRepository;
  let mockMongoMasterService: jest.Mocked<MongoMasterService>;
  let mockFeatureMongoDBMapper: jest.Mocked<FeatureMongoDBMapper>;
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

    mockFeatureMongoDBMapper = {
      toViewModel: jest.fn(),
      toMongoData: jest.fn(),
    } as unknown as jest.Mocked<FeatureMongoDBMapper>;

    repository = new FeatureMongoRepository(
      mockMongoMasterService,
      mockFeatureMongoDBMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return feature view model when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: FeatureMongoDbDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };

      const viewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });

      mockCollection.findOne.mockResolvedValue(mongoDoc);
      mockFeatureMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findById(featureId);

      expect(result).toBe(viewModel);
      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'features',
      );
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: featureId });
      expect(mockFeatureMongoDBMapper.toViewModel).toHaveBeenCalledWith({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });
      expect(mockFeatureMongoDBMapper.toViewModel).toHaveBeenCalledTimes(1);
    });

    it('should return null when feature does not exist', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.findOne.mockResolvedValue(null);

      const result = await repository.findById(featureId);

      expect(result).toBeNull();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: featureId });
      expect(mockFeatureMongoDBMapper.toViewModel).not.toHaveBeenCalled();
    });

    it('should handle MongoDB errors correctly', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const mongoError = new Error('Database connection error');

      mockCollection.findOne.mockRejectedValue(mongoError);

      await expect(repository.findById(featureId)).rejects.toThrow(mongoError);
      expect(mockCollection.findOne).toHaveBeenCalledWith({ id: featureId });
    });
  });

  describe('findByCriteria', () => {
    it('should return paginated result with features when criteria matches', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const criteria = new Criteria([], [], { page: 1, perPage: 10 });

      const mongoDocs: FeatureMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          key: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: 'This feature enables advanced analytics capabilities',
          status: FeatureStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          key: 'api-access',
          name: 'API Access',
          description: null,
          status: FeatureStatusEnum.INACTIVE,
          createdAt,
          updatedAt,
        },
      ];

      const viewModels = mongoDocs.map(
        (doc) =>
          new FeatureViewModel({
            id: doc.id,
            key: doc.key,
            name: doc.name,
            description: doc.description,
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
        mockFeatureMongoDBMapper.toViewModel.mockReturnValueOnce(
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

    it('should return empty paginated result when no features match criteria', async () => {
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
            value: FeatureStatusEnum.ACTIVE,
          },
        ],
        [],
        { page: 1, perPage: 10 },
      );

      const mongoDocs: FeatureMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          key: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: null,
          status: FeatureStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        },
      ];

      const viewModel = new FeatureViewModel({
        id: mongoDocs[0].id,
        key: mongoDocs[0].key,
        name: mongoDocs[0].name,
        description: mongoDocs[0].description,
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
      mockFeatureMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      const result = await repository.findByCriteria(criteria);

      expect(result).toBeInstanceOf(PaginatedResult);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockCollection.find).toHaveBeenCalled();
    });

    it('should handle criteria with sorting', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const criteria = new Criteria(
        [],
        [{ field: 'name', direction: SortDirection.ASC }],
        { page: 1, perPage: 10 },
      );

      const mongoDocs: FeatureMongoDbDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          key: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: null,
          status: FeatureStatusEnum.ACTIVE,
          createdAt,
          updatedAt,
        },
      ];

      const viewModel = new FeatureViewModel({
        id: mongoDocs[0].id,
        key: mongoDocs[0].key,
        name: mongoDocs[0].name,
        description: mongoDocs[0].description,
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
      mockFeatureMongoDBMapper.toViewModel.mockReturnValue(viewModel);

      await repository.findByCriteria(criteria);

      expect(mockCursor.sort).toHaveBeenCalled();
    });

    it('should handle pagination correctly', async () => {
      const criteria = new Criteria([], [], { page: 2, perPage: 20 });

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
      expect(result.perPage).toBe(20);
      expect(mockCursor.skip).toHaveBeenCalledWith(20);
      expect(mockCursor.limit).toHaveBeenCalledWith(20);
    });
  });

  describe('save', () => {
    it('should save feature view model successfully', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const viewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });

      const mongoData: FeatureMongoDbDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };

      mockFeatureMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      } as any);

      await repository.save(viewModel);

      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'features',
      );
      expect(mockFeatureMongoDBMapper.toMongoData).toHaveBeenCalledWith(
        viewModel,
      );
      expect(mockCollection.replaceOne).toHaveBeenCalledWith(
        { id: featureId },
        mongoData,
        { upsert: true },
      );
    });

    it('should handle MongoDB errors correctly', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const viewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });

      const mongoData: FeatureMongoDbDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };

      const mongoError = new Error('Database connection error');

      mockFeatureMongoDBMapper.toMongoData.mockReturnValue(mongoData);
      mockCollection.replaceOne.mockRejectedValue(mongoError);

      await expect(repository.save(viewModel)).rejects.toThrow(mongoError);
      expect(mockFeatureMongoDBMapper.toMongoData).toHaveBeenCalledWith(
        viewModel,
      );
    });
  });

  describe('delete', () => {
    it('should delete feature view model successfully', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
      } as any);

      await repository.delete(featureId);

      expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
        'features',
      );
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: featureId });
      expect(mockCollection.deleteOne).toHaveBeenCalledTimes(1);
    });

    it('should handle MongoDB errors correctly', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const mongoError = new Error('Database connection error');

      mockCollection.deleteOne.mockRejectedValue(mongoError);

      await expect(repository.delete(featureId)).rejects.toThrow(mongoError);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: featureId });
    });
  });
});
