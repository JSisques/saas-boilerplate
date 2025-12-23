import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureViewModelFactory } from '@/feature-context/features/domain/factories/feature-view-model/feature-view-model.factory';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { IFeatureCreateViewModelDto } from '@/feature-context/features/domain/dtos/view-models/feature-create/feature-create-view-model.dto';
import { FeatureMongoDbDto } from '@/feature-context/features/infrastructure/database/mongodb/dtos/feature-mongodb.dto';
import { FeatureMongoDBMapper } from '@/feature-context/features/infrastructure/database/mongodb/mappers/feature-mongodb.mapper';

describe('FeatureMongoDBMapper', () => {
  let mapper: FeatureMongoDBMapper;
  let mockFeatureViewModelFactory: jest.Mocked<FeatureViewModelFactory>;

  beforeEach(() => {
    mockFeatureViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<FeatureViewModelFactory>;

    mapper = new FeatureMongoDBMapper(mockFeatureViewModelFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
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

      const mockViewModelDto: IFeatureCreateViewModelDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      };
      const mockViewModel = new FeatureViewModel(mockViewModelDto);

      mockFeatureViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockFeatureViewModelFactory.create).toHaveBeenCalledWith({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      });
      expect(mockFeatureViewModelFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should convert MongoDB document to view model with null description', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: FeatureMongoDbDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      };

      const mockViewModelDto: IFeatureCreateViewModelDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      };
      const mockViewModel = new FeatureViewModel(mockViewModelDto);

      mockFeatureViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockFeatureViewModelFactory.create).toHaveBeenCalledWith({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      });
    });

    it('should convert MongoDB document with DEPRECATED status', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const mongoDoc: FeatureMongoDbDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.DEPRECATED,
        createdAt,
        updatedAt,
      };

      const mockViewModelDto: IFeatureCreateViewModelDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.DEPRECATED,
        createdAt,
        updatedAt,
      };
      const mockViewModel = new FeatureViewModel(mockViewModelDto);

      mockFeatureViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoDoc);

      expect(result).toBe(mockViewModel);
      expect(mockFeatureViewModelFactory.create).toHaveBeenCalledWith({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.DEPRECATED,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
      });
    });
  });

  describe('toMongoData', () => {
    it('should convert feature view model to MongoDB document with all properties', () => {
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

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt,
        updatedAt,
      });
    });

    it('should convert feature view model to MongoDB document with null description', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const viewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt,
        updatedAt,
      });
    });

    it('should convert feature view model with DEPRECATED status to MongoDB document', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const viewModel = new FeatureViewModel({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.DEPRECATED,
        createdAt,
        updatedAt,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.DEPRECATED,
        createdAt,
        updatedAt,
      });
    });
  });
});
