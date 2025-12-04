import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogAggregateFactory } from '@/saga-context/saga-log/domain/factories/saga-log-aggregate/saga-log-aggregate.factory';
import { SagaLogPrismaDto } from '@/saga-context/saga-log/infrastructure/database/prisma/dtos/saga-log-prisma.dto';
import { SagaLogPrismaMapper } from '@/saga-context/saga-log/infrastructure/database/prisma/mappers/saga-log-prisma.mapper';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { Test } from '@nestjs/testing';

describe('SagaLogPrismaMapper', () => {
  let mapper: SagaLogPrismaMapper;
  let mockSagaLogAggregateFactory: jest.Mocked<SagaLogAggregateFactory>;

  beforeEach(async () => {
    mockSagaLogAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SagaLogAggregateFactory>;

    const module = await Test.createTestingModule({
      providers: [
        SagaLogPrismaMapper,
        {
          provide: SagaLogAggregateFactory,
          useValue: mockSagaLogAggregateFactory,
        },
      ],
    }).compile();

    mapper = module.get<SagaLogPrismaMapper>(SagaLogPrismaMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  describe('toDomainEntity', () => {
    it('should convert Prisma data to domain entity with all properties', () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');

      const prismaData: SagaLogPrismaDto = {
        id: sagaLogId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
        createdAt: now,
        updatedAt: now,
      };

      const mockAggregate = createSagaLogAggregate();

      mockSagaLogAggregateFactory.fromPrimitives.mockReturnValue(mockAggregate);

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockAggregate);
      expect(mockSagaLogAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: sagaLogId,
        sagaInstanceId: prismaData.sagaInstanceId,
        sagaStepId: prismaData.sagaStepId,
        type: prismaData.type,
        message: prismaData.message,
        createdAt: now,
        updatedAt: now,
      });
      expect(mockSagaLogAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should convert Prisma data with different log types', () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');
      const types = [
        SagaLogTypeEnum.INFO,
        SagaLogTypeEnum.WARNING,
        SagaLogTypeEnum.ERROR,
        SagaLogTypeEnum.DEBUG,
      ];

      types.forEach((type) => {
        const prismaData: SagaLogPrismaDto = {
          id: sagaLogId,
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: type,
          message: `Test message for ${type}`,
          createdAt: now,
          updatedAt: now,
        };

        const mockAggregate = createSagaLogAggregate();
        mockSagaLogAggregateFactory.fromPrimitives.mockReturnValue(
          mockAggregate,
        );

        const result = mapper.toDomainEntity(prismaData);

        expect(result).toBe(mockAggregate);
        expect(mockSagaLogAggregateFactory.fromPrimitives).toHaveBeenCalledWith(
          {
            id: sagaLogId,
            sagaInstanceId: prismaData.sagaInstanceId,
            sagaStepId: prismaData.sagaStepId,
            type: type,
            message: prismaData.message,
            createdAt: now,
            updatedAt: now,
          },
        );
      });
    });
  });

  describe('toPrismaData', () => {
    it('should convert domain entity to Prisma data with all properties', () => {
      const aggregate = createSagaLogAggregate();

      const result = mapper.toPrismaData(aggregate);

      expect(result).toEqual({
        id: aggregate.id.value,
        sagaInstanceId: aggregate.sagaInstanceId.value,
        sagaStepId: aggregate.sagaStepId.value,
        type: aggregate.type.value,
        message: aggregate.message.value,
        createdAt: aggregate.createdAt.value,
        updatedAt: aggregate.updatedAt.value,
      });
    });

    it('should convert domain entity with different log types', () => {
      const now = new Date();
      const types = [
        SagaLogTypeEnum.INFO,
        SagaLogTypeEnum.WARNING,
        SagaLogTypeEnum.ERROR,
        SagaLogTypeEnum.DEBUG,
      ];

      types.forEach((type) => {
        const aggregate = new SagaLogAggregate(
          {
            id: new SagaLogUuidValueObject(),
            sagaInstanceId: new SagaInstanceUuidValueObject(),
            sagaStepId: new SagaStepUuidValueObject(),
            type: new SagaLogTypeValueObject(type),
            message: new SagaLogMessageValueObject(`Test message for ${type}`),
            createdAt: new DateValueObject(now),
            updatedAt: new DateValueObject(now),
          },
          false,
        );

        const result = mapper.toPrismaData(aggregate);

        expect(result.type).toBe(type);
        expect(result.message).toBe(`Test message for ${type}`);
      });
    });
  });
});
