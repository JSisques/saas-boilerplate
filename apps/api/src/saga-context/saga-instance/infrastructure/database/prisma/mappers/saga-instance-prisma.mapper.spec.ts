import { SagaStatusEnum } from '@/prisma/master/client';
import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceAggregateFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-aggregate/saga-instance-aggregate.factory';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstancePrismaDto } from '@/saga-context/saga-instance/infrastructure/database/prisma/dtos/saga-instance-prisma.dto';
import { SagaInstancePrismaMapper } from '@/saga-context/saga-instance/infrastructure/database/prisma/mappers/saga-instance-prisma.mapper';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { Test } from '@nestjs/testing';

describe('SagaInstancePrismaMapper', () => {
  let mapper: SagaInstancePrismaMapper;
  let mockSagaInstanceAggregateFactory: jest.Mocked<SagaInstanceAggregateFactory>;

  beforeEach(async () => {
    mockSagaInstanceAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceAggregateFactory>;

    const module = await Test.createTestingModule({
      providers: [
        SagaInstancePrismaMapper,
        {
          provide: SagaInstanceAggregateFactory,
          useValue: mockSagaInstanceAggregateFactory,
        },
      ],
    }).compile();

    mapper = module.get<SagaInstancePrismaMapper>(SagaInstancePrismaMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  describe('toDomainEntity', () => {
    it('should convert Prisma data to domain entity with all properties', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const prismaData: SagaInstancePrismaDto = {
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      };

      const mockAggregate = createSagaInstanceAggregate();

      mockSagaInstanceAggregateFactory.fromPrimitives.mockReturnValue(
        mockAggregate,
      );

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockAggregate);
      expect(
        mockSagaInstanceAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert Prisma data to domain entity with null optional fields', () => {
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

      const mockAggregate = createSagaInstanceAggregate();

      mockSagaInstanceAggregateFactory.fromPrimitives.mockReturnValue(
        mockAggregate,
      );

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockAggregate);
      expect(
        mockSagaInstanceAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toPrismaData', () => {
    it('should convert domain entity to Prisma data with all properties', () => {
      const sagaInstance = createSagaInstanceAggregate();
      const primitives = sagaInstance.toPrimitives();

      const result = mapper.toPrismaData(sagaInstance);

      expect(result).toEqual({
        id: primitives.id,
        name: primitives.name,
        status: primitives.status,
        startDate: primitives.startDate,
        endDate: primitives.endDate,
        createdAt: primitives.createdAt,
        updatedAt: primitives.updatedAt,
      });
    });

    it('should convert domain entity to Prisma data with null optional fields', () => {
      const sagaInstance = createSagaInstanceAggregate();

      const result = mapper.toPrismaData(sagaInstance);

      expect(result.startDate).toBeNull();
      expect(result.endDate).toBeNull();
    });
  });
});
