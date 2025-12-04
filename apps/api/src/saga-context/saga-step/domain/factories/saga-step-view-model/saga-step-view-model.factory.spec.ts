import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { ISagaStepCreateViewModelDto } from '@/saga-context/saga-step/domain/dtos/view-models/saga-step-create/saga-step-create-view-model.dto';
import { SagaStepViewModelFactory } from '@/saga-context/saga-step/domain/factories/saga-step-view-model/saga-step-view-model.factory';
import { SagaStepPrimitives } from '@/saga-context/saga-step/domain/primitives/saga-step.primitives';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
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
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

describe('SagaStepViewModelFactory', () => {
  let factory: SagaStepViewModelFactory;

  beforeEach(() => {
    factory = new SagaStepViewModelFactory();
  });

  describe('create', () => {
    it('should create a SagaStepViewModel from DTO with all fields', () => {
      const now = new Date();
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const dto: ISagaStepCreateViewModelDto = {
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

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(SagaStepViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.sagaInstanceId).toBe(dto.sagaInstanceId);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.order).toBe(dto.order);
      expect(viewModel.status).toBe(dto.status);
      expect(viewModel.startDate).toEqual(dto.startDate);
      expect(viewModel.endDate).toEqual(dto.endDate);
      expect(viewModel.errorMessage).toBe(dto.errorMessage);
      expect(viewModel.retryCount).toBe(dto.retryCount);
      expect(viewModel.maxRetries).toBe(dto.maxRetries);
      expect(viewModel.payload).toEqual(dto.payload);
      expect(viewModel.result).toEqual(dto.result);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });

    it('should create a SagaStepViewModel from DTO with null optional fields', () => {
      const now = new Date();

      const dto: ISagaStepCreateViewModelDto = {
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

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(SagaStepViewModel);
      expect(viewModel.startDate).toBeNull();
      expect(viewModel.endDate).toBeNull();
      expect(viewModel.errorMessage).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a SagaStepViewModel from primitives with all fields', () => {
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

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(SagaStepViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.sagaInstanceId).toBe(primitives.sagaInstanceId);
      expect(viewModel.name).toBe(primitives.name);
      expect(viewModel.order).toBe(primitives.order);
      expect(viewModel.status).toBe(primitives.status);
      expect(viewModel.startDate).toEqual(primitives.startDate);
      expect(viewModel.endDate).toEqual(primitives.endDate);
      expect(viewModel.errorMessage).toBe(primitives.errorMessage);
      expect(viewModel.retryCount).toBe(primitives.retryCount);
      expect(viewModel.maxRetries).toBe(primitives.maxRetries);
      expect(viewModel.payload).toEqual(primitives.payload);
      expect(viewModel.result).toEqual(primitives.result);
      expect(viewModel.createdAt).toEqual(primitives.createdAt);
      expect(viewModel.updatedAt).toEqual(primitives.updatedAt);
    });

    it('should create a SagaStepViewModel from primitives with null optional fields', () => {
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

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(SagaStepViewModel);
      expect(viewModel.startDate).toBeNull();
      expect(viewModel.endDate).toBeNull();
      expect(viewModel.errorMessage).toBeNull();
    });
  });

  describe('fromAggregate', () => {
    it('should create a SagaStepViewModel from aggregate with all fields', () => {
      const now = new Date();
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const aggregate = new SagaStepAggregate(
        {
          id: new SagaStepUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
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
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(SagaStepViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.sagaInstanceId).toBe(aggregate.sagaInstanceId.value);
      expect(viewModel.name).toBe(aggregate.name.value);
      expect(viewModel.order).toBe(aggregate.order.value);
      expect(viewModel.status).toBe(aggregate.status.value);
      expect(viewModel.startDate).toEqual(aggregate.startDate?.value);
      expect(viewModel.endDate).toEqual(aggregate.endDate?.value);
      expect(viewModel.errorMessage).toBe(aggregate.errorMessage?.value);
      expect(viewModel.retryCount).toBe(aggregate.retryCount.value);
      expect(viewModel.maxRetries).toBe(aggregate.maxRetries.value);
      expect(viewModel.payload).toEqual(aggregate.payload.value);
      expect(viewModel.result).toEqual(aggregate.result.value);
      expect(viewModel.createdAt).toEqual(aggregate.createdAt.value);
      expect(viewModel.updatedAt).toEqual(aggregate.updatedAt.value);
    });

    it('should create a SagaStepViewModel from aggregate with null optional fields', () => {
      const now = new Date();

      const aggregate = new SagaStepAggregate(
        {
          id: new SagaStepUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
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
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(SagaStepViewModel);
      expect(viewModel.startDate).toBeNull();
      expect(viewModel.endDate).toBeNull();
      expect(viewModel.errorMessage).toBeNull();
    });

    it('should create a SagaStepViewModel from aggregate with different status values', () => {
      const now = new Date();
      const statuses = [
        SagaStepStatusEnum.PENDING,
        SagaStepStatusEnum.STARTED,
        SagaStepStatusEnum.RUNNING,
        SagaStepStatusEnum.COMPLETED,
        SagaStepStatusEnum.FAILED,
      ];

      statuses.forEach((status) => {
        const aggregate = new SagaStepAggregate(
          {
            id: new SagaStepUuidValueObject(),
            sagaInstanceId: new SagaInstanceUuidValueObject(),
            name: new SagaStepNameValueObject('Test Step'),
            order: new SagaStepOrderValueObject(1),
            status: new SagaStepStatusValueObject(status),
            startDate: null,
            endDate: null,
            errorMessage: null,
            retryCount: new SagaStepRetryCountValueObject(0),
            maxRetries: new SagaStepMaxRetriesValueObject(3),
            payload: new SagaStepPayloadValueObject({}),
            result: new SagaStepResultValueObject({}),
            createdAt: new DateValueObject(now),
            updatedAt: new DateValueObject(now),
          },
          false,
        );

        const viewModel = factory.fromAggregate(aggregate);

        expect(viewModel.status).toBe(status);
      });
    });
  });
});
