import { SagaStepAlreadyExistsException } from '@/saga-context/saga-step/application/exceptions/saga-step-already-exists/saga-step-already-exists.exception';
import { AssertSagaStepNotExsistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-not-exsits/assert-saga-step-not-exsits.service';
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

describe('AssertSagaStepNotExsistsService', () => {
  let service: AssertSagaStepNotExsistsService;
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
        AssertSagaStepNotExsistsService,
        {
          provide: SAGA_STEP_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaStepWriteRepository,
        },
      ],
    }).compile();

    service = module.get<AssertSagaStepNotExsistsService>(
      AssertSagaStepNotExsistsService,
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
    it('should return void when saga step does not exist', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';

      mockSagaStepWriteRepository.findById.mockResolvedValue(null);

      const result = await service.execute(sagaStepId);

      expect(result).toBeUndefined();
      expect(mockSagaStepWriteRepository.findById).toHaveBeenCalledWith(
        sagaStepId,
      );
      expect(mockSagaStepWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw SagaStepAlreadyExistsException when saga step exists', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const existingSagaStep = createSagaStepAggregate();

      mockSagaStepWriteRepository.findById.mockResolvedValue(existingSagaStep);

      await expect(service.execute(sagaStepId)).rejects.toThrow(
        SagaStepAlreadyExistsException,
      );
      expect(mockSagaStepWriteRepository.findById).toHaveBeenCalledWith(
        sagaStepId,
      );
    });

    it('should throw SagaStepAlreadyExistsException with correct message', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const existingSagaStep = createSagaStepAggregate();

      mockSagaStepWriteRepository.findById.mockResolvedValue(existingSagaStep);

      try {
        await service.execute(sagaStepId);
        fail('Should have thrown SagaStepAlreadyExistsException');
      } catch (error) {
        expect(error).toBeInstanceOf(SagaStepAlreadyExistsException);
        expect(error.message).toContain(sagaStepId);
      }
    });
  });
});
