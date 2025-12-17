import { FeatureStatusEnum as PrismaFeatureStatusEnum } from '@/prisma/master/client';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureAggregateFactory } from '@/feature-context/features/domain/factories/feature-aggregate/feature-aggregate.factory';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { FeaturePrismaDto } from '@/feature-context/features/infrastructure/database/prisma/dtos/feature-prisma.dto';
import { FeaturePrismaMapper } from '@/feature-context/features/infrastructure/database/prisma/mappers/feature-prisma.mapper';

describe('FeaturePrismaMapper', () => {
  let mapper: FeaturePrismaMapper;
  let mockFeatureAggregateFactory: jest.Mocked<FeatureAggregateFactory>;

  beforeEach(() => {
    mockFeatureAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<FeatureAggregateFactory>;

    mapper = new FeaturePrismaMapper(mockFeatureAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert Prisma data to domain entity with all properties', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: FeaturePrismaDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: PrismaFeatureStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const mockFeatureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: new FeatureDescriptionValueObject(
            'This feature enables advanced analytics capabilities',
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

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockFeatureAggregate);
      expect(mockFeatureAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: PrismaFeatureStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });
      expect(mockFeatureAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should convert Prisma data to domain entity with null description', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: FeaturePrismaDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: PrismaFeatureStatusEnum.INACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const mockFeatureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
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

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockFeatureAggregate);
      expect(mockFeatureAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: PrismaFeatureStatusEnum.INACTIVE,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert Prisma data with DEPRECATED status', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: FeaturePrismaDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: PrismaFeatureStatusEnum.DEPRECATED,
        createdAt: now,
        updatedAt: now,
      };

      const mockFeatureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.DEPRECATED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFeatureAggregateFactory.fromPrimitives.mockReturnValue(
        mockFeatureAggregate,
      );

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockFeatureAggregate);
      expect(mockFeatureAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: PrismaFeatureStatusEnum.DEPRECATED,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toPrismaData', () => {
    it('should convert feature aggregate to Prisma data with all properties', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const featureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: new FeatureDescriptionValueObject(
            'This feature enables advanced analytics capabilities',
          ),
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const result = mapper.toPrismaData(featureAggregate);

      expect(result).toEqual({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: PrismaFeatureStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert feature aggregate to Prisma data with null description', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const featureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.INACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const result = mapper.toPrismaData(featureAggregate);

      expect(result).toEqual({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: PrismaFeatureStatusEnum.INACTIVE,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert feature aggregate with DEPRECATED status to Prisma data', () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const featureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.DEPRECATED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const result = mapper.toPrismaData(featureAggregate);

      expect(result).toEqual({
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: PrismaFeatureStatusEnum.DEPRECATED,
        createdAt: now,
        updatedAt: now,
      });
    });
  });
});
