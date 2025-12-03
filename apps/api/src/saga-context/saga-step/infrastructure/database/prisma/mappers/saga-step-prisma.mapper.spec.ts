import { SagaStepStatusEnum as PrismaSagaStepStatusEnum } from '@/prisma/master/client';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepAggregateFactory } from '@/saga-context/saga-step/domain/factories/saga-step-aggregate/saga-step-aggregate.factory';
import { SagaStepEndDateValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-end-date/saga-step-end-date.vo';
import { SagaStepErrorMessageValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-error-message/saga-step-error-message.vo';
import { SagaStepMaxRetriesValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-max-retries/saga-step-max-retries.vo';
import { SagaStepNameValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-name/saga-step-name.vo';
import { SagaStepOrderValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-order/saga-step-order.vo';
import { SagaStepPayloadValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-payload/saga-step-payload.vo';
import { SagaStepResultValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-result/saga-step-result.vo';
import { SagaStepRetryCountValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-retry-count/saga-step-retry-count.vo';
import { SagaStepStartDateValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-start-date/saga-step-start-date.vo';
import { SagaStepStatusValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-status/saga-step-status.vo';
import { SagaStepPrismaDto } from '@/saga-context/saga-step/infrastructure/database/prisma/dtos/saga-step-prisma.dto';
import { SagaStepPrismaMapper } from '@/saga-context/saga-step/infrastructure/database/prisma/mappers/saga-step-prisma.mapper';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { Test } from '@nestjs/testing';

describe('SagaStepPrismaMapper', () => {
  let mapper: SagaStepPrismaMapper;
  let mockSagaStepAggregateFactory: jest.Mocked<SagaStepAggregateFactory>;

  beforeEach(async () => {
    mockSagaStepAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<SagaStepAggregateFactory>;

    const module = await Test.createTestingModule({
      providers: [
        SagaStepPrismaMapper,
        {
          provide: SagaStepAggregateFactory,
          useValue: mockSagaStepAggregateFactory,
        },
      ],
    }).compile();

    mapper = module.get<SagaStepPrismaMapper>(SagaStepPrismaMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  describe('toDomainEntity', () => {
    it('should convert Prisma data to domain entity with all properties', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const prismaData: SagaStepPrismaDto = {
        id: sagaStepId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: PrismaSagaStepStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        errorMessage: null,
        retryCount: 2,
        maxRetries: 5,
        payload: { orderId: '12345' },
        result: { success: true },
        createdAt: now,
        updatedAt: now,
      };

      const mockAggregate = createSagaStepAggregate();

      mockSagaStepAggregateFactory.fromPrimitives.mockReturnValue(
        mockAggregate,
      );

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockAggregate);
      expect(mockSagaStepAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: sagaStepId,
        sagaInstanceId: prismaData.sagaInstanceId,
        name: prismaData.name,
        order: prismaData.order,
        status: prismaData.status,
        startDate: prismaData.startDate,
        endDate: prismaData.endDate,
        errorMessage: prismaData.errorMessage,
        retryCount: prismaData.retryCount,
        maxRetries: prismaData.maxRetries,
        payload: prismaData.payload,
        result: prismaData.result,
        createdAt: now,
        updatedAt: now,
      });
      expect(mockSagaStepAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should convert Prisma data to domain entity with null optional properties', () => {
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

      const mockAggregate = createSagaStepAggregate();

      mockSagaStepAggregateFactory.fromPrimitives.mockReturnValue(
        mockAggregate,
      );

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockAggregate);
      expect(mockSagaStepAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: sagaStepId,
        sagaInstanceId: prismaData.sagaInstanceId,
        name: prismaData.name,
        order: prismaData.order,
        status: prismaData.status,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: prismaData.retryCount,
        maxRetries: prismaData.maxRetries,
        payload: prismaData.payload,
        result: prismaData.result,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert Prisma data with different status values', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');
      const statuses = [
        PrismaSagaStepStatusEnum.PENDING,
        PrismaSagaStepStatusEnum.STARTED,
        PrismaSagaStepStatusEnum.RUNNING,
        PrismaSagaStepStatusEnum.COMPLETED,
        PrismaSagaStepStatusEnum.FAILED,
      ];

      statuses.forEach((status) => {
        const prismaData: SagaStepPrismaDto = {
          id: sagaStepId,
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          name: 'Process Payment',
          order: 1,
          status: status,
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

        const mockAggregate = createSagaStepAggregate();
        mockSagaStepAggregateFactory.fromPrimitives.mockReturnValue(
          mockAggregate,
        );

        const result = mapper.toDomainEntity(prismaData);

        expect(result).toBe(mockAggregate);
        expect(
          mockSagaStepAggregateFactory.fromPrimitives,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            status: status,
          }),
        );
      });
    });
  });

  describe('toPrismaData', () => {
    it('should convert domain entity to Prisma data with all properties', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const aggregate = new SagaStepAggregate(
        {
          id: new SagaStepUuidValueObject(sagaStepId),
          sagaInstanceId: new SagaInstanceUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          name: new SagaStepNameValueObject('Process Payment'),
          order: new SagaStepOrderValueObject(1),
          status: new SagaStepStatusValueObject(SagaStepStatusEnum.COMPLETED),
          startDate: new SagaStepStartDateValueObject(startDate),
          endDate: new SagaStepEndDateValueObject(endDate),
          errorMessage: null,
          retryCount: new SagaStepRetryCountValueObject(2),
          maxRetries: new SagaStepMaxRetriesValueObject(5),
          payload: new SagaStepPayloadValueObject({ orderId: '12345' }),
          result: new SagaStepResultValueObject({ success: true }),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const result = mapper.toPrismaData(aggregate);

      expect(result.id).toBe(sagaStepId);
      expect(result.sagaInstanceId).toBe(
        '223e4567-e89b-12d3-a456-426614174000',
      );
      expect(result.name).toBe('Process Payment');
      expect(result.order).toBe(1);
      expect(result.status).toBe(PrismaSagaStepStatusEnum.COMPLETED);
      expect(result.startDate).toEqual(startDate);
      expect(result.endDate).toEqual(endDate);
      expect(result.errorMessage).toBeNull();
      expect(result.retryCount).toBe(2);
      expect(result.maxRetries).toBe(5);
      expect(result.payload).toEqual({ orderId: '12345' });
      expect(result.result).toEqual({ success: true });
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should convert domain entity to Prisma data with null optional properties', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      const aggregate = createSagaStepAggregate();

      const result = mapper.toPrismaData(aggregate);

      expect(result.id).toBe(sagaStepId);
      expect(result.sagaInstanceId).toBe(
        '223e4567-e89b-12d3-a456-426614174000',
      );
      expect(result.name).toBe('Process Payment');
      expect(result.order).toBe(1);
      expect(result.status).toBe(PrismaSagaStepStatusEnum.PENDING);
      expect(result.startDate).toBeNull();
      expect(result.endDate).toBeNull();
      expect(result.errorMessage).toBeNull();
      expect(result.retryCount).toBe(0);
      expect(result.maxRetries).toBe(3);
      expect(result.payload).toEqual({});
      expect(result.result).toBeDefined(); // Can be null or {}
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should convert domain entity with failed status and error message', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date('2024-01-01T10:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const aggregate = new SagaStepAggregate(
        {
          id: new SagaStepUuidValueObject(sagaStepId),
          sagaInstanceId: new SagaInstanceUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          name: new SagaStepNameValueObject('Process Payment'),
          order: new SagaStepOrderValueObject(1),
          status: new SagaStepStatusValueObject(SagaStepStatusEnum.FAILED),
          startDate: new SagaStepStartDateValueObject(startDate),
          endDate: new SagaStepEndDateValueObject(endDate),
          errorMessage: new SagaStepErrorMessageValueObject(
            'Payment processing failed',
          ),
          retryCount: new SagaStepRetryCountValueObject(3),
          maxRetries: new SagaStepMaxRetriesValueObject(3),
          payload: new SagaStepPayloadValueObject({ orderId: '12345' }),
          result: new SagaStepResultValueObject({}),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const result = mapper.toPrismaData(aggregate);

      expect(result.status).toBe(PrismaSagaStepStatusEnum.FAILED);
      expect(result.errorMessage).toBe('Payment processing failed');
      expect(result.retryCount).toBe(3);
    });
  });
});
