import { SagaLogTypeEnum as PrismaSagaLogTypeEnum } from '@/prisma/master/client';
import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogPrismaDto } from '@/saga-context/saga-log/infrastructure/database/prisma/dtos/saga-log-prisma.dto';
import { SagaLogPrismaMapper } from '@/saga-context/saga-log/infrastructure/database/prisma/mappers/saga-log-prisma.mapper';
import { SagaLogPrismaRepository } from '@/saga-context/saga-log/infrastructure/database/prisma/repositories/saga-log-prisma.repository';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';

describe('SagaLogPrismaRepository', () => {
  let repository: SagaLogPrismaRepository;
  let mockPrismaService: any;
  let mockSagaLogPrismaMapper: jest.Mocked<SagaLogPrismaMapper>;
  let mockFindUnique: jest.Mock;
  let mockFindMany: jest.Mock;
  let mockUpsert: jest.Mock;
  let mockDelete: jest.Mock;

  const createSagaLogAggregate = (): SagaLogAggregate => {
    const now = new Date();
    return new SagaLogAggregate(
      {
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
      },
      false,
    );
  };

  beforeEach(() => {
    mockFindUnique = jest.fn();
    mockFindMany = jest.fn();
    mockUpsert = jest.fn();
    mockDelete = jest.fn();

    mockPrismaService = {
      client: {
        sagaLog: {
          findUnique: mockFindUnique,
          findMany: mockFindMany,
          upsert: mockUpsert,
          delete: mockDelete,
        },
      },
    } as any;

    mockSagaLogPrismaMapper = {
      toDomainEntity: jest.fn(),
      toPrismaData: jest.fn(),
    } as unknown as jest.Mocked<SagaLogPrismaMapper>;

    repository = new SagaLogPrismaRepository(
      mockPrismaService as PrismaMasterService,
      mockSagaLogPrismaMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return saga log aggregate when saga log exists', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');

      const prismaData: SagaLogPrismaDto = {
        id: sagaLogId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: PrismaSagaLogTypeEnum.INFO,
        message: 'Test log message',
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = createSagaLogAggregate();

      mockFindUnique.mockResolvedValue(prismaData);
      mockSagaLogPrismaMapper.toDomainEntity.mockReturnValue(aggregate);

      const result = await repository.findById(sagaLogId);

      expect(result).toBe(aggregate);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: sagaLogId },
      });
      expect(mockSagaLogPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
      expect(mockSagaLogPrismaMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when saga log does not exist', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindUnique.mockResolvedValue(null);

      const result = await repository.findById(sagaLogId);

      expect(result).toBeNull();
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: sagaLogId },
      });
      expect(mockSagaLogPrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findBySagaInstanceId', () => {
    it('should return array of saga log aggregates when saga logs exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');

      const prismaData: SagaLogPrismaDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: sagaInstanceId,
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: PrismaSagaLogTypeEnum.INFO,
          message: 'Log message 1',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId: sagaInstanceId,
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: PrismaSagaLogTypeEnum.ERROR,
          message: 'Log message 2',
          createdAt: now,
          updatedAt: now,
        },
      ];

      const aggregates = prismaData.map(() => createSagaLogAggregate());

      mockFindMany.mockResolvedValue(prismaData);
      prismaData.forEach((data, index) => {
        mockSagaLogPrismaMapper.toDomainEntity.mockReturnValueOnce(
          aggregates[index],
        );
      });

      const result = await repository.findBySagaInstanceId(sagaInstanceId);

      expect(result).toHaveLength(2);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { sagaInstanceId },
      });
      expect(mockSagaLogPrismaMapper.toDomainEntity).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no saga logs exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';

      mockFindMany.mockResolvedValue([]);

      const result = await repository.findBySagaInstanceId(sagaInstanceId);

      expect(result).toEqual([]);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { sagaInstanceId },
      });
      expect(mockSagaLogPrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findBySagaStepId', () => {
    it('should return array of saga log aggregates when saga logs exist', async () => {
      const sagaStepId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');

      const prismaData: SagaLogPrismaDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: sagaStepId,
          type: PrismaSagaLogTypeEnum.INFO,
          message: 'Log message 1',
          createdAt: now,
          updatedAt: now,
        },
      ];

      const aggregates = prismaData.map(() => createSagaLogAggregate());

      mockFindMany.mockResolvedValue(prismaData);
      prismaData.forEach((data, index) => {
        mockSagaLogPrismaMapper.toDomainEntity.mockReturnValueOnce(
          aggregates[index],
        );
      });

      const result = await repository.findBySagaStepId(sagaStepId);

      expect(result).toHaveLength(1);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { sagaStepId },
      });
      expect(mockSagaLogPrismaMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    it('should save saga log aggregate', async () => {
      const aggregate = createSagaLogAggregate();
      const now = new Date('2024-01-01T10:00:00Z');

      const prismaData: SagaLogPrismaDto = {
        id: aggregate.id.value,
        sagaInstanceId: aggregate.sagaInstanceId.value,
        sagaStepId: aggregate.sagaStepId.value,
        type: PrismaSagaLogTypeEnum.INFO,
        message: aggregate.message.value,
        createdAt: now,
        updatedAt: now,
      };

      const savedPrismaData: SagaLogPrismaDto = {
        ...prismaData,
        createdAt: now,
        updatedAt: now,
      };

      mockSagaLogPrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockResolvedValue(savedPrismaData);
      mockSagaLogPrismaMapper.toDomainEntity.mockReturnValue(aggregate);

      const result = await repository.save(aggregate);

      expect(result).toBe(aggregate);
      expect(mockSagaLogPrismaMapper.toPrismaData).toHaveBeenCalledWith(
        aggregate,
      );
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: aggregate.id.value },
        update: prismaData,
        create: prismaData,
      });
      expect(mockSagaLogPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        savedPrismaData,
      );
    });
  });

  describe('delete', () => {
    it('should delete saga log by id', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';

      mockDelete.mockResolvedValue(undefined);

      const result = await repository.delete(sagaLogId);

      expect(result).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: sagaLogId },
      });
    });
  });
});
