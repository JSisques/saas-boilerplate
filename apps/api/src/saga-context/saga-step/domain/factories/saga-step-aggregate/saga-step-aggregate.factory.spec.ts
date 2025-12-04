import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { ISagaStepCreateDto } from '@/saga-context/saga-step/domain/dtos/entities/saga-step-create/saga-step-create.dto';
import { SagaStepAggregateFactory } from '@/saga-context/saga-step/domain/factories/saga-step-aggregate/saga-step-aggregate.factory';
import { SagaStepPrimitives } from '@/saga-context/saga-step/domain/primitives/saga-step.primitives';
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
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

describe('SagaStepAggregateFactory', () => {
  let factory: SagaStepAggregateFactory;

  beforeEach(() => {
    factory = new SagaStepAggregateFactory();
  });

  describe('create', () => {
    it('should create a SagaStepAggregate from DTO with all fields and generate event by default', () => {
      const now = new Date();
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const dto: ISagaStepCreateDto = {
        id: new SagaStepUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        sagaInstanceId: new SagaInstanceUuidValueObject(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        name: new SagaStepNameValueObject('Process Payment'),
        order: new SagaStepOrderValueObject(1),
        status: new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING),
        startDate: new SagaStepStartDateValueObject(startDate),
        endDate: new SagaStepEndDateValueObject(endDate),
        errorMessage: new SagaStepErrorMessageValueObject('Test error'),
        retryCount: new SagaStepRetryCountValueObject(0),
        maxRetries: new SagaStepMaxRetriesValueObject(3),
        payload: new SagaStepPayloadValueObject({ orderId: '12345' }),
        result: new SagaStepResultValueObject({ success: true }),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(SagaStepAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.sagaInstanceId.value).toBe(dto.sagaInstanceId.value);
      expect(aggregate.name.value).toBe(dto.name.value);
      expect(aggregate.order.value).toBe(dto.order.value);
      expect(aggregate.status.value).toBe(dto.status.value);
      expect(aggregate.startDate?.value).toEqual(dto.startDate?.value);
      expect(aggregate.endDate?.value).toEqual(dto.endDate?.value);
      expect(aggregate.errorMessage?.value).toBe(dto.errorMessage?.value);
      expect(aggregate.retryCount.value).toBe(dto.retryCount.value);
      expect(aggregate.maxRetries.value).toBe(dto.maxRetries.value);
      expect(aggregate.payload.value).toEqual(dto.payload.value);
      expect(aggregate.result.value).toEqual(dto.result.value);
      expect(aggregate.createdAt.value).toEqual(dto.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(dto.updatedAt.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(SagaStepCreatedEvent);
    });

    it('should create a SagaStepAggregate from DTO without generating event when generateEvent is false', () => {
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

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(SagaStepAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.name.value).toBe(dto.name.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });

    it('should create a SagaStepAggregate from DTO with null optional fields', () => {
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
        payload: new SagaStepPayloadValueObject({}),
        result: new SagaStepResultValueObject({}),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(SagaStepAggregate);
      expect(aggregate.startDate).toBeNull();
      expect(aggregate.endDate).toBeNull();
      expect(aggregate.errorMessage).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a SagaStepAggregate from primitives with all fields', () => {
      const now = new Date();
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const primitives: SagaStepPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.PENDING,
        startDate: startDate,
        endDate: endDate,
        errorMessage: 'Test error',
        retryCount: 0,
        maxRetries: 3,
        payload: { orderId: '12345' },
        result: { success: true },
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(SagaStepAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.sagaInstanceId.value).toBe(primitives.sagaInstanceId);
      expect(aggregate.name.value).toBe(primitives.name);
      expect(aggregate.order.value).toBe(primitives.order);
      expect(aggregate.status.value).toBe(primitives.status);
      expect(aggregate.startDate?.value).toEqual(primitives.startDate);
      expect(aggregate.endDate?.value).toEqual(primitives.endDate);
      expect(aggregate.errorMessage?.value).toBe(primitives.errorMessage);
      expect(aggregate.retryCount.value).toBe(primitives.retryCount);
      expect(aggregate.maxRetries.value).toBe(primitives.maxRetries);
      expect(aggregate.payload.value).toEqual(primitives.payload);
      expect(aggregate.result.value).toEqual(primitives.result);
      expect(aggregate.createdAt.value).toEqual(primitives.createdAt);
      expect(aggregate.updatedAt.value).toEqual(primitives.updatedAt);
    });

    it('should create a SagaStepAggregate from primitives with null optional fields', () => {
      const now = new Date();

      const primitives: SagaStepPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: {},
        result: {},
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(SagaStepAggregate);
      expect(aggregate.startDate).toBeNull();
      expect(aggregate.endDate).toBeNull();
      expect(aggregate.errorMessage).toBeNull();
    });

    it('should create a SagaStepAggregate from primitives with different status values', () => {
      const now = new Date();
      const statuses = [
        SagaStepStatusEnum.PENDING,
        SagaStepStatusEnum.STARTED,
        SagaStepStatusEnum.RUNNING,
        SagaStepStatusEnum.COMPLETED,
        SagaStepStatusEnum.FAILED,
      ];

      statuses.forEach((status) => {
        const primitives: SagaStepPrimitives = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          name: 'Test Step',
          order: 1,
          status: status,
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          payload: {},
          result: {},
          createdAt: now,
          updatedAt: now,
        };

        const aggregate = factory.fromPrimitives(primitives);

        expect(aggregate.status.value).toBe(status);
      });
    });

    it('should create a SagaStepAggregate from primitives with complex payload and result', () => {
      const now = new Date();
      const complexPayload = {
        orderId: '12345',
        userId: '67890',
        items: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 },
        ],
        metadata: {
          source: 'web',
          timestamp: '2024-01-01T10:00:00Z',
        },
      };
      const complexResult = {
        success: true,
        transactionId: 'tx-12345',
        data: {
          processed: true,
          amount: 100.0,
        },
      };

      const primitives: SagaStepPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.COMPLETED,
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: complexPayload,
        result: complexResult,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate.payload.value).toEqual(complexPayload);
      expect(aggregate.result.value).toEqual(complexResult);
    });
  });
});
