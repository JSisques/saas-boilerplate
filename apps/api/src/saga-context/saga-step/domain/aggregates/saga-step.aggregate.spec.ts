import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { ISagaStepCreateDto } from '@/saga-context/saga-step/domain/dtos/entities/saga-step-create/saga-step-create.dto';
import { ISagaStepUpdateDto } from '@/saga-context/saga-step/domain/dtos/entities/saga-step-update/saga-step-update.dto';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepEndDateValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-end-date/saga-step-end-date.vo';
import { SagaStepErrorMessageValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-error-message/saga-step-error-message.vo';
import { SagaStepMaxRetriesValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-max-retries/saga-step-max-retries.vo';
import { SagaStepNameValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-name/saga-step-name.vo';
import { SagaStepOrderValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-order/saga-step-order.vo';
import { SagaStepPayloadValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-payload/saga-step-payload.vo';
import { SagaStepResultValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-result/saga-step-result.vo';
import { SagaStepRetryCountValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-retry-count/saga-step-retry-count.vo';
import { SagaStepStartDateValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-start-date/saga-step-start-date.vo';
import { SagaStepStatusValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-status/saga-step-status.vo';
import { SagaStepCreatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-created/saga-step-created.event';
import { SagaStepDeletedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-deleted/saga-step-deleted.event';
import { SagaStepStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-status-changed/saga-step-status-changed.event';
import { SagaStepUpdatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-updated/saga-step-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

describe('SagaStepAggregate', () => {
  const createBaseAggregate = (
    generateEvent: boolean = false,
  ): SagaStepAggregate => {
    const now = new Date();
    const dto: ISagaStepCreateDto = {
      id: new SagaStepUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
      sagaInstanceId: new SagaInstanceUuidValueObject(
        '223e4567-e89b-12d3-a456-426614174000',
      ),
      name: new SagaStepNameValueObject('Process Payment'),
      order: new SagaStepOrderValueObject(1),
      status: new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING),
      startDate: null,
      endDate: null,
      errorMessage: null,
      retryCount: new SagaStepRetryCountValueObject(0),
      maxRetries: new SagaStepMaxRetriesValueObject(3),
      payload: new SagaStepPayloadValueObject({ orderId: '12345' }),
      result: new SagaStepResultValueObject({}),
      createdAt: new DateValueObject(now),
      updatedAt: new DateValueObject(now),
    };

    return new SagaStepAggregate(dto, generateEvent);
  };

  describe('constructor', () => {
    it('should create a SagaStepAggregate with all properties', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate).toBeInstanceOf(SagaStepAggregate);
      expect(aggregate.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(aggregate.sagaInstanceId.value).toBe(
        '223e4567-e89b-12d3-a456-426614174000',
      );
      expect(aggregate.name.value).toBe('Process Payment');
      expect(aggregate.order.value).toBe(1);
      expect(aggregate.status.value).toBe(SagaStepStatusEnum.PENDING);
      expect(aggregate.startDate).toBeNull();
      expect(aggregate.endDate).toBeNull();
      expect(aggregate.errorMessage).toBeNull();
      expect(aggregate.retryCount.value).toBe(0);
      expect(aggregate.maxRetries.value).toBe(3);
      expect(aggregate.payload.value).toEqual({ orderId: '12345' });
      expect(aggregate.result.value).toEqual({});
    });

    it('should emit SagaStepCreatedEvent on creation by default', () => {
      const aggregate = createBaseAggregate(true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaStepCreatedEvent);

      const event = events[0] as SagaStepCreatedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(SagaStepAggregate.name);
      expect(event.eventType).toBe(SagaStepCreatedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit SagaStepCreatedEvent when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });

    it('should create aggregate with all optional fields set', () => {
      const now = new Date();
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const dto: ISagaStepCreateDto = {
        id: new SagaStepUuidValueObject(),
        sagaInstanceId: new SagaInstanceUuidValueObject(),
        name: new SagaStepNameValueObject('Test Step'),
        order: new SagaStepOrderValueObject(2),
        status: new SagaStepStatusValueObject(SagaStepStatusEnum.COMPLETED),
        startDate: new SagaStepStartDateValueObject(startDate),
        endDate: new SagaStepEndDateValueObject(endDate),
        errorMessage: new SagaStepErrorMessageValueObject('Test error'),
        retryCount: new SagaStepRetryCountValueObject(1),
        maxRetries: new SagaStepMaxRetriesValueObject(5),
        payload: new SagaStepPayloadValueObject({ test: 'data' }),
        result: new SagaStepResultValueObject({ success: true }),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = new SagaStepAggregate(dto, false);

      expect(aggregate.startDate).not.toBeNull();
      expect(aggregate.endDate).not.toBeNull();
      expect(aggregate.errorMessage).not.toBeNull();
      expect(aggregate.errorMessage?.value).toBe('Test error');
      expect(aggregate.result.value).toEqual({ success: true });
    });
  });

  describe('getters', () => {
    it('should expose id via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.id).toBeInstanceOf(SagaStepUuidValueObject);
      expect(aggregate.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should expose sagaInstanceId via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.sagaInstanceId).toBeInstanceOf(
        SagaInstanceUuidValueObject,
      );
      expect(aggregate.sagaInstanceId.value).toBe(
        '223e4567-e89b-12d3-a456-426614174000',
      );
    });

    it('should expose name via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.name).toBeInstanceOf(SagaStepNameValueObject);
      expect(aggregate.name.value).toBe('Process Payment');
    });

    it('should expose order via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.order).toBeInstanceOf(SagaStepOrderValueObject);
      expect(aggregate.order.value).toBe(1);
    });

    it('should expose status via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.status).toBeInstanceOf(SagaStepStatusValueObject);
      expect(aggregate.status.value).toBe(SagaStepStatusEnum.PENDING);
    });

    it('should expose startDate via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.startDate).toBeNull();
    });

    it('should expose endDate via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.endDate).toBeNull();
    });

    it('should expose errorMessage via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.errorMessage).toBeNull();
    });

    it('should expose retryCount via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.retryCount).toBeInstanceOf(
        SagaStepRetryCountValueObject,
      );
      expect(aggregate.retryCount.value).toBe(0);
    });

    it('should expose maxRetries via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.maxRetries).toBeInstanceOf(
        SagaStepMaxRetriesValueObject,
      );
      expect(aggregate.maxRetries.value).toBe(3);
    });

    it('should expose payload via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.payload).toBeInstanceOf(SagaStepPayloadValueObject);
      expect(aggregate.payload.value).toEqual({ orderId: '12345' });
    });

    it('should expose result via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.result).toBeInstanceOf(SagaStepResultValueObject);
      expect(aggregate.result.value).toEqual({});
    });
  });

  describe('update', () => {
    it('should update name when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const originalName = aggregate.name.value;
      const newName = new SagaStepNameValueObject('Updated Step Name');

      aggregate.update({ name: newName }, false);

      expect(aggregate.name.value).toBe('Updated Step Name');
      expect(aggregate.name.value).not.toBe(originalName);
    });

    it('should keep original name when undefined is provided', () => {
      const aggregate = createBaseAggregate();
      const originalName = aggregate.name.value;

      aggregate.update({ name: undefined }, false);

      expect(aggregate.name.value).toBe(originalName);
    });

    it('should update order when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newOrder = new SagaStepOrderValueObject(5);

      aggregate.update({ order: newOrder }, false);

      expect(aggregate.order.value).toBe(5);
    });

    it('should update status when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newStatus = new SagaStepStatusValueObject(
        SagaStepStatusEnum.STARTED,
      );

      aggregate.update({ status: newStatus }, false);

      expect(aggregate.status.value).toBe(SagaStepStatusEnum.STARTED);
    });

    it('should update startDate when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newStartDate = new SagaStepStartDateValueObject(
        new Date('2024-01-01T10:00:00Z'),
      );

      aggregate.update({ startDate: newStartDate }, false);

      expect(aggregate.startDate).not.toBeNull();
      expect(aggregate.startDate?.value).toEqual(newStartDate.value);
    });

    it('should set startDate to null when null is provided', () => {
      const now = new Date();
      const dto: ISagaStepCreateDto = {
        id: new SagaStepUuidValueObject(),
        sagaInstanceId: new SagaInstanceUuidValueObject(),
        name: new SagaStepNameValueObject('Test'),
        order: new SagaStepOrderValueObject(1),
        status: new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING),
        startDate: new SagaStepStartDateValueObject(now),
        endDate: null,
        errorMessage: null,
        retryCount: new SagaStepRetryCountValueObject(0),
        maxRetries: new SagaStepMaxRetriesValueObject(3),
        payload: new SagaStepPayloadValueObject({}),
        result: new SagaStepResultValueObject({}),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };
      const aggregate = new SagaStepAggregate(dto, false);

      aggregate.update({ startDate: null }, false);

      expect(aggregate.startDate).toBeNull();
    });

    it('should update endDate when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newEndDate = new SagaStepEndDateValueObject(
        new Date('2024-01-01T11:00:00Z'),
      );

      aggregate.update({ endDate: newEndDate }, false);

      expect(aggregate.endDate).not.toBeNull();
      expect(aggregate.endDate?.value).toEqual(newEndDate.value);
    });

    it('should update errorMessage when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newErrorMessage = new SagaStepErrorMessageValueObject(
        'New error message',
      );

      aggregate.update({ errorMessage: newErrorMessage }, false);

      expect(aggregate.errorMessage).not.toBeNull();
      expect(aggregate.errorMessage?.value).toBe('New error message');
    });

    it('should set errorMessage to null when null is provided', () => {
      const now = new Date();
      const dto: ISagaStepCreateDto = {
        id: new SagaStepUuidValueObject(),
        sagaInstanceId: new SagaInstanceUuidValueObject(),
        name: new SagaStepNameValueObject('Test'),
        order: new SagaStepOrderValueObject(1),
        status: new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING),
        startDate: null,
        endDate: null,
        errorMessage: new SagaStepErrorMessageValueObject('Error'),
        retryCount: new SagaStepRetryCountValueObject(0),
        maxRetries: new SagaStepMaxRetriesValueObject(3),
        payload: new SagaStepPayloadValueObject({}),
        result: new SagaStepResultValueObject({}),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };
      const aggregate = new SagaStepAggregate(dto, false);

      aggregate.update({ errorMessage: null }, false);

      expect(aggregate.errorMessage).toBeNull();
    });

    it('should update retryCount when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newRetryCount = new SagaStepRetryCountValueObject(2);

      aggregate.update({ retryCount: newRetryCount }, false);

      expect(aggregate.retryCount.value).toBe(2);
    });

    it('should update maxRetries when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newMaxRetries = new SagaStepMaxRetriesValueObject(10);

      aggregate.update({ maxRetries: newMaxRetries }, false);

      expect(aggregate.maxRetries.value).toBe(10);
    });

    it('should update payload when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newPayload = new SagaStepPayloadValueObject({ newKey: 'newValue' });

      aggregate.update({ payload: newPayload }, false);

      expect(aggregate.payload.value).toEqual({ newKey: 'newValue' });
    });

    it('should update result when new value is provided', () => {
      const aggregate = createBaseAggregate();
      const newResult = new SagaStepResultValueObject({ success: true });

      aggregate.update({ result: newResult }, false);

      expect(aggregate.result.value).toEqual({ success: true });
    });

    it('should update multiple fields at once', () => {
      const aggregate = createBaseAggregate();
      const updateDto: ISagaStepUpdateDto = {
        name: new SagaStepNameValueObject('Updated Name'),
        order: new SagaStepOrderValueObject(10),
        status: new SagaStepStatusValueObject(SagaStepStatusEnum.RUNNING),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.name.value).toBe('Updated Name');
      expect(aggregate.order.value).toBe(10);
      expect(aggregate.status.value).toBe(SagaStepStatusEnum.RUNNING);
    });

    it('should update updatedAt timestamp', () => {
      const aggregate = createBaseAggregate();
      const originalUpdatedAt = aggregate.updatedAt.value;
      // Wait a bit to ensure different timestamp
      const beforeUpdate = new Date();

      aggregate.update({ name: new SagaStepNameValueObject('Updated') }, false);

      const afterUpdate = new Date();
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(aggregate.updatedAt.value.getTime()).toBeLessThanOrEqual(
        afterUpdate.getTime(),
      );
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should generate SagaStepUpdatedEvent when updating with generateEvent true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event
      const newName = new SagaStepNameValueObject('Updated Name');

      aggregate.update({ name: newName }, true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaStepUpdatedEvent);

      const event = events[0] as SagaStepUpdatedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(SagaStepAggregate.name);
      expect(event.eventType).toBe(SagaStepUpdatedEvent.name);
      expect(event.data.name).toBe('Updated Name');
    });

    it('should not generate event when generateEvent is false', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.update({ name: new SagaStepNameValueObject('Updated') }, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should generate SagaStepDeletedEvent when deleting with generateEvent true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit(); // Clear creation event

      aggregate.delete(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaStepDeletedEvent);

      const event = events[0] as SagaStepDeletedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(SagaStepAggregate.name);
      expect(event.eventType).toBe(SagaStepDeletedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not generate event when generateEvent is false', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.delete(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('markAsCompleted', () => {
    it('should set status to COMPLETED', () => {
      const aggregate = createBaseAggregate();

      aggregate.markAsCompleted(false);

      expect(aggregate.status.value).toBe(SagaStepStatusEnum.COMPLETED);
    });

    it('should set endDate to current date', () => {
      const aggregate = createBaseAggregate();
      const beforeMark = new Date();

      aggregate.markAsCompleted(false);

      const afterMark = new Date();
      expect(aggregate.endDate).not.toBeNull();
      expect(aggregate.endDate?.value.getTime()).toBeGreaterThanOrEqual(
        beforeMark.getTime(),
      );
      expect(aggregate.endDate?.value.getTime()).toBeLessThanOrEqual(
        afterMark.getTime(),
      );
    });

    it('should update updatedAt timestamp', () => {
      const aggregate = createBaseAggregate();
      const originalUpdatedAt = aggregate.updatedAt.value;
      const beforeMark = new Date();

      aggregate.markAsCompleted(false);

      const afterMark = new Date();
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeMark.getTime(),
      );
      expect(aggregate.updatedAt.value.getTime()).toBeLessThanOrEqual(
        afterMark.getTime(),
      );
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should generate SagaStepStatusChangedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.markAsCompleted(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaStepStatusChangedEvent);

      const event = events[0] as SagaStepStatusChangedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.data.status).toBe(SagaStepStatusEnum.COMPLETED);
    });
  });

  describe('markAsFailed', () => {
    it('should set status to FAILED', () => {
      const aggregate = createBaseAggregate();

      aggregate.markAsFailed(undefined, false);

      expect(aggregate.status.value).toBe(SagaStepStatusEnum.FAILED);
    });

    it('should set endDate to current date', () => {
      const aggregate = createBaseAggregate();
      const beforeMark = new Date();

      aggregate.markAsFailed(undefined, false);

      const afterMark = new Date();
      expect(aggregate.endDate).not.toBeNull();
      expect(aggregate.endDate?.value.getTime()).toBeGreaterThanOrEqual(
        beforeMark.getTime(),
      );
      expect(aggregate.endDate?.value.getTime()).toBeLessThanOrEqual(
        afterMark.getTime(),
      );
    });

    it('should set errorMessage when provided', () => {
      const aggregate = createBaseAggregate();

      aggregate.markAsFailed('Payment processing failed', false);

      expect(aggregate.errorMessage).not.toBeNull();
      expect(aggregate.errorMessage?.value).toBe('Payment processing failed');
    });

    it('should not set errorMessage when not provided', () => {
      const aggregate = createBaseAggregate();

      aggregate.markAsFailed(undefined, false);

      expect(aggregate.errorMessage).toBeNull();
    });

    it('should update updatedAt timestamp', () => {
      const aggregate = createBaseAggregate();
      const originalUpdatedAt = aggregate.updatedAt.value;

      aggregate.markAsFailed('Error', false);

      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should generate SagaStepStatusChangedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.markAsFailed('Error message', true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaStepStatusChangedEvent);

      const event = events[0] as SagaStepStatusChangedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.data.status).toBe(SagaStepStatusEnum.FAILED);
      expect(event.data.errorMessage).toBe('Error message');
    });
  });

  describe('markAsPending', () => {
    it('should set status to PENDING', () => {
      const aggregate = createBaseAggregate();
      aggregate.update(
        { status: new SagaStepStatusValueObject(SagaStepStatusEnum.STARTED) },
        false,
      );

      aggregate.markAsPending(false);

      expect(aggregate.status.value).toBe(SagaStepStatusEnum.PENDING);
    });

    it('should set startDate to null', () => {
      const now = new Date();
      const dto: ISagaStepCreateDto = {
        id: new SagaStepUuidValueObject(),
        sagaInstanceId: new SagaInstanceUuidValueObject(),
        name: new SagaStepNameValueObject('Test'),
        order: new SagaStepOrderValueObject(1),
        status: new SagaStepStatusValueObject(SagaStepStatusEnum.STARTED),
        startDate: new SagaStepStartDateValueObject(now),
        endDate: null,
        errorMessage: null,
        retryCount: new SagaStepRetryCountValueObject(0),
        maxRetries: new SagaStepMaxRetriesValueObject(3),
        payload: new SagaStepPayloadValueObject({}),
        result: new SagaStepResultValueObject({}),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };
      const aggregate = new SagaStepAggregate(dto, false);

      aggregate.markAsPending(false);

      expect(aggregate.startDate).toBeNull();
    });

    it('should set endDate to null', () => {
      const now = new Date();
      const dto: ISagaStepCreateDto = {
        id: new SagaStepUuidValueObject(),
        sagaInstanceId: new SagaInstanceUuidValueObject(),
        name: new SagaStepNameValueObject('Test'),
        order: new SagaStepOrderValueObject(1),
        status: new SagaStepStatusValueObject(SagaStepStatusEnum.COMPLETED),
        startDate: null,
        endDate: new SagaStepEndDateValueObject(now),
        errorMessage: null,
        retryCount: new SagaStepRetryCountValueObject(0),
        maxRetries: new SagaStepMaxRetriesValueObject(3),
        payload: new SagaStepPayloadValueObject({}),
        result: new SagaStepResultValueObject({}),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };
      const aggregate = new SagaStepAggregate(dto, false);

      aggregate.markAsPending(false);

      expect(aggregate.endDate).toBeNull();
    });

    it('should set errorMessage to null', () => {
      const now = new Date();
      const dto: ISagaStepCreateDto = {
        id: new SagaStepUuidValueObject(),
        sagaInstanceId: new SagaInstanceUuidValueObject(),
        name: new SagaStepNameValueObject('Test'),
        order: new SagaStepOrderValueObject(1),
        status: new SagaStepStatusValueObject(SagaStepStatusEnum.FAILED),
        startDate: null,
        endDate: null,
        errorMessage: new SagaStepErrorMessageValueObject('Error'),
        retryCount: new SagaStepRetryCountValueObject(0),
        maxRetries: new SagaStepMaxRetriesValueObject(3),
        payload: new SagaStepPayloadValueObject({}),
        result: new SagaStepResultValueObject({}),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };
      const aggregate = new SagaStepAggregate(dto, false);

      aggregate.markAsPending(false);

      expect(aggregate.errorMessage).toBeNull();
    });

    it('should update updatedAt timestamp', () => {
      const aggregate = createBaseAggregate();
      const originalUpdatedAt = aggregate.updatedAt.value;

      aggregate.markAsPending(false);

      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should generate SagaStepStatusChangedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.markAsPending(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaStepStatusChangedEvent);

      const event = events[0] as SagaStepStatusChangedEvent;
      expect(event.data.status).toBe(SagaStepStatusEnum.PENDING);
    });
  });

  describe('markAsStarted', () => {
    it('should set status to STARTED', () => {
      const aggregate = createBaseAggregate();

      aggregate.markAsStarted(false);

      expect(aggregate.status.value).toBe(SagaStepStatusEnum.STARTED);
    });

    it('should set startDate to current date', () => {
      const aggregate = createBaseAggregate();
      const beforeMark = new Date();

      aggregate.markAsStarted(false);

      const afterMark = new Date();
      expect(aggregate.startDate).not.toBeNull();
      expect(aggregate.startDate?.value.getTime()).toBeGreaterThanOrEqual(
        beforeMark.getTime(),
      );
      expect(aggregate.startDate?.value.getTime()).toBeLessThanOrEqual(
        afterMark.getTime(),
      );
    });

    it('should set endDate to null', () => {
      const now = new Date();
      const dto: ISagaStepCreateDto = {
        id: new SagaStepUuidValueObject(),
        sagaInstanceId: new SagaInstanceUuidValueObject(),
        name: new SagaStepNameValueObject('Test'),
        order: new SagaStepOrderValueObject(1),
        status: new SagaStepStatusValueObject(SagaStepStatusEnum.COMPLETED),
        startDate: null,
        endDate: new SagaStepEndDateValueObject(now),
        errorMessage: null,
        retryCount: new SagaStepRetryCountValueObject(0),
        maxRetries: new SagaStepMaxRetriesValueObject(3),
        payload: new SagaStepPayloadValueObject({}),
        result: new SagaStepResultValueObject({}),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };
      const aggregate = new SagaStepAggregate(dto, false);

      aggregate.markAsStarted(false);

      expect(aggregate.endDate).toBeNull();
    });

    it('should update updatedAt timestamp', () => {
      const aggregate = createBaseAggregate();
      const originalUpdatedAt = aggregate.updatedAt.value;

      aggregate.markAsStarted(false);

      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should generate SagaStepStatusChangedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.markAsStarted(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaStepStatusChangedEvent);

      const event = events[0] as SagaStepStatusChangedEvent;
      expect(event.data.status).toBe(SagaStepStatusEnum.STARTED);
    });
  });

  describe('markAsRunning', () => {
    it('should set status to RUNNING', () => {
      const aggregate = createBaseAggregate();

      aggregate.markAsRunning(false);

      expect(aggregate.status.value).toBe(SagaStepStatusEnum.RUNNING);
    });

    it('should set endDate to null', () => {
      const now = new Date();
      const dto: ISagaStepCreateDto = {
        id: new SagaStepUuidValueObject(),
        sagaInstanceId: new SagaInstanceUuidValueObject(),
        name: new SagaStepNameValueObject('Test'),
        order: new SagaStepOrderValueObject(1),
        status: new SagaStepStatusValueObject(SagaStepStatusEnum.COMPLETED),
        startDate: null,
        endDate: new SagaStepEndDateValueObject(now),
        errorMessage: null,
        retryCount: new SagaStepRetryCountValueObject(0),
        maxRetries: new SagaStepMaxRetriesValueObject(3),
        payload: new SagaStepPayloadValueObject({}),
        result: new SagaStepResultValueObject({}),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };
      const aggregate = new SagaStepAggregate(dto, false);

      aggregate.markAsRunning(false);

      expect(aggregate.endDate).toBeNull();
    });

    it('should update updatedAt timestamp', () => {
      const aggregate = createBaseAggregate();
      const originalUpdatedAt = aggregate.updatedAt.value;

      aggregate.markAsRunning(false);

      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should generate SagaStepStatusChangedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.markAsRunning(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaStepStatusChangedEvent);

      const event = events[0] as SagaStepStatusChangedEvent;
      expect(event.data.status).toBe(SagaStepStatusEnum.RUNNING);
    });
  });

  describe('incrementRetryCount', () => {
    it('should increment retry count by 1', () => {
      const aggregate = createBaseAggregate();
      const originalRetryCount = aggregate.retryCount.value;

      aggregate.incrementRetryCount(false);

      expect(aggregate.retryCount.value).toBe(originalRetryCount + 1);
    });

    it('should increment retry count multiple times', () => {
      const aggregate = createBaseAggregate();

      aggregate.incrementRetryCount(false);
      aggregate.incrementRetryCount(false);
      aggregate.incrementRetryCount(false);

      expect(aggregate.retryCount.value).toBe(3);
    });

    it('should update updatedAt timestamp', () => {
      const aggregate = createBaseAggregate();
      const originalUpdatedAt = aggregate.updatedAt.value;

      aggregate.incrementRetryCount(false);

      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should generate SagaStepUpdatedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.incrementRetryCount(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaStepUpdatedEvent);

      const event = events[0] as SagaStepUpdatedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.data.retryCount).toBe(1);
    });

    it('should not generate event when generateEvent is false', () => {
      const aggregate = createBaseAggregate();
      aggregate.commit();

      aggregate.incrementRetryCount(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitive representation', () => {
      const aggregate = createBaseAggregate();
      const primitives = aggregate.toPrimitives();

      expect(primitives).toEqual({
        id: aggregate.id.value,
        sagaInstanceId: aggregate.sagaInstanceId.value,
        name: aggregate.name.value,
        order: aggregate.order.value,
        status: aggregate.status.value,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: aggregate.retryCount.value,
        maxRetries: aggregate.maxRetries.value,
        payload: aggregate.payload.value,
        result: aggregate.result.value,
        createdAt: aggregate.createdAt.value,
        updatedAt: aggregate.updatedAt.value,
      });
    });

    it('should include all fields in primitives when they are set', () => {
      const now = new Date();
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const dto: ISagaStepCreateDto = {
        id: new SagaStepUuidValueObject(),
        sagaInstanceId: new SagaInstanceUuidValueObject(),
        name: new SagaStepNameValueObject('Test Step'),
        order: new SagaStepOrderValueObject(5),
        status: new SagaStepStatusValueObject(SagaStepStatusEnum.COMPLETED),
        startDate: new SagaStepStartDateValueObject(startDate),
        endDate: new SagaStepEndDateValueObject(endDate),
        errorMessage: new SagaStepErrorMessageValueObject('Test error'),
        retryCount: new SagaStepRetryCountValueObject(2),
        maxRetries: new SagaStepMaxRetriesValueObject(10),
        payload: new SagaStepPayloadValueObject({ key: 'value' }),
        result: new SagaStepResultValueObject({ success: true }),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };
      const aggregate = new SagaStepAggregate(dto, false);
      const primitives = aggregate.toPrimitives();

      expect(primitives.startDate).toEqual(startDate);
      expect(primitives.endDate).toEqual(endDate);
      expect(primitives.errorMessage).toBe('Test error');
      expect(primitives.retryCount).toBe(2);
      expect(primitives.maxRetries).toBe(10);
      expect(primitives.payload).toEqual({ key: 'value' });
      expect(primitives.result).toEqual({ success: true });
    });
  });
});
