import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepPrismaRepository } from '@/saga-context/saga-step/infrastructure/database/prisma/repositories/saga-step-prisma.repository';
import { SagaStepPrismaMapper } from '@/saga-context/saga-step/infrastructure/database/prisma/mappers/saga-step-prisma.mapper';
import { SagaStepPrismaDto } from '@/saga-context/saga-step/infrastructure/database/prisma/dtos/saga-step-prisma.dto';
import { SagaStepStatusEnum as PrismaSagaStepStatusEnum } from '@/prisma/master/client';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { SagaStepNameValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-name/saga-step-name.vo';
import { SagaStepOrderValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-order/saga-step-order.vo';
import { SagaStepStatusValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-status/saga-step-status.vo';
import { SagaStepRetryCountValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-retry-count/saga-step-retry-count.vo';
import { SagaStepMaxRetriesValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-max-retries/saga-step-max-retries.vo';
import { SagaStepPayloadValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-payload/saga-step-payload.vo';
import { SagaStepResultValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-result/saga-step-result.vo';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';

describe('SagaStepPrismaRepository', () => {
  let repository: SagaStepPrismaRepository;
  let mockPrismaService: any;
  let mockSagaStepPrismaMapper: jest.Mocked<SagaStepPrismaMapper>;
  let mockFindUnique: jest.Mock;
  let mockFindMany: jest.Mock;
  let mockUpsert: jest.Mock;
  let mockDelete: jest.Mock;

  const createSagaStepAggregate = (): SagaStepAggregate => {
    const now = new Date();
    return new SagaStepAggregate(
      {
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
        sagaStep: {
          findUnique: mockFindUnique,
          findMany: mockFindMany,
          upsert: mockUpsert,
          delete: mockDelete,
        },
      },
    } as any;

    mockSagaStepPrismaMapper = {
      toDomainEntity: jest.fn(),
      toPrismaData: jest.fn(),
    } as unknown as jest.Mocked<SagaStepPrismaMapper>;

    repository = new SagaStepPrismaRepository(
      mockPrismaService,
      mockSagaStepPrismaMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return saga step aggregate when saga step exists', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');

      const prismaData: SagaStepPrismaDto = {
        id: sagaStepId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: PrismaSagaStepStatusEnum.PENDING,
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

      const aggregate = createSagaStepAggregate();

      mockFindUnique.mockResolvedValue(prismaData);
      mockSagaStepPrismaMapper.toDomainEntity.mockReturnValue(aggregate);

      const result = await repository.findById(sagaStepId);

      expect(result).toBe(aggregate);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: sagaStepId },
      });
      expect(mockSagaStepPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
      expect(mockSagaStepPrismaMapper.toDomainEntity).toHaveBeenCalledTimes(1);
    });

    it('should return null when saga step does not exist', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindUnique.mockResolvedValue(null);

      const result = await repository.findById(sagaStepId);

      expect(result).toBeNull();
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: sagaStepId },
      });
      expect(mockSagaStepPrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findBySagaInstanceId', () => {
    it('should return array of saga step aggregates when saga steps exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');

      const prismaData: SagaStepPrismaDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: sagaInstanceId,
          name: 'Process Payment',
          order: 1,
          status: PrismaSagaStepStatusEnum.PENDING,
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          payload: {},
          result: {},
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '323e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId: sagaInstanceId,
          name: 'Send Email',
          order: 2,
          status: PrismaSagaStepStatusEnum.COMPLETED,
          startDate: new Date('2024-01-01T10:00:00Z'),
          endDate: new Date('2024-01-01T11:00:00Z'),
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          payload: {},
          result: {},
          createdAt: now,
          updatedAt: now,
        },
      ];

      const aggregates = prismaData.map(() => createSagaStepAggregate());

      mockFindMany.mockResolvedValue(prismaData);
      mockSagaStepPrismaMapper.toDomainEntity
        .mockReturnValueOnce(aggregates[0])
        .mockReturnValueOnce(aggregates[1]);

      const result = await repository.findBySagaInstanceId(sagaInstanceId);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe(aggregates[0]);
      expect(result[1]).toBe(aggregates[1]);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { sagaInstanceId },
      });
      expect(mockSagaStepPrismaMapper.toDomainEntity).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no saga steps exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';

      mockFindMany.mockResolvedValue([]);

      const result = await repository.findBySagaInstanceId(sagaInstanceId);

      expect(result).toEqual([]);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { sagaInstanceId },
      });
      expect(mockSagaStepPrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save saga step aggregate using upsert', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');

      const aggregate = new SagaStepAggregate(
        {
          id: new SagaStepUuidValueObject(sagaStepId),
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

      const prismaData: SagaStepPrismaDto = {
        id: sagaStepId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: PrismaSagaStepStatusEnum.PENDING,
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

      const savedPrismaData: SagaStepPrismaDto = {
        ...prismaData,
        updatedAt: new Date(),
      };

      const savedAggregate = createSagaStepAggregate();

      mockSagaStepPrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockResolvedValue(savedPrismaData);
      mockSagaStepPrismaMapper.toDomainEntity.mockReturnValue(savedAggregate);

      const result = await repository.save(aggregate);

      expect(result).toBe(savedAggregate);
      expect(mockSagaStepPrismaMapper.toPrismaData).toHaveBeenCalledWith(
        aggregate,
      );
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: sagaStepId },
        update: prismaData,
        create: prismaData,
      });
      expect(mockSagaStepPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        savedPrismaData,
      );
    });
  });

  describe('delete', () => {
    it('should delete saga step by id', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      mockDelete.mockResolvedValue({
        id: sagaStepId,
      } as any);

      const result = await repository.delete(sagaStepId);

      expect(result).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: sagaStepId },
      });
    });
  });
});
