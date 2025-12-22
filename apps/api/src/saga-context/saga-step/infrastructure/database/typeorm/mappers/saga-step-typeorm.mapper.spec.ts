import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepAggregateFactory } from '@/saga-context/saga-step/domain/factories/saga-step-aggregate/saga-step-aggregate.factory';
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
import { SagaStepTypeormEntity } from '@/saga-context/saga-step/infrastructure/database/typeorm/entities/saga-step-typeorm.entity';
import { SagaStepTypeormMapper } from '@/saga-context/saga-step/infrastructure/database/typeorm/mappers/saga-step-typeorm.mapper';

describe('SagaStepTypeormMapper', () => {
  let mapper: SagaStepTypeormMapper;
  let mockSagaStepAggregateFactory: jest.Mocked<SagaStepAggregateFactory>;

  beforeEach(() => {
    mockSagaStepAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SagaStepAggregateFactory>;

    mapper = new SagaStepTypeormMapper(mockSagaStepAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const startDate = new Date();
      const endDate = new Date();

      const typeormEntity = new SagaStepTypeormEntity();
      typeormEntity.id = sagaStepId;
      typeormEntity.sagaInstanceId = sagaInstanceId;
      typeormEntity.name = 'test-step';
      typeormEntity.order = 1;
      typeormEntity.status = SagaStepStatusEnum.COMPLETED;
      typeormEntity.startDate = startDate;
      typeormEntity.endDate = endDate;
      typeormEntity.errorMessage = null;
      typeormEntity.retryCount = 0;
      typeormEntity.maxRetries = 3;
      typeormEntity.payload = { key: 'value' };
      typeormEntity.result = { result: 'success' };
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockSagaStepAggregate = new SagaStepAggregate(
        {
          id: new SagaStepUuidValueObject(sagaStepId),
          sagaInstanceId: new SagaInstanceUuidValueObject(sagaInstanceId),
          name: new SagaStepNameValueObject('test-step'),
          order: new SagaStepOrderValueObject(1),
          status: new SagaStepStatusValueObject(SagaStepStatusEnum.COMPLETED),
          startDate: new SagaStepStartDateValueObject(startDate),
          endDate: new SagaStepEndDateValueObject(endDate),
          errorMessage: null,
          retryCount: new SagaStepRetryCountValueObject(0),
          maxRetries: new SagaStepMaxRetriesValueObject(3),
          payload: new SagaStepPayloadValueObject({ key: 'value' }),
          result: new SagaStepResultValueObject({ result: 'success' }),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSagaStepAggregateFactory.fromPrimitives.mockReturnValue(
        mockSagaStepAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockSagaStepAggregate);
      expect(mockSagaStepAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: sagaStepId,
        sagaInstanceId: sagaInstanceId,
        name: 'test-step',
        order: 1,
        status: SagaStepStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: { key: 'value' },
        result: { result: 'success' },
        createdAt: now,
        updatedAt: now,
      });
      expect(mockSagaStepAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should convert TypeORM entity with null optional properties', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new SagaStepTypeormEntity();
      typeormEntity.id = sagaStepId;
      typeormEntity.sagaInstanceId = sagaInstanceId;
      typeormEntity.name = 'test-step';
      typeormEntity.order = 1;
      typeormEntity.status = SagaStepStatusEnum.PENDING;
      typeormEntity.startDate = null;
      typeormEntity.endDate = null;
      typeormEntity.errorMessage = null;
      typeormEntity.retryCount = 0;
      typeormEntity.maxRetries = 3;
      typeormEntity.payload = { key: 'value' };
      typeormEntity.result = null;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockSagaStepAggregate = new SagaStepAggregate(
        {
          id: new SagaStepUuidValueObject(sagaStepId),
          sagaInstanceId: new SagaInstanceUuidValueObject(sagaInstanceId),
          name: new SagaStepNameValueObject('test-step'),
          order: new SagaStepOrderValueObject(1),
          status: new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING),
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: new SagaStepRetryCountValueObject(0),
          maxRetries: new SagaStepMaxRetriesValueObject(3),
          payload: new SagaStepPayloadValueObject({ key: 'value' }),
          result: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSagaStepAggregateFactory.fromPrimitives.mockReturnValue(
        mockSagaStepAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockSagaStepAggregate);
      expect(mockSagaStepAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: sagaStepId,
        sagaInstanceId: sagaInstanceId,
        name: 'test-step',
        order: 1,
        status: SagaStepStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: { key: 'value' },
        result: null,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const startDate = new Date();
      const endDate = new Date();

      const mockSagaStepAggregate = new SagaStepAggregate(
        {
          id: new SagaStepUuidValueObject(sagaStepId),
          sagaInstanceId: new SagaInstanceUuidValueObject(sagaInstanceId),
          name: new SagaStepNameValueObject('test-step'),
          order: new SagaStepOrderValueObject(1),
          status: new SagaStepStatusValueObject(SagaStepStatusEnum.COMPLETED),
          startDate: new SagaStepStartDateValueObject(startDate),
          endDate: new SagaStepEndDateValueObject(endDate),
          errorMessage: null,
          retryCount: new SagaStepRetryCountValueObject(0),
          maxRetries: new SagaStepMaxRetriesValueObject(3),
          payload: new SagaStepPayloadValueObject({ key: 'value' }),
          result: new SagaStepResultValueObject({ result: 'success' }),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockSagaStepAggregate, 'toPrimitives')
        .mockReturnValue({
          id: sagaStepId,
          sagaInstanceId: sagaInstanceId,
          name: 'test-step',
          order: 1,
          status: SagaStepStatusEnum.COMPLETED,
          startDate: startDate,
          endDate: endDate,
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          payload: { key: 'value' },
          result: { result: 'success' },
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockSagaStepAggregate);

      expect(result).toBeInstanceOf(SagaStepTypeormEntity);
      expect(result.id).toBe(sagaStepId);
      expect(result.sagaInstanceId).toBe(sagaInstanceId);
      expect(result.name).toBe('test-step');
      expect(result.order).toBe(1);
      expect(result.status).toBe(SagaStepStatusEnum.COMPLETED);
      expect(result.startDate).toEqual(startDate);
      expect(result.endDate).toEqual(endDate);
      expect(result.errorMessage).toBeNull();
      expect(result.retryCount).toBe(0);
      expect(result.maxRetries).toBe(3);
      expect(result.payload).toEqual({ key: 'value' });
      expect(result.result).toEqual({ result: 'success' });
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });
  });
});
