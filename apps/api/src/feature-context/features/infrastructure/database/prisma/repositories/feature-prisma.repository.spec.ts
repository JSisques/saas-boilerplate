import { FeatureStatusEnum as PrismaFeatureStatusEnum } from '@/prisma/master/client';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { FeaturePrismaDto } from '@/feature-context/features/infrastructure/database/prisma/dtos/feature-prisma.dto';
import { FeaturePrismaMapper } from '@/feature-context/features/infrastructure/database/prisma/mappers/feature-prisma.mapper';
import { FeaturePrismaRepository } from '@/feature-context/features/infrastructure/database/prisma/repositories/feature-prisma.repository';

describe('FeaturePrismaRepository', () => {
  let repository: FeaturePrismaRepository;
  let mockPrismaService: any;
  let mockFeaturePrismaMapper: jest.Mocked<FeaturePrismaMapper>;
  let mockFindUnique: jest.Mock;
  let mockUpsert: jest.Mock;
  let mockDelete: jest.Mock;

  beforeEach(() => {
    mockFindUnique = jest.fn();
    mockUpsert = jest.fn();
    mockDelete = jest.fn();

    mockPrismaService = {
      client: {
        feature: {
          findUnique: mockFindUnique,
          upsert: mockUpsert,
          delete: mockDelete,
        },
      },
    };

    mockFeaturePrismaMapper = {
      toDomainEntity: jest.fn(),
      toPrismaData: jest.fn(),
    } as unknown as jest.Mocked<FeaturePrismaMapper>;

    repository = new FeaturePrismaRepository(
      mockPrismaService,
      mockFeaturePrismaMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return feature aggregate when feature exists', async () => {
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

      mockFindUnique.mockResolvedValue(prismaData);
      mockFeaturePrismaMapper.toDomainEntity.mockReturnValue(featureAggregate);

      const result = await repository.findById(featureId);

      expect(result).toBe(featureAggregate);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: featureId },
      });
      expect(mockFeaturePrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
      expect(mockFeaturePrismaMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when feature does not exist', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindUnique.mockResolvedValue(null);

      const result = await repository.findById(featureId);

      expect(result).toBeNull();
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: featureId },
      });
      expect(mockFeaturePrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });

    it('should handle Prisma errors correctly', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const prismaError = new Error('Database connection error');

      mockFindUnique.mockRejectedValue(prismaError);

      await expect(repository.findById(featureId)).rejects.toThrow(prismaError);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: featureId },
      });
    });
  });

  describe('save', () => {
    it('should save and return feature aggregate when creating new feature', async () => {
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

      const prismaData: FeaturePrismaDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: PrismaFeatureStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const savedPrismaData: FeaturePrismaDto = {
        ...prismaData,
        createdAt: now,
        updatedAt: now,
      };

      mockFeaturePrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockResolvedValue(savedPrismaData);
      mockFeaturePrismaMapper.toDomainEntity.mockReturnValue(featureAggregate);

      const result = await repository.save(featureAggregate);

      expect(result).toBe(featureAggregate);
      expect(mockFeaturePrismaMapper.toPrismaData).toHaveBeenCalledWith(
        featureAggregate,
      );
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: featureId },
        update: prismaData,
        create: prismaData,
      });
      expect(mockFeaturePrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        savedPrismaData,
      );
    });

    it('should save and return feature aggregate when updating existing feature', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const featureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Updated Name'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.INACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const prismaData: FeaturePrismaDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Updated Name',
        description: null,
        status: PrismaFeatureStatusEnum.INACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const savedPrismaData: FeaturePrismaDto = {
        ...prismaData,
        updatedAt: new Date(),
      };

      mockFeaturePrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockResolvedValue(savedPrismaData);
      mockFeaturePrismaMapper.toDomainEntity.mockReturnValue(featureAggregate);

      const result = await repository.save(featureAggregate);

      expect(result).toBe(featureAggregate);
      expect(mockFeaturePrismaMapper.toPrismaData).toHaveBeenCalledWith(
        featureAggregate,
      );
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: featureId },
        update: prismaData,
        create: prismaData,
      });
      expect(mockFeaturePrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        savedPrismaData,
      );
    });

    it('should handle Prisma errors correctly', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const featureAggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const prismaData: FeaturePrismaDto = {
        id: featureId,
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: PrismaFeatureStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const prismaError = new Error('Database connection error');

      mockFeaturePrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockRejectedValue(prismaError);

      await expect(repository.save(featureAggregate)).rejects.toThrow(
        prismaError,
      );
      expect(mockFeaturePrismaMapper.toPrismaData).toHaveBeenCalledWith(
        featureAggregate,
      );
    });
  });

  describe('delete', () => {
    it('should delete feature successfully', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';

      mockDelete.mockResolvedValue(undefined);

      await repository.delete(featureId);

      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: featureId },
      });
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });

    it('should handle Prisma errors correctly', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const prismaError = new Error('Database connection error');

      mockDelete.mockRejectedValue(prismaError);

      await expect(repository.delete(featureId)).rejects.toThrow(prismaError);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: featureId },
      });
    });
  });
});
