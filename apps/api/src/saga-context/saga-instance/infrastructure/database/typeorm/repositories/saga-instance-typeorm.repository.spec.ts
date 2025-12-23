import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceEndDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-end-date/saga-instance-end-date.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStartDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-start-date/saga-instance-start-date.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceTypeormEntity } from '@/saga-context/saga-instance/infrastructure/database/typeorm/entities/saga-instance-typeorm.entity';
import { SagaInstanceTypeormMapper } from '@/saga-context/saga-instance/infrastructure/database/typeorm/mappers/saga-instance-typeorm.mapper';
import { SagaInstanceTypeormRepository } from '@/saga-context/saga-instance/infrastructure/database/typeorm/repositories/saga-instance-typeorm.repository';
import { Repository } from 'typeorm';

describe('SagaInstanceTypeormRepository', () => {
  let repository: SagaInstanceTypeormRepository;
  let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
  let mockSagaInstanceTypeormMapper: jest.Mocked<SagaInstanceTypeormMapper>;
  let mockTypeormRepository: jest.Mocked<Repository<SagaInstanceTypeormEntity>>;
  let mockFindOne: jest.Mock;
  let mockSave: jest.Mock;
  let mockSoftDelete: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockSave = jest.fn();
    mockSoftDelete = jest.fn();

    mockTypeormRepository = {
      findOne: mockFindOne,
      save: mockSave,
      softDelete: mockSoftDelete,
    } as unknown as jest.Mocked<Repository<SagaInstanceTypeormEntity>>;

    mockTypeormMasterService = {
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
    } as unknown as jest.Mocked<TypeormMasterService>;

    mockSagaInstanceTypeormMapper = {
      toDomainEntity: jest.fn(),
      toTypeormEntity: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceTypeormMapper>;

    repository = new SagaInstanceTypeormRepository(
      mockTypeormMasterService,
      mockSagaInstanceTypeormMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return saga instance aggregate when saga instance exists', async () => {
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

      const sagaInstanceAggregate = new SagaInstanceAggregate(
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

      mockFindOne.mockResolvedValue(typeormEntity);
      mockSagaInstanceTypeormMapper.toDomainEntity.mockReturnValue(
        sagaInstanceAggregate,
      );

      const result = await repository.findById(sagaInstanceId);

      expect(result).toBe(sagaInstanceAggregate);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: sagaInstanceId },
      });
      expect(mockSagaInstanceTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        typeormEntity,
      );
      expect(
        mockSagaInstanceTypeormMapper.toDomainEntity,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return null when saga instance does not exist', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindOne.mockResolvedValue(null);

      const result = await repository.findById(sagaInstanceId);

      expect(result).toBeNull();
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: sagaInstanceId },
      });
      expect(
        mockSagaInstanceTypeormMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save saga instance aggregate and return saved aggregate', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const startDate = new Date();
      const endDate = new Date();

      const sagaInstanceAggregate = new SagaInstanceAggregate(
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

      const typeormEntity = new SagaInstanceTypeormEntity();
      typeormEntity.id = sagaInstanceId;
      typeormEntity.name = 'test-saga-instance';
      typeormEntity.status = SagaInstanceStatusEnum.COMPLETED;
      typeormEntity.startDate = startDate;
      typeormEntity.endDate = endDate;

      const savedTypeormEntity = new SagaInstanceTypeormEntity();
      savedTypeormEntity.id = sagaInstanceId;
      savedTypeormEntity.name = 'test-saga-instance';
      savedTypeormEntity.status = SagaInstanceStatusEnum.COMPLETED;
      savedTypeormEntity.startDate = startDate;
      savedTypeormEntity.endDate = endDate;

      const savedSagaInstanceAggregate = new SagaInstanceAggregate(
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

      mockSagaInstanceTypeormMapper.toTypeormEntity.mockReturnValue(
        typeormEntity,
      );
      mockSave.mockResolvedValue(savedTypeormEntity);
      mockSagaInstanceTypeormMapper.toDomainEntity.mockReturnValue(
        savedSagaInstanceAggregate,
      );

      const result = await repository.save(sagaInstanceAggregate);

      expect(result).toBe(savedSagaInstanceAggregate);
      expect(
        mockSagaInstanceTypeormMapper.toTypeormEntity,
      ).toHaveBeenCalledWith(sagaInstanceAggregate);
      expect(mockSave).toHaveBeenCalledWith(typeormEntity);
      expect(mockSagaInstanceTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
        savedTypeormEntity,
      );
      expect(mockFindOne).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete saga instance and return true', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(sagaInstanceId);

      expect(result).toBe(true);
      expect(mockSoftDelete).toHaveBeenCalledWith(sagaInstanceId);
      expect(mockSoftDelete).toHaveBeenCalledTimes(1);
    });

    it('should return false when saga instance does not exist', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';

      mockSoftDelete.mockResolvedValue({
        affected: 0,
        raw: [],
        generatedMaps: [],
      });

      const result = await repository.delete(sagaInstanceId);

      expect(result).toBe(false);
      expect(mockSoftDelete).toHaveBeenCalledWith(sagaInstanceId);
    });

    it('should handle delete errors correctly', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Saga instance not found');

      mockSoftDelete.mockRejectedValue(error);

      await expect(repository.delete(sagaInstanceId)).rejects.toThrow(error);
      expect(mockSoftDelete).toHaveBeenCalledWith(sagaInstanceId);
    });
  });
});
