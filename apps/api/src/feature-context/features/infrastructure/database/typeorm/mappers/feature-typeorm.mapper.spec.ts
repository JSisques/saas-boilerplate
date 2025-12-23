import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureAggregateFactory } from '@/feature-context/features/domain/factories/feature-aggregate/feature-aggregate.factory';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { FeatureTypeormEntity } from '@/feature-context/features/infrastructure/database/typeorm/entities/feature-typeorm.entity';
import { FeatureTypeormMapper } from '@/feature-context/features/infrastructure/database/typeorm/mappers/feature-typeorm.mapper';

describe('FeatureTypeormMapper', () => {
  let mapper: FeatureTypeormMapper;
  let mockFeatureAggregateFactory: jest.Mocked<FeatureAggregateFactory>;

  beforeEach(() => {
    mockFeatureAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<FeatureAggregateFactory>;

    mapper = new FeatureTypeormMapper(mockFeatureAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
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
      typeormEntity.deletedAt = null;

      const mockFeatureAggregate = new FeatureAggregate(
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

      mockFeatureAggregateFactory.fromPrimitives.mockReturnValue(
        mockFeatureAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockFeatureAggregate);
      expect(mockFeatureAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'Advanced analytics feature',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });
      expect(mockFeatureAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should convert TypeORM entity with null optional properties', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new FeatureTypeormEntity();
      typeormEntity.id = featureId;
      typeormEntity.key = 'basic-feature';
      typeormEntity.name = 'Basic Feature';
      typeormEntity.description = null;
      typeormEntity.status = FeatureStatusEnum.INACTIVE;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockFeatureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('basic-feature'),
          name: new FeatureNameValueObject('Basic Feature'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.INACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFeatureAggregateFactory.fromPrimitives.mockReturnValue(
        mockFeatureAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockFeatureAggregate);
      expect(mockFeatureAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: featureId,
        key: 'basic-feature',
        name: 'Basic Feature',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockFeatureAggregate = new FeatureAggregate(
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

      const toPrimitivesSpy = jest
        .spyOn(mockFeatureAggregate, 'toPrimitives')
        .mockReturnValue({
          id: featureId,
          key: 'advanced-analytics',
          name: 'Advanced Analytics',
          description: 'Advanced analytics feature',
          status: FeatureStatusEnum.ACTIVE,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockFeatureAggregate);

      expect(result).toBeInstanceOf(FeatureTypeormEntity);
      expect(result.id).toBe(featureId);
      expect(result.key).toBe('advanced-analytics');
      expect(result.name).toBe('Advanced Analytics');
      expect(result.description).toBe('Advanced analytics feature');
      expect(result.status).toBe(FeatureStatusEnum.ACTIVE);
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });

    it('should convert domain entity with null optional properties', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockFeatureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('basic-feature'),
          name: new FeatureNameValueObject('Basic Feature'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.INACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockFeatureAggregate, 'toPrimitives')
        .mockReturnValue({
          id: featureId,
          key: 'basic-feature',
          name: 'Basic Feature',
          description: null,
          status: FeatureStatusEnum.INACTIVE,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockFeatureAggregate);

      expect(result).toBeInstanceOf(FeatureTypeormEntity);
      expect(result.id).toBe(featureId);
      expect(result.key).toBe('basic-feature');
      expect(result.name).toBe('Basic Feature');
      expect(result.description).toBeNull();
      expect(result.status).toBe(FeatureStatusEnum.INACTIVE);
      expect(result.deletedAt).toBeNull();

      toPrimitivesSpy.mockRestore();
    });
  });
});
