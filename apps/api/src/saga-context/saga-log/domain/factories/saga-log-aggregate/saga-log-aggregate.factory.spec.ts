import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { ISagaLogCreateDto } from '@/saga-context/saga-log/domain/dtos/entities/saga-log-create/saga-log-create.dto';
import { SagaLogAggregateFactory } from '@/saga-context/saga-log/domain/factories/saga-log-aggregate/saga-log-aggregate.factory';
import { SagaLogPrimitives } from '@/saga-context/saga-log/domain/primitives/saga-log.primitives';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { SagaLogCreatedEvent } from '@/shared/domain/events/saga-context/saga-log/saga-log-created/saga-log-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

describe('SagaLogAggregateFactory', () => {
  let factory: SagaLogAggregateFactory;

  beforeEach(() => {
    factory = new SagaLogAggregateFactory();
  });

  describe('create', () => {
    it('should create a SagaLogAggregate from DTO with all fields and generate event by default', () => {
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

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(SagaLogAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.sagaInstanceId.value).toBe(dto.sagaInstanceId.value);
      expect(aggregate.sagaStepId.value).toBe(dto.sagaStepId.value);
      expect(aggregate.type.value).toBe(dto.type.value);
      expect(aggregate.message.value).toBe(dto.message.value);
      expect(aggregate.createdAt.value).toEqual(dto.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(dto.updatedAt.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(SagaLogCreatedEvent);
    });

    it('should create a SagaLogAggregate from DTO without generating event when generateEvent is false', () => {
      const now = new Date();

      const dto: ISagaLogCreateDto = {
        id: new SagaLogUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        sagaInstanceId: new SagaInstanceUuidValueObject(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        sagaStepId: new SagaStepUuidValueObject(
          '323e4567-e89b-12d3-a456-426614174000',
        ),
        type: new SagaLogTypeValueObject(SagaLogTypeEnum.ERROR),
        message: new SagaLogMessageValueObject('Error log message'),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(SagaLogAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.type.value).toBe(dto.type.value);
      expect(aggregate.message.value).toBe(dto.message.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });
  });

  describe('fromPrimitives', () => {
    it('should create a SagaLogAggregate from primitives with all fields', () => {
      const now = new Date();

      const primitives: SagaLogPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(SagaLogAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.sagaInstanceId.value).toBe(primitives.sagaInstanceId);
      expect(aggregate.sagaStepId.value).toBe(primitives.sagaStepId);
      expect(aggregate.type.value).toBe(primitives.type);
      expect(aggregate.message.value).toBe(primitives.message);
      expect(aggregate.createdAt.value).toEqual(primitives.createdAt);
      expect(aggregate.updatedAt.value).toEqual(primitives.updatedAt);
    });

    it('should create a SagaLogAggregate from primitives with different log types', () => {
      const now = new Date();
      const types = [
        SagaLogTypeEnum.INFO,
        SagaLogTypeEnum.WARNING,
        SagaLogTypeEnum.ERROR,
        SagaLogTypeEnum.DEBUG,
      ];

      types.forEach((type) => {
        const primitives: SagaLogPrimitives = {
          id: new SagaLogUuidValueObject().value,
          sagaInstanceId: new SagaInstanceUuidValueObject().value,
          sagaStepId: new SagaStepUuidValueObject().value,
          type: type,
          message: `Test message for ${type}`,
          createdAt: now,
          updatedAt: now,
        };

        const aggregate = factory.fromPrimitives(primitives);

        expect(aggregate.type.value).toBe(type);
        expect(aggregate.message.value).toBe(primitives.message);
      });
    });
  });
});
