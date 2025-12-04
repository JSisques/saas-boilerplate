import { SagaStepNotFoundException } from '@/saga-context/saga-step/application/exceptions/saga-step-not-found/saga-step-not-found.exception';
import { AssertSagaStepExistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-exists/assert-saga-step-exists.service';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import {
  SAGA_STEP_WRITE_REPOSITORY_TOKEN,
  SagaStepWriteRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { Test } from '@nestjs/testing';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepNameValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-name/saga-step-name.vo';
import { SagaStepOrderValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-order/saga-step-order.vo';
import { SagaStepStatusValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-status/saga-step-status.vo';
import { SagaStepRetryCountValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-retry-count/saga-step-retry-count.vo';
import { SagaStepMaxRetriesValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-max-retries/saga-step-max-retries.vo';
import { SagaStepPayloadValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-payload/saga-step-payload.vo';
import { SagaStepResultValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-result/saga-step-result.vo';

describe('AssertSagaStepExistsService', () => {
  let service: AssertSagaStepExistsService;
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
        AssertSagaStepExistsService,
        {
          provide: SAGA_STEP_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaStepWriteRepository,
        },
      ],
    }).compile();

    service = module.get<AssertSagaStepExistsService>(
      AssertSagaStepExistsService,
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
    it('should return saga step when it exists', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const existingSagaStep = createSagaStepAggregate();

      mockSagaStepWriteRepository.findById.mockResolvedValue(existingSagaStep);

      const result = await service.execute(sagaStepId);

      expect(result).toBe(existingSagaStep);
      expect(mockSagaStepWriteRepository.findById).toHaveBeenCalledWith(
        sagaStepId,
      );
      expect(mockSagaStepWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw SagaStepNotFoundException when saga step does not exist', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      mockSagaStepWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(sagaStepId)).rejects.toThrow(
        SagaStepNotFoundException,
      );
      expect(mockSagaStepWriteRepository.findById).toHaveBeenCalledWith(
        sagaStepId,
      );
    });

    it('should throw SagaStepNotFoundException with correct message', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      mockSagaStepWriteRepository.findById.mockResolvedValue(null);

      try {
        await service.execute(sagaStepId);
        fail('Should have thrown SagaStepNotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(SagaStepNotFoundException);
        expect(error.message).toContain(sagaStepId);
      }
    });
  });
});
