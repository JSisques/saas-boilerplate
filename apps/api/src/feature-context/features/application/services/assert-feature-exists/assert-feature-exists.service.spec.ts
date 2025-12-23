import { FeatureNotFoundException } from '@/feature-context/features/application/exceptions/feature-not-found/feature-not-found.exception';
import { AssertFeatureExistsService } from '@/feature-context/features/application/services/assert-feature-exists/assert-feature-exists.service';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import {
  FEATURE_WRITE_REPOSITORY_TOKEN,
  IFeatureWriteRepository,
} from '@/feature-context/features/domain/repositories/feature-write.repository';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { Test } from '@nestjs/testing';

describe('AssertFeatureExistsService', () => {
  let service: AssertFeatureExistsService;
  let mockFeatureWriteRepository: jest.Mocked<IFeatureWriteRepository>;

  beforeEach(async () => {
    mockFeatureWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IFeatureWriteRepository>;

    const module = await Test.createTestingModule({
      providers: [
        AssertFeatureExistsService,
        {
          provide: FEATURE_WRITE_REPOSITORY_TOKEN,
          useValue: mockFeatureWriteRepository,
        },
      ],
    }).compile();

    service = module.get<AssertFeatureExistsService>(
      AssertFeatureExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return feature aggregate when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const mockFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: new FeatureDescriptionValueObject(
            'This feature enables advanced analytics capabilities',
          ),
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockFeatureWriteRepository.findById.mockResolvedValue(mockFeature);

      const result = await service.execute(featureId);

      expect(result).toBe(mockFeature);
      expect(mockFeatureWriteRepository.findById).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockFeatureWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw FeatureNotFoundException when feature does not exist', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';

      mockFeatureWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(featureId)).rejects.toThrow(
        FeatureNotFoundException,
      );
      await expect(service.execute(featureId)).rejects.toThrow(
        `Feature with id ${featureId} not found`,
      );

      expect(mockFeatureWriteRepository.findById).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockFeatureWriteRepository.findById).toHaveBeenCalledTimes(2);
    });

    it('should call repository with correct id', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const mockFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockFeatureWriteRepository.findById.mockResolvedValue(mockFeature);

      await service.execute(featureId);

      expect(mockFeatureWriteRepository.findById).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockFeatureWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return feature aggregate with all properties when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const mockFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: new FeatureDescriptionValueObject(
            'This feature enables advanced analytics capabilities',
          ),
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockFeatureWriteRepository.findById.mockResolvedValue(mockFeature);

      const result = await service.execute(featureId);

      expect(result).toBe(mockFeature);
      expect(result.id.value).toBe(featureId);
      expect(result.key.value).toBe('advanced-analytics');
      expect(result.name.value).toBe('Advanced Analytics');
      expect(result.description?.value).toBe(
        'This feature enables advanced analytics capabilities',
      );
      expect(result.status.value).toBe(FeatureStatusEnum.ACTIVE);
    });

    it('should return feature aggregate with null description when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const mockFeature = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(featureId),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.INACTIVE),
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockFeatureWriteRepository.findById.mockResolvedValue(mockFeature);

      const result = await service.execute(featureId);

      expect(result).toBe(mockFeature);
      expect(result.id.value).toBe(featureId);
      expect(result.description).toBeNull();
      expect(result.status.value).toBe(FeatureStatusEnum.INACTIVE);
    });

    it('should handle repository errors correctly', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockFeatureWriteRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.execute(featureId)).rejects.toThrow(repositoryError);

      expect(mockFeatureWriteRepository.findById).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockFeatureWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return feature aggregate with different statuses', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const testCases = [
        FeatureStatusEnum.ACTIVE,
        FeatureStatusEnum.INACTIVE,
        FeatureStatusEnum.DEPRECATED,
      ];

      for (const status of testCases) {
        const mockFeature = new FeatureAggregate(
          {
            id: new FeatureUuidValueObject(featureId),
            key: new FeatureKeyValueObject('advanced-analytics'),
            name: new FeatureNameValueObject('Advanced Analytics'),
            description: null,
            status: new FeatureStatusValueObject(status),
            createdAt: new DateValueObject(new Date()),
            updatedAt: new DateValueObject(new Date()),
          },
          false,
        );

        mockFeatureWriteRepository.findById.mockResolvedValue(mockFeature);

        const result = await service.execute(featureId);

        expect(result.status.value).toBe(status);

        jest.clearAllMocks();
      }
    });
  });
});
