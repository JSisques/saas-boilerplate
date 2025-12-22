import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepEndDateValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-end-date/saga-step-end-date.vo';
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
import { SagaStepTypeormRepository } from '@/saga-context/saga-step/infrastructure/database/typeorm/repositories/saga-step-typeorm.repository';
import { Repository } from 'typeorm';

describe('SagaStepTypeormRepository', () => {
  let repository: SagaStepTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockSagaStepTypeormMapper: jest.Mocked<SagaStepTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<SagaStepTypeormEntity>>;
  let mockFindOne: jest.Mock;
  let mockFind: jest.Mock;
  let mockSave: jest.Mock;
  let mockSoftDelete: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockFind = jest.fn();
    mockSave = jest.fn();
    mockSoftDelete = jest.fn();

    mockTypeormRepository = {
      findOne: mockFindOne,
      find: mockFind,
      save: mockSave,
      softDelete: mockSoftDelete,
    } as unknown as jest.Mocked<Repository<SagaStepTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockSagaStepTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<SagaStepTypeormMapper>;

    repository = new SagaStepTypeormRepository(
      mockTypeormMasterService,
      mockSagaStepTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return saga step aggregate when saga step exists', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new SagaStepTypeormEntity();
      typeormEntity.id = sagaStepId;
      typeormEntity.sagaInstanceId = sagaInstanceId;
      typeormEntity.name = 'test-step';
      typeormEntity.order = 1;
      typeormEntity.status = SagaStepStatusEnum.PENDING;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const sagaStepAggregate = new SagaStepAggregate(
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
          payload: new SagaStepPayloadValueObject({}),
          result: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFindOne.mockResolvedValue(typeormEntity);
      mockSagaStepTypeormMapper.toDomainEntity.mockReturnValue(
        sagaStepAggregate,
      );

      const result = await repository.findById(sagaStepId);

      expect(result).toBe(sagaStepAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: sagaStepId },
      });
      expect(mockSagaStepTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
    });

    it('should return null when saga step does not exist', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(sagaStepId);

      expect(result).toBeNull();
      expect(mockSagaStepTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findBySagaInstanceId', () => {
    it('should return saga step aggregates when saga steps exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new SagaStepTypeormEntity();
      typeormEntity.id = '123e4567-e89b-12d3-a456-426614174000';
      typeormEntity.sagaInstanceId = sagaInstanceId;
      typeormEntity.name = 'test-step';
      typeormEntity.order = 1;
      typeormEntity.status = SagaStepStatusEnum.PENDING;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const sagaStepAggregate = new SagaStepAggregate(
        {
          id: new SagaStepUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          sagaInstanceId: new SagaInstanceUuidValueObject(sagaInstanceId),
          name: new SagaStepNameValueObject('test-step'),
          order: new SagaStepOrderValueObject(1),
          status: new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING),
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: new SagaStepRetryCountValueObject(0),
          maxRetries: new SagaStepMaxRetriesValueObject(3),
          payload: new SagaStepPayloadValueObject({}),
          result: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFind.mockResolvedValue([typeormEntity]);
      mockSagaStepTypeormMapper.toDomainEntity.mockReturnValue(
        sagaStepAggregate,
      );

      const result = await repository.findBySagaInstanceId(sagaInstanceId);

      expect(result).toEqual([sagaStepAggregate]);
      expect(mockFind).toHaveBeenCalledWith({
        where: { sagaInstanceId },
      });
    });

    it('should return empty array when no saga steps exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';

      mockFind.mockResolvedValue([]);

      const result = await repository.findBySagaInstanceId(sagaInstanceId);

      expect(result).toEqual([]);
      expect(mockSagaStepTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save saga step aggregate and return saved aggregate', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const sagaStepAggregate = new SagaStepAggregate(
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
          payload: new SagaStepPayloadValueObject({}),
          result: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const typeormEntity = new SagaStepTypeormEntity();
      typeormEntity.id = sagaStepId;
      typeormEntity.sagaInstanceId = sagaInstanceId;
      typeormEntity.name = 'test-step';
      typeormEntity.order = 1;
      typeormEntity.status = SagaStepStatusEnum.PENDING;

      const savedTypeormEntity = new SagaStepTypeormEntity();
      savedTypeormEntity.id = sagaStepId;
      savedTypeormEntity.sagaInstanceId = sagaInstanceId;
      savedTypeormEntity.name = 'test-step';
      savedTypeormEntity.order = 1;
      savedTypeormEntity.status = SagaStepStatusEnum.PENDING;

      const savedSagaStepAggregate = new SagaStepAggregate(
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
          payload: new SagaStepPayloadValueObject({}),
          result: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockSagaStepTypeormMapper.toTypeormEntity.mockReturnValue(typeormEntity);
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockSagaStepTypeormMapper.toDomainEntity.mockReturnValue(
        savedSagaStepAggregate,
      );

      const result = await repository.save(sagaStepAggregate);

      expect(result).toBe(savedSagaStepAggregate);
      expect(mockSagaStepTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
        sagaStepAggregate,
      );
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockSagaStepTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
    });
  });

  describe('delete', () => {
    it('should soft delete saga step and return true', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(sagaStepId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(sagaStepId);
    });

    it('should return false when saga step does not exist', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(sagaStepId);

      expect(result).toBe(false);
    });
  });
});
