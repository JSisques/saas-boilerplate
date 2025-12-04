import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { ISagaLogCreateDto } from '@/saga-context/saga-log/domain/dtos/entities/saga-log-create/saga-log-create.dto';
import { ISagaLogUpdateDto } from '@/saga-context/saga-log/domain/dtos/entities/saga-log-update/saga-log-update.dto';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { SagaLogCreatedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-created/saga-log-created.event';
import { SagaLogDeletedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-deleted/saga-log-deleted.event';
import { SagaLogUpdatedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-updated/saga-log-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

describe('SagaLogAggregate', () => {
  const createBaseAggregate = (
    generateEvent: boolean = false,
  ): SagaLogAggregate => {
    const now = new Date();
    const dto: ISagaLogCreateDto = {
      id: new SagaLogUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
      sagaInstanceId: new SagaInstanceUuidValueObject(
        '223e4567-e89b-12d3-a456-426614174000',
      ),
      sagaStepId: new SagaStepUuidValueObject(
        '323e4567-e89b-12d3-a456-426614174000',
      ),
      type: new SagaLogTypeValueObject(SagaLogTypeEnum.INFO),
      message: new SagaLogMessageValueObject('Test log message'),
      createdAt: new DateValueObject(now),
      updatedAt: new DateValueObject(now),
    };

    return new SagaLogAggregate(dto, generateEvent);
  };

  describe('constructor', () => {
    it('should create a SagaLogAggregate with all properties', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate).toBeInstanceOf(SagaLogAggregate);
      expect(aggregate.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(aggregate.sagaInstanceId.value).toBe(
        '223e4567-e89b-12d3-a456-426614174000',
      );
      expect(aggregate.sagaStepId.value).toBe(
        '323e4567-e89b-12d3-a456-426614174000',
      );
      expect(aggregate.type.value).toBe(SagaLogTypeEnum.INFO);
      expect(aggregate.message.value).toBe('Test log message');
    });

    it('should emit SagaLogCreatedEvent on creation by default', () => {
      const aggregate = createBaseAggregate(true);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaLogCreatedEvent);

      const event = events[0] as SagaLogCreatedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(SagaLogAggregate.name);
      expect(event.eventType).toBe(SagaLogCreatedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit SagaLogCreatedEvent when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('getters', () => {
    it('should expose id via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.id).toBeInstanceOf(SagaLogUuidValueObject);
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

    it('should expose sagaStepId via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.sagaStepId).toBeInstanceOf(SagaStepUuidValueObject);
      expect(aggregate.sagaStepId.value).toBe(
        '323e4567-e89b-12d3-a456-426614174000',
      );
    });

    it('should expose type via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.type).toBeInstanceOf(SagaLogTypeValueObject);
      expect(aggregate.type.value).toBe(SagaLogTypeEnum.INFO);
    });

    it('should expose message via getter', () => {
      const aggregate = createBaseAggregate();

      expect(aggregate.message).toBeInstanceOf(SagaLogMessageValueObject);
      expect(aggregate.message.value).toBe('Test log message');
    });
  });

  describe('update', () => {
    it('should update type and message', () => {
      const aggregate = createBaseAggregate(false);
      const updateDto: ISagaLogUpdateDto = {
        type: new SagaLogTypeValueObject(SagaLogTypeEnum.ERROR),
        message: new SagaLogMessageValueObject('Updated message'),
      };

      aggregate.update(updateDto);

      expect(aggregate.type.value).toBe(SagaLogTypeEnum.ERROR);
      expect(aggregate.message.value).toBe('Updated message');
    });

    it('should update only type when message is not provided', () => {
      const aggregate = createBaseAggregate(false);
      const originalMessage = aggregate.message.value;
      const updateDto: ISagaLogUpdateDto = {
        type: new SagaLogTypeValueObject(SagaLogTypeEnum.WARNING),
      };

      aggregate.update(updateDto);

      expect(aggregate.type.value).toBe(SagaLogTypeEnum.WARNING);
      expect(aggregate.message.value).toBe(originalMessage);
    });

    it('should update only message when type is not provided', () => {
      const aggregate = createBaseAggregate(false);
      const originalType = aggregate.type.value;
      const updateDto: ISagaLogUpdateDto = {
        message: new SagaLogMessageValueObject('New message'),
      };

      aggregate.update(updateDto);

      expect(aggregate.type.value).toBe(originalType);
      expect(aggregate.message.value).toBe('New message');
    });

    it('should update updatedAt timestamp', () => {
      const aggregate = createBaseAggregate(false);
      const originalUpdatedAt = aggregate.updatedAt.value;
      const updateDto: ISagaLogUpdateDto = {
        type: new SagaLogTypeValueObject(SagaLogTypeEnum.DEBUG),
      };

      // Wait a bit to ensure timestamp difference
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      aggregate.update(updateDto);

      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );

      jest.useRealTimers();
    });

    it('should emit SagaLogUpdatedEvent by default', () => {
      const aggregate = createBaseAggregate(false);
      const updateDto: ISagaLogUpdateDto = {
        type: new SagaLogTypeValueObject(SagaLogTypeEnum.ERROR),
      };

      aggregate.update(updateDto);
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaLogUpdatedEvent);

      const event = events[0] as SagaLogUpdatedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(SagaLogAggregate.name);
      expect(event.eventType).toBe(SagaLogUpdatedEvent.name);
    });

    it('should not emit SagaLogUpdatedEvent when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);
      const updateDto: ISagaLogUpdateDto = {
        type: new SagaLogTypeValueObject(SagaLogTypeEnum.ERROR),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should emit SagaLogDeletedEvent by default', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.delete();
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SagaLogDeletedEvent);

      const event = events[0] as SagaLogDeletedEvent;
      expect(event.aggregateId).toBe(aggregate.id.value);
      expect(event.aggregateType).toBe(SagaLogAggregate.name);
      expect(event.eventType).toBe(SagaLogDeletedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit SagaLogDeletedEvent when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.delete(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitives', () => {
      const aggregate = createBaseAggregate(false);
      const primitives = aggregate.toPrimitives();

      expect(primitives).toEqual({
        id: aggregate.id.value,
        sagaInstanceId: aggregate.sagaInstanceId.value,
        sagaStepId: aggregate.sagaStepId.value,
        type: aggregate.type.value,
        message: aggregate.message.value,
        createdAt: aggregate.createdAt.value,
        updatedAt: aggregate.updatedAt.value,
      });
    });

    it('should return primitives with correct structure', () => {
      const aggregate = createBaseAggregate(false);
      const primitives = aggregate.toPrimitives();

      expect(primitives).toHaveProperty('id');
      expect(primitives).toHaveProperty('sagaInstanceId');
      expect(primitives).toHaveProperty('sagaStepId');
      expect(primitives).toHaveProperty('type');
      expect(primitives).toHaveProperty('message');
      expect(primitives).toHaveProperty('createdAt');
      expect(primitives).toHaveProperty('updatedAt');
      expect(typeof primitives.id).toBe('string');
      expect(typeof primitives.sagaInstanceId).toBe('string');
      expect(typeof primitives.sagaStepId).toBe('string');
      expect(typeof primitives.type).toBe('string');
      expect(typeof primitives.message).toBe('string');
      expect(primitives.createdAt).toBeInstanceOf(Date);
      expect(primitives.updatedAt).toBeInstanceOf(Date);
    });
  });
});
