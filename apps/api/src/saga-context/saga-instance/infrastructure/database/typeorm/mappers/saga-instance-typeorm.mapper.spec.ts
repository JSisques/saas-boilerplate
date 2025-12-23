import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceAggregateFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-aggregate/saga-instance-aggregate.factory';
import { SagaInstanceEndDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-end-date/saga-instance-end-date.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStartDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-start-date/saga-instance-start-date.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceTypeormEntity } from '@/saga-context/saga-instance/infrastructure/database/typeorm/entities/saga-instance-typeorm.entity';
import { SagaInstanceTypeormMapper } from '@/saga-context/saga-instance/infrastructure/database/typeorm/mappers/saga-instance-typeorm.mapper';

describe('SagaInstanceTypeormMapper', () => {
  let mapper: SagaInstanceTypeormMapper;
  let mockSagaInstanceAggregateFactory: jest.Mocked<SagaInstanceAggregateFactory>;

  beforeEach(() => {
    mockSagaInstanceAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceAggregateFactory>;

    mapper = new SagaInstanceTypeormMapper(mockSagaInstanceAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const startDate = new Date();
      const endDate = new Date();

      const typeormEntity = new SagaInstanceTypeormEntity();
      typeormEntity.id = sagaInstanceId;
      typeormEntity.name = 'test-saga-instance';
      typeormEntity.status = SagaInstanceStatusEnum.COMPLETED;
      typeormEntity.startDate = startDate;
      typeormEntity.endDate = endDate;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockSagaInstanceAggregate = new SagaInstanceAggregate(
        {
          id: new SagaInstanceUuidValueObject(sagaInstanceId),
          name: new SagaInstanceNameValueObject('test-saga-instance'),
          status: new SagaInstanceStatusValueObject(
            SagaInstanceStatusEnum.COMPLETED,
          ),
          startDate: new SagaInstanceStartDateValueObject(startDate),
          endDate: new SagaInstanceEndDateValueObject(endDate),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSagaInstanceAggregateFactory.fromPrimitives.mockReturnValue(
        mockSagaInstanceAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockSagaInstanceAggregate);
      expect(
        mockSagaInstanceAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: sagaInstanceId,
        name: 'test-saga-instance',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      });
      expect(
        mockSagaInstanceAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledTimes(1);
    });

    it('should convert TypeORM entity with null optional properties', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new SagaInstanceTypeormEntity();
      typeormEntity.id = sagaInstanceId;
      typeormEntity.name = 'test-saga-instance';
      typeormEntity.status = SagaInstanceStatusEnum.PENDING;
      typeormEntity.startDate = null;
      typeormEntity.endDate = null;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockSagaInstanceAggregate = new SagaInstanceAggregate(
        {
          id: new SagaInstanceUuidValueObject(sagaInstanceId),
          name: new SagaInstanceNameValueObject('test-saga-instance'),
          status: new SagaInstanceStatusValueObject(
            SagaInstanceStatusEnum.PENDING,
          ),
          startDate: null,
          endDate: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSagaInstanceAggregateFactory.fromPrimitives.mockReturnValue(
        mockSagaInstanceAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockSagaInstanceAggregate);
      expect(
        mockSagaInstanceAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: sagaInstanceId,
        name: 'test-saga-instance',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const startDate = new Date();
      const endDate = new Date();

      const mockSagaInstanceAggregate = new SagaInstanceAggregate(
        {
          id: new SagaInstanceUuidValueObject(sagaInstanceId),
          name: new SagaInstanceNameValueObject('test-saga-instance'),
          status: new SagaInstanceStatusValueObject(
            SagaInstanceStatusEnum.COMPLETED,
          ),
          startDate: new SagaInstanceStartDateValueObject(startDate),
          endDate: new SagaInstanceEndDateValueObject(endDate),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockSagaInstanceAggregate, 'toPrimitives')
        .mockReturnValue({
          id: sagaInstanceId,
          name: 'test-saga-instance',
          status: SagaInstanceStatusEnum.COMPLETED,
          startDate: startDate,
          endDate: endDate,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockSagaInstanceAggregate);

      expect(result).toBeInstanceOf(SagaInstanceTypeormEntity);
      expect(result.id).toBe(sagaInstanceId);
      expect(result.name).toBe('test-saga-instance');
      expect(result.status).toBe(SagaInstanceStatusEnum.COMPLETED);
      expect(result.startDate).toEqual(startDate);
      expect(result.endDate).toEqual(endDate);
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });

    it('should convert domain entity with null optional properties', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockSagaInstanceAggregate = new SagaInstanceAggregate(
        {
          id: new SagaInstanceUuidValueObject(sagaInstanceId),
          name: new SagaInstanceNameValueObject('test-saga-instance'),
          status: new SagaInstanceStatusValueObject(
            SagaInstanceStatusEnum.PENDING,
          ),
          startDate: null,
          endDate: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockSagaInstanceAggregate, 'toPrimitives')
        .mockReturnValue({
          id: sagaInstanceId,
          name: 'test-saga-instance',
          status: SagaInstanceStatusEnum.PENDING,
          startDate: null,
          endDate: null,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockSagaInstanceAggregate);

      expect(result).toBeInstanceOf(SagaInstanceTypeormEntity);
      expect(result.id).toBe(sagaInstanceId);
      expect(result.name).toBe('test-saga-instance');
      expect(result.status).toBe(SagaInstanceStatusEnum.PENDING);
      expect(result.startDate).toBeNull();
      expect(result.endDate).toBeNull();
      expect(result.deletedAt).toBeNull();

      toPrimitivesSpy.mockRestore();
    });
  });
});
