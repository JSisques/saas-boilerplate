import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { SagaLogTypeormEntity } from '@/saga-context/saga-log/infrastructure/database/typeorm/entities/saga-log-typeorm.entity';
import { SagaLogTypeormMapper } from '@/saga-context/saga-log/infrastructure/database/typeorm/mappers/saga-log-typeorm.mapper';
import { SagaLogTypeormRepository } from '@/saga-context/saga-log/infrastructure/database/typeorm/repositories/saga-log-typeorm.repository';
import { Repository } from 'typeorm';

describe('SagaLogTypeormRepository', () => {
  let repository: SagaLogTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockSagaLogTypeormMapper: jest.Mocked<SagaLogTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<SagaLogTypeormEntity>>;
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
    } as unknown as jest.Mocked<Repository<SagaLogTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockSagaLogTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<SagaLogTypeormMapper>;

    repository = new SagaLogTypeormRepository(
      mockTypeormMasterService,
      mockSagaLogTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return saga log aggregate when saga log exists', async () => {
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

      const sagaLogAggregate = new SagaLogAggregate(
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

      mockFindOne.mockResolvedValue(typeormEntity);
      mockSagaLogTypeormMapper.toDomainEntity.mockReturnValue(sagaLogAggregate);

      const result = await repository.findById(sagaLogId);

      expect(result).toBe(sagaLogAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: sagaLogId },
      });
      expect(mockSagaLogTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
    });

    it('should return null when saga log does not exist', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(sagaLogId);

      expect(result).toBeNull();
      expect(mockSagaLogTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findBySagaInstanceId', () => {
    it('should return saga log aggregates when saga logs exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const sagaStepId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new SagaLogTypeormEntity();
      typeormEntity.id = '123e4567-e89b-12d3-a456-426614174000';
      typeormEntity.sagaInstanceId = sagaInstanceId;
      typeormEntity.sagaStepId = sagaStepId;
      typeormEntity.type = SagaLogTypeEnum.INFO;
      typeormEntity.message = 'Test message';
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const sagaLogAggregate = new SagaLogAggregate(
        {
          id: new SagaLogUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          sagaInstanceId: new SagaInstanceUuidValueObject(sagaInstanceId),
          sagaStepId: new SagaStepUuidValueObject(sagaStepId),
          type: new SagaLogTypeValueObject(SagaLogTypeEnum.INFO),
          message: new SagaLogMessageValueObject('Test message'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFind.mockResolvedValue([typeormEntity]);
      mockSagaLogTypeormMapper.toDomainEntity.mockReturnValue(sagaLogAggregate);

      const result = await repository.findBySagaInstanceId(sagaInstanceId);

      expect(result).toEqual([sagaLogAggregate]);
      expect(mockFind).toHaveBeenCalledWith({
        where: { sagaInstanceId },
      });
    });

    it('should return empty array when no saga logs exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';

      mockFind.mockResolvedValue([]);

      const result = await repository.findBySagaInstanceId(sagaInstanceId);

      expect(result).toEqual([]);
      expect(mockSagaLogTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findBySagaStepId', () => {
    it('should return saga log aggregates when saga logs exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const sagaStepId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new SagaLogTypeormEntity();
      typeormEntity.id = '123e4567-e89b-12d3-a456-426614174000';
      typeormEntity.sagaInstanceId = sagaInstanceId;
      typeormEntity.sagaStepId = sagaStepId;
      typeormEntity.type = SagaLogTypeEnum.INFO;
      typeormEntity.message = 'Test message';
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;

      const sagaLogAggregate = new SagaLogAggregate(
        {
          id: new SagaLogUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          sagaInstanceId: new SagaInstanceUuidValueObject(sagaInstanceId),
          sagaStepId: new SagaStepUuidValueObject(sagaStepId),
          type: new SagaLogTypeValueObject(SagaLogTypeEnum.INFO),
          message: new SagaLogMessageValueObject('Test message'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockFind.mockResolvedValue([typeormEntity]);
      mockSagaLogTypeormMapper.toDomainEntity.mockReturnValue(sagaLogAggregate);

      const result = await repository.findBySagaStepId(sagaStepId);

      expect(result).toEqual([sagaLogAggregate]);
      expect(mockFind).toHaveBeenCalledWith({
        where: { sagaStepId },
      });
    });
  });

  describe('save', () => {
    it('should save saga log aggregate and return saved aggregate', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const sagaStepId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const sagaLogAggregate = new SagaLogAggregate(
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

      const typeormEntity = new SagaLogTypeormEntity();
      typeormEntity.id = sagaLogId;
      typeormEntity.sagaInstanceId = sagaInstanceId;
      typeormEntity.sagaStepId = sagaStepId;
      typeormEntity.type = SagaLogTypeEnum.INFO;
      typeormEntity.message = 'Test message';

      const savedTypeormEntity = new SagaLogTypeormEntity();
      savedTypeormEntity.id = sagaLogId;
      savedTypeormEntity.sagaInstanceId = sagaInstanceId;
      savedTypeormEntity.sagaStepId = sagaStepId;
      savedTypeormEntity.type = SagaLogTypeEnum.INFO;
      savedTypeormEntity.message = 'Test message';

      const savedSagaLogAggregate = new SagaLogAggregate(
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

      mockSagaLogTypeormMapper.toTypeormEntity.mockReturnValue(typeormEntity);
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockSagaLogTypeormMapper.toDomainEntity.mockReturnValue(
        savedSagaLogAggregate,
      );

      const result = await repository.save(sagaLogAggregate);

      expect(result).toBe(savedSagaLogAggregate);
      expect(mockSagaLogTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
        sagaLogAggregate,
      );
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockSagaLogTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
    });
  });

  describe('delete', () => {
    it('should soft delete saga log and return true', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(sagaLogId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(sagaLogId);
    });

    it('should return false when saga log does not exist', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(sagaLogId);

      expect(result).toBe(false);
    });
  });
});
