import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { ISagaInstanceCreateDto } from '@/saga-context/saga-instance/domain/dtos/entities/saga-instance-create/saga-instance-create.dto';
import { ISagaInstanceUpdateDto } from '@/saga-context/saga-instance/domain/dtos/entities/saga-instance-update/saga-instance-update.dto';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceEndDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-end-date/saga-instance-end-date.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStartDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-start-date/saga-instance-start-date.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceCreatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-created/saga-instance-created.event';
import { SagaInstanceDeletedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-deleted/saga-instance-deleted.event';
import { SagaInstanceStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-status-changed/saga-instance-status-changed.event';
import { SagaInstanceUpdatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-updated/saga-instance-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

describe('SagaInstanceAggregate', () => {
  const createBaseAggregate = (
    generateEvent: boolean = false,
  ): SagaInstanceAggregate => {
    const now = new Date();
    const dto: ISagaInstanceCreateDto = {
      id: new SagaInstanceUuidValueObject(
        '123e4567-e89b-12d3-a456-426614174000',
      ),
      name: new SagaInstanceNameValueObject('Order Processing Saga'),
      status: new SagaInstanceStatusValueObject(SagaInstanceStatusEnum.PENDING),
      startDate: null,
      endDate: null,
      createdAt: new DateValueObject(now),
      updatedAt: new DateValueObject(now),
    };

    return new SagaInstanceAggregate(dto, generateEvent);
  };

  describe('constructor', () => {
    it('should create a SagaInstanceAggregate with all properties', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate).toBeInstanceOf(SagaInstanceAggregate);
      expect(aggregate.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(aggregate.name.value).toBe('Order Processing Saga');
      expect(aggregate.status.value).toBe(SagaInstanceStatusEnum.PENDING);
      expect(aggregate.startDate).toBeNull();
      expect(aggregate.endDate).toBeNull();
    });

    it('should emit SagaInstanceCreatedEvent on creation by default', () => {
      const aggregate = createBaseAggregate(true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaInstanceCreatedEvent);

      const event = events[0] as SagaInstanceCreatedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(SagaInstanceAggregate.name);
      expect(event.eventType).toBe(SagaInstanceCreatedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit SagaInstanceCreatedEvent when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });

    it('should create aggregate with all optional fields set', () => {
      const now = new Date();
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const dto: ISagaInstanceCreateDto = {
        id: new SagaInstanceUuidValueObject(),
        name: new SagaInstanceNameValueObject('Test Saga'),
        status: new SagaInstanceStatusValueObject(
          SagaInstanceStatusEnum.COMPLETED,
        ),
        startDate: new SagaInstanceStartDateValueObject(startDate),
        endDate: new SagaInstanceEndDateValueObject(endDate),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = new SagaInstanceAggregate(dto, false);

      expect(aggregate.startDate?.value).toEqual(startDate);
      expect(aggregate.endDate?.value).toEqual(endDate);
      expect(aggregate.status.value).toBe(SagaInstanceStatusEnum.COMPLETED);
    });
  });

  describe('update', () => {
    it('should update saga instance name', () => {
      const aggregate = createBaseAggregate(false);
      const originalUpdatedAt = aggregate.updatedAt.value;
      const newName = new SagaInstanceNameValueObject('Updated Saga Name');

      aggregate.update({ name: newName }, false);

      expect(aggregate.name.value).toBe('Updated Saga Name');
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should update saga instance status', () => {
      const aggregate = createBaseAggregate(false);
      const newStatus = new SagaInstanceStatusValueObject(
        SagaInstanceStatusEnum.STARTED,
      );

      aggregate.update({ status: newStatus }, false);

      expect(aggregate.status.value).toBe(SagaInstanceStatusEnum.STARTED);
    });

    it('should update start date', () => {
      const aggregate = createBaseAggregate(false);
      const newStartDate = new SagaInstanceStartDateValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );

      aggregate.update({ startDate: newStartDate }, false);

      expect(aggregate.startDate?.value).toEqual(newStartDate.value);
    });

    it('should update end date', () => {
      const aggregate = createBaseAggregate(false);
      const newEndDate = new SagaInstanceEndDateValueObject(
        new Date('2024-01-01T11:00:00Z'),
      );

      aggregate.update({ endDate: newEndDate }, false);

      expect(aggregate.endDate?.value).toEqual(newEndDate.value);
    });

    it('should update multiple fields at once', () => {
      const aggregate = createBaseAggregate(false);
      const updateDto: ISagaInstanceUpdateDto = {
        name: new SagaInstanceNameValueObject('Multi Updated Saga'),
        status: new SagaInstanceStatusValueObject(
          SagaInstanceStatusEnum.RUNNING,
        ),
        startDate: new SagaInstanceStartDateValueObject(
          new Date('2024-01-01T10:00:00Z'),
        ),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.name.value).toBe('Multi Updated Saga');
      expect(aggregate.status.value).toBe(SagaInstanceStatusEnum.RUNNING);
      expect(aggregate.startDate?.value).toEqual(
        new Date('2024-01-01T10:00:00Z'),
      );
    });

    it('should not update fields that are undefined', () => {
      const aggregate = createBaseAggregate(false);
      const originalName = aggregate.name.value;
      const originalStatus = aggregate.status.value;

      aggregate.update({}, false);

      expect(aggregate.name.value).toBe(originalName);
      expect(aggregate.status.value).toBe(originalStatus);
    });

    it('should emit SagaInstanceUpdatedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);
      const updateDto: ISagaInstanceUpdateDto = {
        name: new SagaInstanceNameValueObject('Updated Saga'),
      };

      aggregate.update(updateDto, true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaInstanceUpdatedEvent);

      const event = events[0] as SagaInstanceUpdatedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit event when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);
      const updateDto: ISagaInstanceUpdateDto = {
        name: new SagaInstanceNameValueObject('Updated Saga'),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should emit SagaInstanceDeletedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.delete(true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaInstanceDeletedEvent);

      const event = events[0] as SagaInstanceDeletedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(SagaInstanceAggregate.name);
      expect(event.eventType).toBe(SagaInstanceDeletedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit event when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.delete(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('markAsCompleted', () => {
    it('should mark saga instance as completed and set end date', () => {
      const aggregate = createBaseAggregate(false);
      const beforeUpdate = new Date();

      aggregate.markAsCompleted(false);

      expect(aggregate.status.value).toBe(SagaInstanceStatusEnum.COMPLETED);
      expect(aggregate.endDate).not.toBeNull();
      expect(aggregate.endDate?.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
    });

    it('should emit SagaInstanceStatusChangedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.markAsCompleted(true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaInstanceStatusChangedEvent);
    });
  });

  describe('markAsFailed', () => {
    it('should mark saga instance as failed and set end date', () => {
      const aggregate = createBaseAggregate(false);
      const beforeUpdate = new Date();

      aggregate.markAsFailed(false);

      expect(aggregate.status.value).toBe(SagaInstanceStatusEnum.FAILED);
      expect(aggregate.endDate).not.toBeNull();
      expect(aggregate.endDate?.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
    });

    it('should emit SagaInstanceStatusChangedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.markAsFailed(true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaInstanceStatusChangedEvent);
    });
  });

  describe('markAsCompensated', () => {
    it('should mark saga instance as compensated and set end date', () => {
      const aggregate = createBaseAggregate(false);
      const beforeUpdate = new Date();

      aggregate.markAsCompensated(false);

      expect(aggregate.status.value).toBe(SagaInstanceStatusEnum.COMPENSATED);
      expect(aggregate.endDate).not.toBeNull();
      expect(aggregate.endDate?.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
    });

    it('should emit SagaInstanceStatusChangedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.markAsCompensated(true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaInstanceStatusChangedEvent);
    });
  });

  describe('markAsCompensating', () => {
    it('should mark saga instance as compensating', () => {
      const aggregate = createBaseAggregate(false);
      const beforeUpdate = new Date();

      aggregate.markAsCompensating(false);

      expect(aggregate.status.value).toBe(SagaInstanceStatusEnum.COMPENSATING);
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
    });

    it('should not set end date when marking as compensating', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.markAsCompensating(false);

      expect(aggregate.endDate).toBeNull();
    });

    it('should emit SagaInstanceStatusChangedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.markAsCompensating(true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaInstanceStatusChangedEvent);
    });
  });

  describe('markAsPending', () => {
    it('should mark saga instance as pending and clear dates', () => {
      const aggregate = createBaseAggregate(false);
      // Set some dates first
      aggregate.update(
        {
          startDate: new SagaInstanceStartDateValueObject(
            new Date('2024-01-01T10:00:00Z'),
          ),
          endDate: new SagaInstanceEndDateValueObject(
            new Date('2024-01-01T11:00:00Z'),
          ),
        },
        false,
      );

      aggregate.markAsPending(false);

      expect(aggregate.status.value).toBe(SagaInstanceStatusEnum.PENDING);
      expect(aggregate.startDate).toBeNull();
      expect(aggregate.endDate).toBeNull();
    });

    it('should emit SagaInstanceStatusChangedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.markAsPending(true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaInstanceStatusChangedEvent);
    });
  });

  describe('markAsStarted', () => {
    it('should mark saga instance as started and set start date', () => {
      const aggregate = createBaseAggregate(false);
      const beforeUpdate = new Date();

      aggregate.markAsStarted(false);

      expect(aggregate.status.value).toBe(SagaInstanceStatusEnum.STARTED);
      expect(aggregate.startDate).not.toBeNull();
      expect(aggregate.startDate?.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(aggregate.endDate).toBeNull();
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
    });

    it('should emit SagaInstanceStatusChangedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.markAsStarted(true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaInstanceStatusChangedEvent);
    });
  });

  describe('markAsRunning', () => {
    it('should mark saga instance as running', () => {
      const aggregate = createBaseAggregate(false);
      const beforeUpdate = new Date();

      aggregate.markAsRunning(false);

      expect(aggregate.status.value).toBe(SagaInstanceStatusEnum.RUNNING);
      expect(aggregate.endDate).toBeNull();
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
    });

    it('should emit SagaInstanceStatusChangedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.markAsRunning(true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaInstanceStatusChangedEvent);
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitives with all fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const dto: ISagaInstanceCreateDto = {
        id: new SagaInstanceUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        name: new SagaInstanceNameValueObject('Test Saga'),
        status: new SagaInstanceStatusValueObject(
          SagaInstanceStatusEnum.COMPLETED,
        ),
        startDate: new SagaInstanceStartDateValueObject(startDate),
        endDate: new SagaInstanceEndDateValueObject(endDate),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = new SagaInstanceAggregate(dto, false);
      const primitives = aggregate.toPrimitives();

      expect(primitives).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Saga',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert aggregate to primitives with null optional fields', () => {
      const aggregate = createBaseAggregate(false);
      const primitives = aggregate.toPrimitives();

      expect(primitives.startDate).toBeNull();
      expect(primitives.endDate).toBeNull();
    });
  });

  describe('getters', () => {
    it('should return correct id', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate.id).toBeInstanceOf(SagaInstanceUuidValueObject);
      expect(aggregate.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return correct name', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate.name).toBeInstanceOf(SagaInstanceNameValueObject);
      expect(aggregate.name.value).toBe('Order Processing Saga');
    });

    it('should return correct status', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate.status).toBeInstanceOf(SagaInstanceStatusValueObject);
      expect(aggregate.status.value).toBe(SagaInstanceStatusEnum.PENDING);
    });

    it('should return correct startDate', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate.startDate).toBeNull();
    });

    it('should return correct endDate', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate.endDate).toBeNull();
    });
  });
});
