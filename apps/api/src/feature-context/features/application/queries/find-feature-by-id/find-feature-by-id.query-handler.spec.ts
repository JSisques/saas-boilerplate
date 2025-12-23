import { FeatureNotFoundException } from '@/feature-context/features/application/exceptions/feature-not-found/feature-not-found.exception';
import { AssertFeatureExistsService } from '@/feature-context/features/application/services/assert-feature-exists/assert-feature-exists.service';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { Test } from '@nestjs/testing';
import { FindFeatureByIdQuery } from './find-feature-by-id.query';
import { FindFeatureByIdQueryHandler } from './find-feature-by-id.query-handler';

describe('FindFeatureByIdQueryHandler', () => {
  let handler: FindFeatureByIdQueryHandler;
  let mockAssertFeatureExistsService: jest.Mocked<AssertFeatureExistsService>;

  beforeEach(async () => {
    mockAssertFeatureExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertFeatureExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FindFeatureByIdQueryHandler,
        {
          provide: AssertFeatureExistsService,
          useValue: mockAssertFeatureExistsService,
        },
      ],
    }).compile();

    handler = module.get<FindFeatureByIdQueryHandler>(
      FindFeatureByIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return feature aggregate when feature exists', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FindFeatureByIdQuery({ id: featureId });
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

      mockAssertFeatureExistsService.execute.mockResolvedValue(mockFeature);

      const result = await handler.execute(query);

      expect(result).toBe(mockFeature);
      expect(mockAssertFeatureExistsService.execute).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockAssertFeatureExistsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw FeatureNotFoundException when feature does not exist', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FindFeatureByIdQuery({ id: featureId });
      const error = new FeatureNotFoundException(featureId);

      mockAssertFeatureExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
      expect(mockAssertFeatureExistsService.execute).toHaveBeenCalledWith(
        featureId,
      );
      expect(mockAssertFeatureExistsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should return feature aggregate with all properties', async () => {
      const featureId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FindFeatureByIdQuery({ id: featureId });
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

      mockAssertFeatureExistsService.execute.mockResolvedValue(mockFeature);

      const result = await handler.execute(query);

      expect(result).toBe(mockFeature);
      expect(result.id.value).toBe(featureId);
      expect(result.key.value).toBe('advanced-analytics');
      expect(result.name.value).toBe('Advanced Analytics');
      expect(result.description?.value).toBe(
        'This feature enables advanced analytics capabilities',
      );
      expect(result.status.value).toBe(FeatureStatusEnum.ACTIVE);
    });
  });
});
