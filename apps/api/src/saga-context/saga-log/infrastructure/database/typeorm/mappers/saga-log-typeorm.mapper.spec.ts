import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogAggregateFactory } from '@/saga-context/saga-log/domain/factories/saga-log-aggregate/saga-log-aggregate.factory';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { SagaLogTypeormEntity } from '@/saga-context/saga-log/infrastructure/database/typeorm/entities/saga-log-typeorm.entity';
import { SagaLogTypeormMapper } from '@/saga-context/saga-log/infrastructure/database/typeorm/mappers/saga-log-typeorm.mapper';

describe('SagaLogTypeormMapper', () => {
  let mapper: SagaLogTypeormMapper;
  let mockSagaLogAggregateFactory: jest.Mocked<SagaLogAggregateFactory>;

  beforeEach(() => {
    mockSagaLogAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SagaLogAggregateFactory>;

    mapper = new SagaLogTypeormMapper(mockSagaLogAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const sagaStepId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new SagaLogTypeormEntity();
      typeormEntity.id = sagaLogId;
      typeormEntity.sagaInstanceId = sagaInstanceId;
      typeormEntity.sagaStepId = sagaStepId;
      typeormEntity.type = SagaLogTypeEnum.INFO;
      typeormEntity.message = 'Test message';
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockSagaLogAggregate = new SagaLogAggregate(
        {
          id: new SagaLogUuidValueObject(sagaLogId),
          sagaInstanceId: new SagaInstanceUuidValueObject(sagaInstanceId),
          sagaStepId: new SagaStepUuidValueObject(sagaStepId),
          type: new SagaLogTypeValueObject(SagaLogTypeEnum.INFO),
          message: new SagaLogMessageValueObject('Test message'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSagaLogAggregateFactory.fromPrimitives.mockReturnValue(
        mockSagaLogAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockSagaLogAggregate);
      expect(mockSagaLogAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: sagaLogId,
        sagaInstanceId: sagaInstanceId,
        sagaStepId: sagaStepId,
        type: SagaLogTypeEnum.INFO,
        message: 'Test message',
        createdAt: now,
        updatedAt: now,
      });
      expect(mockSagaLogAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const sagaStepId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockSagaLogAggregate = new SagaLogAggregate(
        {
          id: new SagaLogUuidValueObject(sagaLogId),
          sagaInstanceId: new SagaInstanceUuidValueObject(sagaInstanceId),
          sagaStepId: new SagaStepUuidValueObject(sagaStepId),
          type: new SagaLogTypeValueObject(SagaLogTypeEnum.INFO),
          message: new SagaLogMessageValueObject('Test message'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockSagaLogAggregate, 'toPrimitives')
        .mockReturnValue({
          id: sagaLogId,
          sagaInstanceId: sagaInstanceId,
          sagaStepId: sagaStepId,
          type: SagaLogTypeEnum.INFO,
          message: 'Test message',
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockSagaLogAggregate);

      expect(result).toBeInstanceOf(SagaLogTypeormEntity);
      expect(result.id).toBe(sagaLogId);
      expect(result.sagaInstanceId).toBe(sagaInstanceId);
      expect(result.sagaStepId).toBe(sagaStepId);
      expect(result.type).toBe(SagaLogTypeEnum.INFO);
      expect(result.message).toBe('Test message');
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });
  });
});
