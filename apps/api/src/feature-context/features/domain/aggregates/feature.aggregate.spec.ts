import { FeatureCreatedEvent } from '@/shared/domain/events/feature-context/features/feature-created/feature-created.event';
import { FeatureDeletedEvent } from '@/shared/domain/events/feature-context/features/feature-deleted/feature-deleted.event';
import { FeatureStatusChangedEvent } from '@/shared/domain/events/feature-context/features/feature-status-changed/feature-status-changed.event';
import { FeatureUpdatedEvent } from '@/shared/domain/events/feature-context/features/feature-updated/feature-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { FeatureUuidValueObject } from '@/shared/domain/value-objects/identifiers/feature/feature-uuid.vo';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { IFeatureCreateDto } from '@/feature-context/features/domain/dtos/entities/feature-create/feature-create.dto';
import { IFeatureUpdateDto } from '@/feature-context/features/domain/dtos/entities/feature-update/feature-update.dto';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureDescriptionValueObject } from '@/feature-context/features/domain/value-objects/feature-description/feature-description.vo';
import { FeatureKeyValueObject } from '@/feature-context/features/domain/value-objects/feature-key/feature-key.vo';
import { FeatureNameValueObject } from '@/feature-context/features/domain/value-objects/feature-name/feature-name.vo';
import { FeatureStatusValueObject } from '@/feature-context/features/domain/value-objects/feature-status/feature-status.vo';

describe('FeatureAggregate', () => {
  const createProps = (): IFeatureCreateDto => {
    const now = new Date();
    return {
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
  };

  describe('constructor', () => {
    it('should create a FeatureAggregate with all properties', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

      expect(aggregate).toBeInstanceOf(FeatureAggregate);
      expect(aggregate.id.value).toBe(props.id.value);
      expect(aggregate.key.value).toBe(props.key.value);
      expect(aggregate.name.value).toBe(props.name.value);
      expect(aggregate.description?.value).toBe(props.description?.value);
      expect(aggregate.status.value).toBe(props.status.value);
      expect(aggregate.createdAt.value).toEqual(props.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(props.updatedAt.value);
    });

    it('should emit FeatureCreatedEvent on creation by default', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props);

      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(FeatureCreatedEvent);

      const event = events[0] as FeatureCreatedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(FeatureAggregate.name);
      expect(event.eventType).toBe(FeatureCreatedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit FeatureCreatedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });

    it('should create a FeatureAggregate with null description', () => {
      const props = createProps();
      props.description = null;
      const aggregate = new FeatureAggregate(props, false);

      expect(aggregate.description).toBeNull();
    });
  });

  describe('update', () => {
    it('should update the key, name, description, and status', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

      const beforeUpdate = aggregate.updatedAt.value.getTime();
      const updateDto: IFeatureUpdateDto = {
        key: new FeatureKeyValueObject('basic-analytics'),
        name: new FeatureNameValueObject('Basic Analytics'),
        description: new FeatureDescriptionValueObject('Basic analytics'),
        status: new FeatureStatusValueObject(FeatureStatusEnum.INACTIVE),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.key.value).toBe('basic-analytics');
      expect(aggregate.name.value).toBe('Basic Analytics');
      expect(aggregate.description?.value).toBe('Basic analytics');
      expect(aggregate.status.value).toBe(FeatureStatusEnum.INACTIVE);
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate,
      );
    });

    it('should not update properties when they are undefined', () => {
      const props = createProps();
      const originalKey = props.key.value;
      const originalName = props.name.value;
      const aggregate = new FeatureAggregate(props, false);

      const updateDto: IFeatureUpdateDto = {};

      aggregate.update(updateDto, false);

      expect(aggregate.key.value).toBe(originalKey);
      expect(aggregate.name.value).toBe(originalName);
    });

    it('should update only provided properties', () => {
      const props = createProps();
      const originalKey = props.key.value;
      const aggregate = new FeatureAggregate(props, false);

      const updateDto: IFeatureUpdateDto = {
        name: new FeatureNameValueObject('Updated Name'),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.key.value).toBe(originalKey);
      expect(aggregate.name.value).toBe('Updated Name');
    });

    it('should update description to null', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

      const updateDto: IFeatureUpdateDto = {
        description: null,
      };

      aggregate.update(updateDto, false);

      expect(aggregate.description).toBeNull();
    });

    it('should emit FeatureUpdatedEvent on update by default', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

      const updateDto: IFeatureUpdateDto = {
        name: new FeatureNameValueObject('Updated Name'),
      };

      aggregate.update(updateDto);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(FeatureUpdatedEvent);

      const event = events[0] as FeatureUpdatedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(FeatureAggregate.name);
      expect(event.eventType).toBe(FeatureUpdatedEvent.name);
    });

    it('should not emit FeatureUpdatedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

      const updateDto: IFeatureUpdateDto = {
        name: new FeatureNameValueObject('Updated Name'),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('changeStatus', () => {
    it('should change the status and update updatedAt timestamp', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

      const beforeChange = aggregate.updatedAt.value.getTime();
      const newStatus = new FeatureStatusValueObject(
        FeatureStatusEnum.INACTIVE,
      );

      aggregate.changeStatus(newStatus, false);

      expect(aggregate.status.value).toBe(FeatureStatusEnum.INACTIVE);
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeChange,
      );
    });

    it('should emit FeatureStatusChangedEvent on changeStatus by default', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

      const newStatus = new FeatureStatusValueObject(
        FeatureStatusEnum.INACTIVE,
      );

      aggregate.changeStatus(newStatus);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(FeatureStatusChangedEvent);

      const event = events[0] as FeatureStatusChangedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(FeatureAggregate.name);
      expect(event.eventType).toBe(FeatureStatusChangedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit FeatureStatusChangedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

      const newStatus = new FeatureStatusValueObject(
        FeatureStatusEnum.INACTIVE,
      );

      aggregate.changeStatus(newStatus, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should emit FeatureDeletedEvent on delete by default', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

      aggregate.delete();

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(FeatureDeletedEvent);

      const event = events[0] as FeatureDeletedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(FeatureAggregate.name);
      expect(event.eventType).toBe(FeatureDeletedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit FeatureDeletedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

      aggregate.delete(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitives correctly', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives).toEqual({
        id: props.id.value,
        key: props.key.value,
        name: props.name.value,
        description: props.description?.value,
        status: props.status.value,
        createdAt: props.createdAt.value,
        updatedAt: props.updatedAt.value,
      });
    });

    it('should convert aggregate with null description to primitives correctly', () => {
      const props = createProps();
      props.description = null;
      const aggregate = new FeatureAggregate(props, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives.description).toBeNull();
    });
  });

  describe('getters', () => {
    it('should expose value objects through getters', () => {
      const props = createProps();
      const aggregate = new FeatureAggregate(props, false);

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
  });
});
