import { FeatureCreatedEvent } from '@/shared/domain/events/feature-context/features/feature-created/feature-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { IFeatureCreateDto } from '@/feature-context/features/domain/dtos/entities/feature-create/feature-create.dto';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureAggregateFactory } from '@/feature-context/features/domain/factories/feature-aggregate/feature-aggregate.factory';
import { FeaturePrimitives } from '@/feature-context/features/domain/primitives/feature.primitives';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';

describe('FeatureAggregateFactory', () => {
  let factory: FeatureAggregateFactory;

  beforeEach(() => {
    factory = new FeatureAggregateFactory();
  });

  describe('create', () => {
    it('should create a FeatureAggregate from DTO with all fields and generate event by default', () => {
      const now = new Date();

      const dto: IFeatureCreateDto = {
        id: new FeatureUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        key: new FeatureKeyValueObject('advanced-analytics'),
        name: new FeatureNameValueObject('Advanced Analytics'),
        description: new FeatureDescriptionValueObject(
          'This feature enables advanced analytics capabilities',
        ),
        status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(FeatureAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.key.value).toBe(dto.key.value);
      expect(aggregate.name.value).toBe(dto.name.value);
      expect(aggregate.description?.value).toBe(dto.description?.value);
      expect(aggregate.status.value).toBe(dto.status.value);
      expect(aggregate.createdAt.value).toEqual(dto.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(dto.updatedAt.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(FeatureCreatedEvent);
    });

    it('should create a FeatureAggregate from DTO without generating event when generateEvent is false', () => {
      const now = new Date();

      const dto: IFeatureCreateDto = {
        id: new FeatureUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        key: new FeatureKeyValueObject('advanced-analytics'),
        name: new FeatureNameValueObject('Advanced Analytics'),
        description: new FeatureDescriptionValueObject(
          'This feature enables advanced analytics capabilities',
        ),
        status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(FeatureAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.key.value).toBe(dto.key.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });

    it('should create a FeatureAggregate from DTO with null description', () => {
      const now = new Date();

      const dto: IFeatureCreateDto = {
        id: new FeatureUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        key: new FeatureKeyValueObject('advanced-analytics'),
        name: new FeatureNameValueObject('Advanced Analytics'),
        description: null,
        status: new FeatureStatusValueObject(FeatureStatusEnum.ACTIVE),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(FeatureAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.key.value).toBe(dto.key.value);
      expect(aggregate.name.value).toBe(dto.name.value);
      expect(aggregate.description).toBeNull();
      expect(aggregate.status.value).toBe(dto.status.value);
    });
  });

  describe('fromPrimitives', () => {
    it('should create a FeatureAggregate from primitives with all fields', () => {
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

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(FeatureAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.key.value).toBe(primitives.key);
      expect(aggregate.name.value).toBe(primitives.name);
      expect(aggregate.description?.value).toBe(primitives.description);
      expect(aggregate.status.value).toBe(primitives.status);
      expect(aggregate.createdAt.value).toEqual(primitives.createdAt);
      expect(aggregate.updatedAt.value).toEqual(primitives.updatedAt);
    });

    it('should create a FeatureAggregate from primitives with null description', () => {
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

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(FeatureAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.key.value).toBe(primitives.key);
      expect(aggregate.name.value).toBe(primitives.name);
      expect(aggregate.description).toBeNull();
      expect(aggregate.status.value).toBe(primitives.status);
    });

    it('should create value objects correctly from primitives', () => {
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

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate.id).toBeInstanceOf(FeatureUuidValueObject);
      expect(aggregate.key).toBeInstanceOf(FeatureKeyValueObject);
      expect(aggregate.name).toBeInstanceOf(FeatureNameValueObject);
      expect(aggregate.description).toBeInstanceOf(
        FeatureDescriptionValueObject,
      );
      expect(aggregate.status).toBeInstanceOf(FeatureStatusValueObject);
      expect(aggregate.createdAt).toBeInstanceOf(DateValueObject);
      expect(aggregate.updatedAt).toBeInstanceOf(DateValueObject);
    });

    it('should not generate events when creating from primitives', () => {
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

      const aggregate = factory.fromPrimitives(primitives);

      // fromPrimitives calls new FeatureAggregate with generateEvent = false
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });
  });
});
