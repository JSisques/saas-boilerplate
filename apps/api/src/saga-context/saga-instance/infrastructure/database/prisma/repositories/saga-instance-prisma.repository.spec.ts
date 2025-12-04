import { SagaStatusEnum } from '@/prisma/master/client';
import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstancePrismaDto } from '@/saga-context/saga-instance/infrastructure/database/prisma/dtos/saga-instance-prisma.dto';
import { SagaInstancePrismaMapper } from '@/saga-context/saga-instance/infrastructure/database/prisma/mappers/saga-instance-prisma.mapper';
import { SagaInstancePrismaRepository } from '@/saga-context/saga-instance/infrastructure/database/prisma/repositories/saga-instance-prisma.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';

describe('SagaInstancePrismaRepository', () => {
  let repository: SagaInstancePrismaRepository;
  let mockPrismaService: any;
  let mockSagaInstancePrismaMapper: jest.Mocked<SagaInstancePrismaMapper>;
  let mockFindUnique: jest.Mock;
  let mockUpsert: jest.Mock;
  let mockDelete: jest.Mock;

  const createSagaInstanceAggregate = (): SagaInstanceAggregate => {
    const now = new Date();
    return new SagaInstanceAggregate(
      {
        id: new SagaInstanceUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        name: new SagaInstanceNameValueObject('Order Processing Saga'),
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
  };

  beforeEach(() => {
    mockFindUnique = jest.fn();
    mockUpsert = jest.fn();
    mockDelete = jest.fn();

    mockPrismaService = {
      client: {
        sagaInstance: {
          findUnique: mockFindUnique,
          upsert: mockUpsert,
          delete: mockDelete,
        },
      },
    } as any;

    mockSagaInstancePrismaMapper = {
      toDomainEntity: jest.fn(),
      toPrismaData: jest.fn(),
    } as unknown as jest.Mocked<SagaInstancePrismaMapper>;

    repository = new SagaInstancePrismaRepository(
      mockPrismaService,
      mockSagaInstancePrismaMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return saga instance aggregate when saga instance exists', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');

      const prismaData: SagaInstancePrismaDto = {
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = createSagaInstanceAggregate();

      mockFindUnique.mockResolvedValue(prismaData);
      mockSagaInstancePrismaMapper.toDomainEntity.mockReturnValue(aggregate);

      const result = await repository.findById(sagaInstanceId);

      expect(result).toBe(aggregate);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: sagaInstanceId },
      });
      expect(mockSagaInstancePrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
    });

    it('should return null when saga instance does not exist', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindUnique.mockResolvedValue(null);

      const result = await repository.findById(sagaInstanceId);

      expect(result).toBeNull();
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: sagaInstanceId },
      });
      expect(
        mockSagaInstancePrismaMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByName', () => {
    it('should return saga instance aggregate when saga instance exists', async () => {
      const name = 'Order Processing Saga';
      const now = new Date('2024-01-01T10:00:00Z');

      const prismaData: SagaInstancePrismaDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: name,
        status: SagaStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = createSagaInstanceAggregate();

      mockFindUnique.mockResolvedValue(prismaData);
      mockSagaInstancePrismaMapper.toDomainEntity.mockReturnValue(aggregate);

      const result = await repository.findByName(name);

      expect(result).toBe(aggregate);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { name },
      });
      expect(mockSagaInstancePrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
    });

    it('should return null when saga instance does not exist', async () => {
      const name = 'Order Processing Saga';

      mockFindUnique.mockResolvedValue(null);

      const result = await repository.findByName(name);

      expect(result).toBeNull();
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { name },
      });
      expect(
        mockSagaInstancePrismaMapper.toDomainEntity,
      ).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save saga instance aggregate', async () => {
      const sagaInstance = createSagaInstanceAggregate();
      const now = new Date('2024-01-01T10:00:00Z');

      const prismaData: SagaInstancePrismaDto = {
        id: sagaInstance.id.value,
        name: sagaInstance.name.value,
        status: sagaInstance.status.value as SagaStatusEnum,
        startDate: null,
        endDate: null,
        createdAt: now,
        updatedAt: now,
      };

      const savedPrismaData: SagaInstancePrismaDto = {
        ...prismaData,
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      };

      mockSagaInstancePrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockResolvedValue(savedPrismaData);
      mockSagaInstancePrismaMapper.toDomainEntity.mockReturnValue(sagaInstance);

      const result = await repository.save(sagaInstance);

      expect(result).toBe(sagaInstance);
      expect(mockSagaInstancePrismaMapper.toPrismaData).toHaveBeenCalledWith(
        sagaInstance,
      );
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: sagaInstance.id.value },
        update: prismaData,
        create: prismaData,
      });
      expect(mockSagaInstancePrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        savedPrismaData,
      );
    });
  });

  describe('delete', () => {
    it('should delete saga instance by id', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';

      mockDelete.mockResolvedValue({});

      const result = await repository.delete(sagaInstanceId);

      expect(result).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: sagaInstanceId },
      });
    });
  });
});
