import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { FeatureTypeormEntity } from '@/feature-context/features/infrastructure/database/typeorm/entities/feature-typeorm.entity';
import { FeatureTypeormMapper } from '@/feature-context/features/infrastructure/database/typeorm/mappers/feature-typeorm.mapper';
import { FeatureTypeormRepository } from '@/feature-context/features/infrastructure/database/typeorm/repositories/feature-typeorm.repository';
import { Repository } from 'typeorm';

describe('FeatureTypeormRepository', () => {
  let repository: FeatureTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockFeatureTypeormMapper: jest.Mocked<FeatureTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<FeatureTypeormEntity>>;
  let mockFindOne: jest.Mock;
  let mockSave: jest.Mock;
  let mockSoftDelete: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockSave = jest.fn();
    mockSoftDelete = jest.fn();

    mockTypeormRepository = {
      findOne: mockFindOne,
      save: mockSave,
      softDelete: mockSoftDelete,
    } as unknown as jest.Mocked<Repository<FeatureTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockFeatureTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<FeatureTypeormMapper>;

    repository = new FeatureTypeormRepository(
      mockTypeormMasterService,
      mockFeatureTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return feature aggregate when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new FeatureTypeormEntity();
      typeormEntity.id = featureId;
      typeormEntity.key = 'advanced-analytics';
      typeormEntity.name = 'Advanced Analytics';
      typeormEntity.description = 'Advanced analytics feature';
      typeormEntity.status = FeatureStatusEnum.ACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const featureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: new FeatureDescriptionValueObject(
            'Advanced analytics feature',
          ),
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockFeatureTypeormMapper.toDomainEntity.mockReturnValue(featureAggregate);

      const result = await repository.findById(featureId);

      expect(result).toBe(featureAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: featureId },
      });
      expect(mockFeatureTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(mockFeatureTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when feature does not exist', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(featureId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: featureId },
      });
      expect(mockFeatureTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save feature aggregate and return saved aggregate', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const featureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: new FeatureDescriptionValueObject(
            'Advanced analytics feature',
          ),
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const typeormEntity = new FeatureTypeormEntity();
      typeormEntity.id = featureId;
      typeormEntity.key = 'advanced-analytics';
      typeormEntity.name = 'Advanced Analytics';
      typeormEntity.status = FeatureStatusEnum.ACTIVE;

      const savedTypeormEntity = new FeatureTypeormEntity();
      savedTypeormEntity.id = featureId;
      savedTypeormEntity.key = 'advanced-analytics';
      savedTypeormEntity.name = 'Advanced Analytics';
      savedTypeormEntity.status = FeatureStatusEnum.ACTIVE;

      const savedFeatureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: new FeatureDescriptionValueObject(
            'Advanced analytics feature',
          ),
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFeatureTypeormMapper.toTypeormEntity.mockReturnValue(typeormEntity);
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockFeatureTypeormMapper.toDomainEntity.mockReturnValue(
        savedFeatureAggregate,
      );

      const result = await repository.save(featureAggregate);

      expect(result).toBe(savedFeatureAggregate);
      expect(mockFeatureTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
        featureAggregate,
      );
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockFeatureTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
      expect(mockFindOne).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete feature', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      await repository.delete(featureId);

      expect(mockSoftDelete).toHaveBeenCalledWith(featureId);
      expect(mockSoftDelete).toHaveBeenCalledTimes(1);
    });

    it('should handle delete errors correctly', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Feature not found');

      mockSoftDelete.mockRejectedValue(error);

      await expect(repository.delete(featureId)).rejects.toThrow(error);
      expect(mockSoftDelete).toHaveBeenCalledWith(featureId);
    });
  });
});
