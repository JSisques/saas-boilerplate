import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { ISagaInstanceCreateDto } from '@/saga-context/saga-instance/domain/dtos/entities/saga-instance-create/saga-instance-create.dto';
import { SagaInstanceAggregateFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-aggregate/saga-instance-aggregate.factory';
import { SagaInstancePrimitives } from '@/saga-context/saga-instance/domain/primitives/saga-instance.primitives';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceEndDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-end-date/saga-instance-end-date.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStartDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-start-date/saga-instance-start-date.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceCreatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-created/saga-instance-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

describe('SagaInstanceAggregateFactory', () => {
  let factory: SagaInstanceAggregateFactory;

  beforeEach(() => {
    factory = new SagaInstanceAggregateFactory();
  });

  describe('create', () => {
    it('should create a SagaInstanceAggregate from DTO with all fields and generate event by default', () => {
      const now = new Date();
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const dto: ISagaInstanceCreateDto = {
        id: new SagaInstanceUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        name: new SagaInstanceNameValueObject('Order Processing Saga'),
        status: new SagaInstanceStatusValueObject(
          SagaInstanceStatusEnum.PENDING,
        ),
        startDate: new SagaInstanceStartDateValueObject(startDate),
        endDate: new SagaInstanceEndDateValueObject(endDate),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(SagaInstanceAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.name.value).toBe(dto.name.value);
      expect(aggregate.status.value).toBe(dto.status.value);
      expect(aggregate.startDate?.value).toEqual(dto.startDate?.value);
      expect(aggregate.endDate?.value).toEqual(dto.endDate?.value);
      expect(aggregate.createdAt.value).toEqual(dto.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(dto.updatedAt.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(SagaInstanceCreatedEvent);
    });

    it('should create a SagaInstanceAggregate from DTO without generating event when generateEvent is false', () => {
      const now = new Date();

      const dto: ISagaInstanceCreateDto = {
        id: new SagaInstanceUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        name: new SagaInstanceNameValueObject('Order Processing Saga'),
        status: new SagaInstanceStatusValueObject(
          SagaInstanceStatusEnum.PENDING,
        ),
        startDate: null,
        endDate: null,
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(SagaInstanceAggregate);
      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });

    it('should create a SagaInstanceAggregate with null optional fields', () => {
      const now = new Date();

      const dto: ISagaInstanceCreateDto = {
        id: new SagaInstanceUuidValueObject(),
        name: new SagaInstanceNameValueObject('Test Saga'),
        status: new SagaInstanceStatusValueObject(
          SagaInstanceStatusEnum.PENDING,
        ),
        startDate: null,
        endDate: null,
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate.startDate).toBeNull();
      expect(aggregate.endDate).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a SagaInstanceAggregate from primitives with all fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const primitives: SagaInstancePrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(SagaInstanceAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.name.value).toBe(primitives.name);
      expect(aggregate.status.value).toBe(primitives.status);
      expect(aggregate.startDate?.value).toEqual(primitives.startDate);
      expect(aggregate.endDate?.value).toEqual(primitives.endDate);
      expect(aggregate.createdAt.value).toEqual(primitives.createdAt);
      expect(aggregate.updatedAt.value).toEqual(primitives.updatedAt);
    });

    it('should create a SagaInstanceAggregate from primitives with null optional fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');

      const primitives: SagaInstancePrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(SagaInstanceAggregate);
      expect(aggregate.startDate).toBeNull();
      expect(aggregate.endDate).toBeNull();
    });
  });
});
