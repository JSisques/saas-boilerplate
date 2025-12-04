import { FindSagaStepsBySagaInstanceIdQuery } from '@/saga-context/saga-step/application/queries/saga-step-find-by-saga-instance-id/saga-step-find-by-saga-instance-id.query';
import { FindSagaStepsBySagaInstanceIdQueryHandler } from '@/saga-context/saga-step/application/queries/saga-step-find-by-saga-instance-id/saga-step-find-by-saga-instance-id.query-handler';
import {
  SAGA_STEP_WRITE_REPOSITORY_TOKEN,
  SagaStepWriteRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
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
import { Test } from '@nestjs/testing';

describe('FindSagaStepsBySagaInstanceIdQueryHandler', () => {
  let handler: FindSagaStepsBySagaInstanceIdQueryHandler;
  let mockSagaStepWriteRepository: jest.Mocked<SagaStepWriteRepository>;

  beforeEach(async () => {
    mockSagaStepWriteRepository = {
      findById: jest.fn(),
      findBySagaInstanceId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaStepWriteRepository>;

    const module = await Test.createTestingModule({
      providers: [
        FindSagaStepsBySagaInstanceIdQueryHandler,
        {
          provide: SAGA_STEP_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaStepWriteRepository,
        },
      ],
    }).compile();

    handler = module.get<FindSagaStepsBySagaInstanceIdQueryHandler>(
      FindSagaStepsBySagaInstanceIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createSagaStepAggregate = (
    id: string,
    sagaInstanceId: string,
    name: string,
    order: number,
  ): SagaStepAggregate => {
    const now = new Date();
    return new SagaStepAggregate(
      {
        id: new SagaStepUuidValueObject(id),
        sagaInstanceId: new SagaInstanceUuidValueObject(sagaInstanceId),
        name: new SagaStepNameValueObject(name),
        order: new SagaStepOrderValueObject(order),
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

  describe('execute', () => {
    it('should return array of saga step aggregates when saga steps exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaInstanceId };
      const query = new FindSagaStepsBySagaInstanceIdQuery(queryDto);

      const mockSagaSteps = [
        createSagaStepAggregate(
          '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId,
          'Process Payment',
          1,
        ),
        createSagaStepAggregate(
          '223e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId,
          'Send Email',
          2,
        ),
      ];

      mockSagaStepWriteRepository.findBySagaInstanceId.mockResolvedValue(
        mockSagaSteps,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockSagaSteps);
      expect(result).toHaveLength(2);
      expect(
        mockSagaStepWriteRepository.findBySagaInstanceId,
      ).toHaveBeenCalledWith(sagaInstanceId);
      expect(
        mockSagaStepWriteRepository.findBySagaInstanceId,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no saga steps exist for saga instance', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaInstanceId };
      const query = new FindSagaStepsBySagaInstanceIdQuery(queryDto);

      mockSagaStepWriteRepository.findBySagaInstanceId.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(
        mockSagaStepWriteRepository.findBySagaInstanceId,
      ).toHaveBeenCalledWith(sagaInstanceId);
    });

    it('should return saga steps ordered by order field', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaInstanceId };
      const query = new FindSagaStepsBySagaInstanceIdQuery(queryDto);

      const mockSagaSteps = [
        createSagaStepAggregate(
          '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId,
          'Step 2',
          2,
        ),
        createSagaStepAggregate(
          '223e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId,
          'Step 1',
          1,
        ),
        createSagaStepAggregate(
          '323e4567-e89b-12d3-a456-426614174002',
          sagaInstanceId,
          'Step 3',
          3,
        ),
      ];

      mockSagaStepWriteRepository.findBySagaInstanceId.mockResolvedValue(
        mockSagaSteps,
      );

      const result = await handler.execute(query);

      expect(result).toHaveLength(3);
      expect(result[0].order.value).toBe(2);
      expect(result[1].order.value).toBe(1);
      expect(result[2].order.value).toBe(3);
    });
  });
});
