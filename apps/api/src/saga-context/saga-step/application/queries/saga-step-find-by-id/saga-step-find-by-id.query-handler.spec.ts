import { FindSagaStepByIdQuery } from '@/saga-context/saga-step/application/queries/saga-step-find-by-id/saga-step-find-by-id.query';
import { FindSagaStepByIdQueryHandler } from '@/saga-context/saga-step/application/queries/saga-step-find-by-id/saga-step-find-by-id.query-handler';
import { AssertSagaStepExsistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-exsits/assert-saga-step-exsits.service';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepNotFoundException } from '@/saga-context/saga-step/application/exceptions/saga-step-not-found/saga-step-not-found.exception';
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

describe('FindSagaStepByIdQueryHandler', () => {
  let handler: FindSagaStepByIdQueryHandler;
  let mockAssertSagaStepExsistsService: jest.Mocked<AssertSagaStepExsistsService>;

  beforeEach(async () => {
    mockAssertSagaStepExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaStepExsistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FindSagaStepByIdQueryHandler,
        {
          provide: AssertSagaStepExsistsService,
          useValue: mockAssertSagaStepExsistsService,
        },
      ],
    }).compile();

    handler = module.get<FindSagaStepByIdQueryHandler>(
      FindSagaStepByIdQueryHandler,
    );
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
        name: new SagaStepNameValueObject('Test Step'),
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

  describe('execute', () => {
    it('should return saga step aggregate when saga step exists', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaStepId };
      const query = new FindSagaStepByIdQuery(queryDto);

      const mockSagaStep = createSagaStepAggregate();

      mockAssertSagaStepExsistsService.execute.mockResolvedValue(mockSagaStep);

      const result = await handler.execute(query);

      expect(result).toBe(mockSagaStep);
      expect(mockAssertSagaStepExsistsService.execute).toHaveBeenCalledWith(
        sagaStepId,
      );
      expect(mockAssertSagaStepExsistsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw SagaStepNotFoundException when saga step does not exist', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaStepId };
      const query = new FindSagaStepByIdQuery(queryDto);

      const error = new SagaStepNotFoundException(sagaStepId);
      mockAssertSagaStepExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(
        SagaStepNotFoundException,
      );
      expect(mockAssertSagaStepExsistsService.execute).toHaveBeenCalledWith(
        sagaStepId,
      );
    });
  });
});
