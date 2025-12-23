import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { IFeatureCreateViewModelDto } from '@/feature-context/features/domain/dtos/view-models/feature-create/feature-create-view-model.dto';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureViewModelFactory } from '@/feature-context/features/domain/factories/feature-view-model/feature-view-model.factory';
import { FeaturePrimitives } from '@/feature-context/features/domain/primitives/feature.primitives';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';

describe('FeatureViewModelFactory', () => {
  let factory: FeatureViewModelFactory;

  beforeEach(() => {
    factory = new FeatureViewModelFactory();
  });

  describe('create', () => {
    it('should create a FeatureViewModel from a DTO with all fields', () => {
      const now = new Date();

      const dto: IFeatureCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(FeatureViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.key).toBe(dto.key);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.description).toBe(dto.description);
      expect(viewModel.status).toBe(dto.status);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });

    it('should create a FeatureViewModel from a DTO with null description', () => {
      const now = new Date();

      const dto: IFeatureCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(FeatureViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.key).toBe(dto.key);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.description).toBeNull();
      expect(viewModel.status).toBe(dto.status);
      expect(viewModel.createdAt).toBe(dto.createdAt);
      expect(viewModel.updatedAt).toBe(dto.updatedAt);
    });
  });

  describe('fromPrimitives', () => {
    it('should create a FeatureViewModel from primitives with all fields', () => {
      const now = new Date();

      const primitives: FeaturePrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(FeatureViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.key).toBe(primitives.key);
      expect(viewModel.name).toBe(primitives.name);
      expect(viewModel.description).toBe(primitives.description);
      expect(viewModel.status).toBe(primitives.status);
      expect(viewModel.createdAt).toBe(primitives.createdAt);
      expect(viewModel.updatedAt).toBe(primitives.updatedAt);
    });

    it('should create a FeatureViewModel from primitives with null description', () => {
      const now = new Date();

      const primitives: FeaturePrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: null,
        status: FeatureStatusEnum.INACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(FeatureViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.key).toBe(primitives.key);
      expect(viewModel.name).toBe(primitives.name);
      expect(viewModel.description).toBeNull();
      expect(viewModel.status).toBe(primitives.status);
      expect(viewModel.createdAt).toBe(now);
      expect(viewModel.updatedAt).toBe(now);
    });

    it('should set createdAt and updatedAt to Date objects', () => {
      const now = new Date();

      const primitives: FeaturePrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
      expect(viewModel.createdAt.getTime()).toBe(viewModel.updatedAt.getTime());
    });
  });

  describe('fromAggregate', () => {
    it('should create a FeatureViewModel from aggregate with all fields', () => {
      const now = new Date();

      const aggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
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

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(FeatureViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.key).toBe(aggregate.key.value);
      expect(viewModel.name).toBe(aggregate.name.value);
      expect(viewModel.description).toBe(aggregate.description?.value);
      expect(viewModel.status).toBe(aggregate.status.value);
      expect(viewModel.createdAt).toBe(aggregate.createdAt.value);
      expect(viewModel.updatedAt).toBe(aggregate.updatedAt.value);
    });

    it('should create a FeatureViewModel from aggregate with null description', () => {
      const now = new Date();

      const aggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.INACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(FeatureViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.key).toBe(aggregate.key.value);
      expect(viewModel.name).toBe(aggregate.name.value);
      expect(viewModel.description).toBeNull();
      expect(viewModel.status).toBe(aggregate.status.value);
    });

    it('should set createdAt and updatedAt to Date objects', () => {
      const now = new Date();

      const aggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
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

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
      expect(viewModel.createdAt.getTime()).toBe(viewModel.updatedAt.getTime());
    });

    it('should handle null description correctly', () => {
      const now = new Date();

      const aggregate = new FeatureAggregate(
        {
          id: new FeatureUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          key: new FeatureKeyValueObject('advanced-analytics'),
          name: new FeatureNameValueObject('Advanced Analytics'),
          description: null,
          status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel.description).toBeNull();
      expect(viewModel.createdAt).toBe(aggregate.createdAt.value);
      expect(viewModel.updatedAt).toBe(aggregate.updatedAt.value);
    });
  });
});
